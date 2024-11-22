import boto3

from .image_manager import Count, ImageID, ReferenceCounts


class DynamoRefernceCounts(ReferenceCounts):
    def __init__(self, table_name: str):
        super().__init__({})
        self._diffs = {}
        self.table_name = table_name
        self.client = boto3.client("dynamodb", region_name="us-east-1")

    def __delitem__(self, key: ImageID):
        self.client.delete_item(TableName=self.table_name, Key={"ImageID": {"S": key}})
        del self._counts[key]

    def prune(self):
        response = self.client.scan(
            TableName=self.table_name,
            FilterExpression="confirmed < :min_confirmed AND unconfirmed < :min_unconfirmed",
            ExpressionAttributeValues={
                ":min_confirmed": {"N": "1"},
                ":min_unconfirmed": {"N": "1"},
            },
        )

        to_be_deleted = [{"ImageID": item["ImageID"]} for item in response.get("Items", [])]

        delete_requests = [{"DeleteRequest": {"Key": image_id}} for image_id in to_be_deleted]

        max_batch_size = 25
        for i in range(0, len(delete_requests), max_batch_size):
            stop = min(i + max_batch_size, len(delete_requests))
            batch = delete_requests[i:stop]
            response = self.client.batch_write_item(RequestItems={self.table_name: batch})

            # Retry unprocessed items
            unprocessed = response.get("UnprocessedItems", {})
            while unprocessed:
                response = self.client.batch_write_item(RequestItems=unprocessed)
                unprocessed = response.get("UnprocessedItems", {})

            for j in range(i, stop):
                del self._counts[to_be_deleted[j]["ImageID"]["S"]]

    def write(self):
        items = [
            {
                "PutRequest": {
                    "Item": {
                        "ImageID": {"S": image_id},
                        "confirmed": {"N": str(count.confirmed)},
                        "unconfirmed": {"N": str(count.unconfirmed)},
                    }
                }
            }
            for image_id, count in self._counts.items()
        ]
        max_batch_size = 25
        for i in range(0, len(items), max_batch_size):
            batch = items[i : i + max_batch_size]
            response = self.client.batch_write_item(RequestItems={self.table_name: batch})

            # Check for unprocessed items and retry if necessary
            unprocessed = response.get("UnprocessedItems", {})
            while unprocessed:
                print(f"Retrying {len(unprocessed[self.table_name])} unprocessed items...")
                response = self.client.batch_write_item(RequestItems=unprocessed)
                unprocessed = response.get("UnprocessedItems", {})

    def read(self):
        response = self.client.scan(TableName=self.table_name)
        items = response.get("Items", [])
        self._counts = {
            item["ImageID"]["S"]: Count(int(item["confirmed"]["N"]), int(item["unconfirmed"]["N"]))
            for item in items
        }
