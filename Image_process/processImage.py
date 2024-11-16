import os

from PIL import Image


class ImageProcess:
    def __init__(self, image_path):
        self.image_path = image_path

    def resize_image(self, width=128, height=128):
        """
        Resize the image to the specified width and height.
        :param width: Target width of the image.
        :param height: Target height of the image.
        :return: Resized Image object.
        """
        if width <= 0 or height <= 0:
            raise ValueError("Width and height must be positive integers.")
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
        
        # Ensure the save directory exists
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        # Save the image
        image.save(save_path)

class GifProcess:
    def __init__(self, gif_path):
        """
        Initialize the GifProcess class with the path to the GIF.
        :param gif_path: Path to the GIF file.
        """
        self.gif_path = gif_path

    def process_gif(self):
        """
        Process the GIF to extract all frames as RGBA images.
        :return: List of Image objects representing each frame.
        """
        gif = Image.open(self.gif_path)
        frames = []  # List to store all processed frames
        palette = gif.getpalette()  # Get the palette for the GIF if available

        try:
            while True:
                # Create a copy of the current frame
                new_frame = gif.copy()

                # Apply the palette if the frame is in 'P' mode
                if new_frame.mode == 'P' and palette:
                    new_frame.putpalette(palette)

                # Convert the frame to RGBA for consistent processing
                processed_frame = new_frame.convert('RGBA')
                frames.append(processed_frame)

                # Move to the next frame
                gif.seek(gif.tell() + 1)
        except EOFError:
            # End of the GIF, all frames processed
            pass

        return frames

    def resize_frames(self, frames, width=128, height=128):
        """
        Resize the list of frames to the specified width and height.
        :param frames: List of Image objects representing each frame.
        :param width: Target width of the frames.
        :param height: Target height of the frames.
        :return: List of resized Image objects.
        """
        resized_frames = []

        for frame in frames:
            # High-quality resizing
            resized_frame = frame.resize((width, height), Image.Resampling.LANCZOS) 
            resized_frames.append(resized_frame)

        return resized_frames

    def save_frames(self, frames, save_path):
        """
        Save the list of frames as PNG images.
        :param frames: List of Image objects representing each frame.
        :param save_path: Path to save the frames.
        """
        # Ensure the save directory exists
        os.makedirs(save_path, exist_ok=True)

        for i, frame in enumerate(frames):
            frame.save(f"{save_path}/frame_{i}.png")

    def combine_frames(self, frames, save_path):
        """
        Combine the list of frames into a single GIF.
        :param frames: List of Image objects representing each frame.
        :param save_path: Path to save the combined GIF.
        """
        frames[0].save(save_path, save_all=True, append_images=frames[1:], loop=0)

if __name__ == "__main__":
    # Define input and output paths
    gif_path = "../tests/checkPhotos/test15.gif"
    output_frames_dir = "../tests/HostPhotos/gif_frames_resized"
    output_gif = "../tests/HostPhotos/combined_resized.gif"

    # Initialize GifProcess
    gif_process = GifProcess(gif_path)

    # Process the GIF to extract frames
    frames = gif_process.process_gif()

    # Resize the frames
    # Adjust width and height as needed
    resized_frames = gif_process.resize_frames(frames, width=256, height=256) 

    # Save resized frames as PNG images
    gif_process.save_frames(resized_frames, output_frames_dir)

    # Combine resized frames into a new GIF
    gif_process.combine_frames(resized_frames, output_gif)

    print(f"Resized frames saved in: {output_frames_dir}")
    print(f"Resized GIF saved as: {output_gif}")
