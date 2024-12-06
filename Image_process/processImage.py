from PIL import Image


class ImageProcess:
    def __init__(self, image_path):
        self.image_path = image_path

    def resize_image(self):
        """
        Resize the image to the specified width and height.
        :param width: Target width of the image.
        :param height: Target height of the image.
        :return: Resized Image object.
        """
        width = 128
        height = 128
        #if image isn't square raise a warning and resize to square
        image = Image.open(self.image_path)
        if image.size[0] != image.size[1]:
            print("Warning: Image is not square. Resizing to square.")

        return image.resize((width, height))
    
    def save_image(self, image, save_path):
        """
        Save the image to the specified path.
        :param image: Image object to save.
        :param save_path: File path to save the image.
        """
        #make sure file type is a jpg if not make it a jpg
        if not save_path.endswith(".jpg"):
            #remove the file extension before adding .jpg
            save_path = save_path.split(".")[0]
            save_path = save_path + ".jpg"
        try:
            image.save(save_path)
        except Exception as e:
            raise OSError(f"Failed to save image at {save_path}: {str(e)}") from e
if __name__ == "__main__":
    image_process = ImageProcess("tests/checkPhotos/test1.png")
    image = image_process.resize_image()
    image_process.save_image(image, "tests/HostPhotos/test_image_resized.jpg")