function doProcessing(image, width, height, type, color){
    var newBitmap = new ImageData(
        new Uint8ClampedArray(image.data),
        width,
        height
    );
    for(var i = 0; i < newBitmap.data.length; i += 4) {
		for(var k = 0; k < 3; k++){
			switch(type){
				case 'and':
					newBitmap.data[i + k] &= color[k];
					break;
				case 'or':
					newBitmap.data[i + k] |= color[k];
					break;
				case 'xor':
					newBitmap.data[i + k] ^= color[k];
					break;
				case 'mul':
					newBitmap.data[i + k] = Math.floor(newBitmap.data[i + k] * (color[k] / 255));
					break;
				case 'add':
					newBitmap.data[i + k] = Math.min(255, newBitmap.data[i + k] + color[k]);
					break;
				case 'min':
					newBitmap.data[i + k] = Math.min(color[k], newBitmap.data[i + k]);
					break;
				case 'max':
					newBitmap.data[i + k] = Math.max(color[k], newBitmap.data[i + k]);
					break;
			}
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
	var color = parseColor(e.data.color)
    var processedImage = doProcessing(e.data.image, e.data.width, e.data.height, e.data.type, color);
    postMessage({ event: 'done', result: processedImage});
}

postMessage({
    event: 'init',
    name: 'Coloroverlay',
    params: {
        type: { type: 'enum', options: { 'and': 'AND', 'or': 'OR', 'xor': 'XOR', 'min': 'MIN', 'max': 'MAX', 'add': 'Addition', 'mul': 'Multiplication' } },
		color: { type: 'string', default: '#888' }
    }
});