import os

from PIL import Image

from Image_process.processImage import ImageProcess


def test_resize_image():
    test_iamge = "tests/checkPhotos/test1.png"
    output_image = "tests/HostPhotos/test_image_resized.jpg"
    image_process = ImageProcess(test_iamge)
    image = image_process.resize_image()
    image_process.save_image(image, output_image)
    assert os.path.exists(output_image)
    #confirm the image is 128x128
    image = Image.open(output_image)
    assert image.size == (128, 128)
    #cleanup
    os.remove(output_image)

    test_image = "tests/checkPhotos/test5.jpeg"
    output_image = "tests/HostPhotos/test_image_resized.jpg"
    image_process = ImageProcess(test_image)
    image = image_process.resize_image()
    image_process.save_image(image, output_image)
    assert os.path.exists(output_image)
    #confirm the image is 128x128
    image = Image.open(output_image)
    assert image.size == (128, 128)

def test_save_image():
    test_image = "tests/checkPhotos/test1.png"
    output_image = "tests/HostPhotos/test_image_resized.jpg"
    image_process = ImageProcess(test_image)
    image = image_process.resize_image()
    image_process.save_image(image, output_image)
    assert os.path.exists(output_image)
    #cleanup
    os.remove(output_image)

    test_image = "tests/checkPhotos/test5.jpeg"
    output_image = "tests/HostPhotos/test_image_resized.jpg"
    image_process = ImageProcess(test_image)
    image = image_process.resize_image()
    image_process.save_image(image, output_image)
    assert os.path.exists(output_image)
    #cleanup
    os.remove(output_image)

def test_file_type():
    test_image = "tests/checkPhotos/test1.png"
    output_image = "tests/HostPhotos/test_image_resized.png"
    image_process = ImageProcess(test_image)
    image = image_process.resize_image()
    image_process.save_image(image, output_image)
    assert not os.path.exists(output_image) # should not exist because code normalizes to jpg
    true_output_image = "tests/HostPhotos/test_image_resized.jpg"
    assert os.path.exists(true_output_image)



    



