function doProcessing(image, width, height, color, threshold, smooth){
    var newBitmap = new ImageData(
        new Uint8ClampedArray(image.data),
        width,
        height
    );
    for(var i = 0; i < newBitmap.data.length; i += 4) {
        if(
            (Math.abs(newBitmap.data[i] - color[0]) < threshold) &&
            (Math.abs(newBitmap.data[i + 1] - color[1]) < threshold) &&
            (Math.abs(newBitmap.data[i + 2] - color[2]) < threshold)
        ) {
			/* var opacity = (Math.abs(newBitmap.data[i] - color[0]) + 
			Math.abs(newBitmap.data[i + 1] - color[1]) +
			Math.abs(newBitmap.data[i + 2] - color[2])) / (3 * threshold); */
			var opacity = 0;
			if(smooth){
				var opacity = Math.max(
					Math.abs(newBitmap.data[i] - color[0]),
					Math.abs(newBitmap.data[i + 1] - color[1]),
					Math.abs(newBitmap.data[i + 2] - color[2])
				) / threshold;
			}
            newBitmap.data[i + 3] = Math.ceil(opacity * 255);
        }
    }
    return newBitmap;
}

function parseColor(color){
    if(color[0] != '#') throw Error('Invalid color format');
    if(color.length == 4){
        return [
            parseInt(color[1] + color[1], 16),
            parseInt(color[2] + color[2], 16),
            parseInt(color[3] + color[3], 16)
        ]
    } else if(color.length == 7){
        return [
            parseInt(color.substring(1, 3), 16),
            parseInt(color.substring(3, 5), 16),
            parseInt(color.substring(5, 7), 16)
        ]
    }
    throw Error('Unknown color format');
}

onmessage = function(e){
    var color = parseColor(e.data.color);
    var processedImage = doProcessing(e.data.image, e.data.width, e.data.height, color, e.data.threshold, e.data.smooth);
    postMessage({ event: 'done', result: processedImage});
}

postMessage({
    event: 'init',
    name: 'Deopaq',
    params: {
        color: { type: 'string', default: '#FFF' },
        threshold: { type: 'range', min: 1, max: 255 },
		smooth: { type: 'flag' }
    }
});