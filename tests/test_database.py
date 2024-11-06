import mongomock
import pytest

from Databases import CreateMangoDatabase

DB_NAME = "BingoMakerTestDB"
COLLECTION_NAME = "BingoMakerTestCollection"


class TilePoolDBTest(CreateMangoDatabase.TilePoolDB):
    def __init__(self):
        self.client = mongomock.MongoClient()
        self.db = self.client[DB_NAME]
        self.collection = self.db[COLLECTION_NAME]
        self.collection.create_index("Name", unique=True)


@pytest.fixture
def db():
    return TilePoolDBTest()


@pytest.fixture
def one_pool(db: TilePoolDBTest):
    pool_id = db.insert_tile_pool("NAME", ["1", "2", "3"], "owner", "Free")
    assert pool_id is not None
    return db, pool_id


@pytest.fixture
def many_pools(db: TilePoolDBTest):
    pool_ids: list[str] = []
    for i in range(10):
        pool_id = db.insert_tile_pool(
            f"Pool {i}", [f"{j+i}" for j in range(3)], "owner", f"Free {i}"
        )
        assert pool_id is not None
        pool_ids.append(pool_id)
    return db, pool_ids


def test_insert_query(db: TilePoolDBTest):
    pool_id = db.insert_tile_pool("NAME", ["1", "2", "3"], "owner", "Free")
    assert pool_id is not None

    pool = db.get_tile_pool(pool_id)
    assert pool is not None

    assert pool["Owner"] == "owner"
    assert pool["Name"] == "NAME"
    assert pool["Tiles"] == ["1", "2", "3"]
    assert pool["FreeTile"] == "Free"


def test_insert_delete(one_pool: tuple[TilePoolDBTest, str]):
    db, pool_id = one_pool
    assert db.delete_tile_pool(pool_id)
    assert db.get_tile_pool(pool_id) is None


def test_get_quantity_tile_pools(many_pools: tuple[TilePoolDBTest, list[str]]):
    db, pool_ids = many_pools
    assert db.get_tile_pools(0) is None
    assert db.get_tile_pools(-1) is None

    pools = db.get_tile_pools(5)
    assert pools is not None

    for pool in pools:
        assert str(pool["_id"]) in pool_ids


def test_delete_by_owner(many_pools: tuple[TilePoolDBTest, list[str]]):
    db, pool_ids = many_pools
    assert db.delete_tile_pool_by_owner("owner")
    for pool_id in pool_ids:
        assert db.get_tile_pool(pool_id) is None

def test_update_tiles():
    pass
