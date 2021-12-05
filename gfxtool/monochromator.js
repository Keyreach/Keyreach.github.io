function doProcessing(image, width, height, color1, color2, channel){
    var newBitmap = new ImageData(
        new Uint8ClampedArray(image.data),
        width,
        height
    );
    for(var i = 0; i < newBitmap.data.length; i += 4) {
	if(channel == 3){
		var ratio = (newBitmap.data[i] + newBitmap.data[i + 1] + newBitmap.data[i + 2]) / 765;
	} else {
		var ratio = newBitmap.data[i + channel] / 255;
	}
        newBitmap.data[i] = Math.ceil(color1[0] * ratio + color2[0] * (1 - ratio));
        newBitmap.data[i + 1] = Math.ceil(color1[1] * ratio + color2[1] * (1 - ratio));
        newBitmap.data[i + 2] = Math.ceil(color1[2] * ratio + color2[2] * (1 - ratio));
        // leave alpha as-is
        // newBitmap.data[i + 3] = Math.round((newBitmap.data[i + 3] + noise) / K) * K;
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
    var color1 = parseColor(e.data.firstColor);
    var color2 = parseColor(e.data.secondColor);
    var processedImage = doProcessing(e.data.image, e.data.width, e.data.height, color1, color2, parseInt(e.data.channel));
    postMessage({ event: 'done', result: processedImage});
}

postMessage({
    event: 'init',
    name: 'Monocolorizer',
    params: {
        firstColor: { type: 'string', default: '#FFF' },
        secondColor: { type: 'string', default: '#000' },
        channel: { type: 'enum', options: { 0: 'Red', 1: 'Green', 2: 'Blue', 3: 'Average' } }
    }
});
