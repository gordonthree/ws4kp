document.addEventListener('DOMContentLoaded', () => {
	stretchImages();
});

const fetchAsBlob = async (url) => {
	const response = await fetch(url);
	return response.blob();
};

const stretchImages = async () => {
	const blob = await fetchAsBlob('/images/maps/radar.webp');
	const imageBitmap = await createImageBitmap(blob);

	// extract the black pixels to overlay on to the final image (boundaries)
	const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
	const context = canvas.getContext('2d');
	context.drawImage(imageBitmap, 0, 0);
	const imageData = context.getImageData(0, 0, imageBitmap.width, imageBitmap.height);

	// go through the image data and preserve the black pixels, making the rest transparent
	for (let i = 0; i < imageData.data.length; i += 4) {
		if (imageData.data[i + 0] >= 116 || imageData.data[i + 1] >= 116 || imageData.data[i + 2] >= 116) {
			// make it transparent
			imageData.data[i + 3] = 0;
		}
	}
	// write the image data back
	context.putImageData(imageData, 0, 0);

	const stretchedCanvas = document.getElementById('stretched');
	const stretchedContext = stretchedCanvas.getContext('bitmaprenderer');
	stretchedCanvas.width = imageBitmap.width * 640 / 480;
	stretchedCanvas.height = imageBitmap.height * 367 / 276;
	stretchedContext.transferFromImageBitmap(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height, 0, 0, stretchedCanvas.width, stretchedCanvas.height);

	const overlayCanvas = document.getElementById('overlay');
	const overlayContext = overlayCanvas.getContext('2d');
	overlayCanvas.width = canvas.width * 640 / 480;
	overlayCanvas.height = canvas.height * 367 / 276;
	overlayContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, overlayCanvas.width, overlayCanvas.height);
};
