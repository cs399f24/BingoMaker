import io

import pytest
from PIL import Image

from Image_process.processImage import resize_gif, resize_image


@pytest.fixture
def large_image() -> io.BytesIO:
    buffer = io.BytesIO()
    image = Image.new("RGB", (1024, 1024), color="white")
    image.save(buffer, "JPEG")
    return buffer


@pytest.fixture
def small_image() -> io.BytesIO:
    buffer = io.BytesIO()
    image = Image.new("RGB", (50, 50), color="white")
    image.save(buffer, "JPEG")
    return buffer


@pytest.fixture
def gif() -> io.BytesIO:
    buffer = io.BytesIO()
    frames: list[Image.Image] = []
    for _ in range(5):
        frames.append(Image.new("RGB", (1024, 1024), color="white"))

    frames[0].save(buffer, format="GIF", save_all=True, append_images=frames[1:])

    return buffer


def test_resize_large_image(large_image: io.BytesIO):
    img = resize_image(large_image)
    assert img.size == (128, 128)


def test_resize_large_to_medium(large_image: io.BytesIO):
    img = resize_image(large_image, 512, 512)
    assert img.size == (512, 512)


def test_resize_small_image(small_image: io.BytesIO):
    img = resize_image(small_image)
    assert img.size == (128, 128)


def test_resize_small_to_medium(small_image: io.BytesIO):
    img = resize_image(small_image, 512, 512)
    assert img.size == (512, 512)


def test_resize_gif(gif: io.BytesIO):
    _gif = Image.open(resize_gif(gif))
    assert _gif.size == (128, 128)


# def test_resize_image():
#     test_iamge = "tests/checkPhotos/test1.png"
#     output_image = "tests/HostPhotos/test_image_resized.jpg"
#     image_process = ImageProcess(test_iamge)
#     image = image_process.resize_image()
#     image_process.save_image(image, output_image)
#     assert os.path.exists(output_image)
#     # confirm the image is 128x128
#     image = Image.open(output_image)
#     assert image.size == (128, 128)
#     # cleanup
#     os.remove(output_image)
#
#     test_image = "tests/checkPhotos/test5.jpeg"
#     output_image = "tests/HostPhotos/test_image_resized.jpg"
#     image_process = ImageProcess(test_image)
#     image = image_process.resize_image()
#     image_process.save_image(image, output_image)
#     assert os.path.exists(output_image)
#     # confirm the image is 128x128
#     image = Image.open(output_image)
#     assert image.size == (128, 128)
#
#
# def test_file_type():
#     test_image = "tests/checkPhotos/test1.png"
#     output_image = "tests/HostPhotos/test_image_resized.png"
#     image_process = ImageProcess(test_image)
#     image = image_process.resize_image()
#     image_process.save_image(image, output_image)
#     true_output_image = "tests/HostPhotos/test_image_resized.png"
#     assert os.path.exists(true_output_image)
#
#     test_image = "tests/checkPhotos/test5.jpeg"
#     output_image = "tests/HostPhotos/test_image_resized.jpeg"
#     image_process = ImageProcess(test_image)
#     image = image_process.resize_image()
#     image_process.save_image(image, output_image)
#     true_output_image = "tests/HostPhotos/test_image_resized.jpeg"
#     assert os.path.exists(true_output_image)
#
#
# def test_resize_gif():
#     test_gif = "tests/checkPhotos/test15.gif"
#     output_gif = "tests/HostPhotos/gif_resized.gif"
#     gif_process = GifProcess(test_gif)
#     frames = gif_process.process_gif()
#     resized_frames = gif_process.resize_frames(frames, width=128, height=128)
#     gif_process.save_frames(resized_frames, "tests/HostPhotos/gif_frames_resized")
#     gif_process.combine_frames(resized_frames, output_gif)
#     assert os.path.exists(output_gif)
#     # cleanup
#
#     # make sure the gif is 256x256
#     gif = Image.open(output_gif)
#     assert gif.size == (128, 128)
