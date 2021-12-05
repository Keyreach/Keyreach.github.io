function mod(a, b){
	var x = a % b;
	return (x < 0) ? (b + x) : x;
}

function doProcessing(image, width, height, wet, colorShift){
    var newBitmap = new ImageData(
        new Uint8ClampedArray(image.data),
        width,
        height
    );
	var dry = 1 - wet;
	var maxOffset = Math.ceil(0.1 * width)
	for(var k = 0; k < 10; k++){
		var fragmentStart = Math.floor(Math.random() * height);
		var fragmentEnd = fragmentStart + Math.floor(Math.random() * (height - fragmentStart));
		var offset = 4 * (Math.floor(Math.random() * 2 * maxOffset) - maxOffset); // 4 * Math.floor(Math.random() * maxOffset);
		var noise = colorShift ? Math.floor(Math.random() * 7) : 0;
		//console.log(fragmentStart, fragmentEnd);
		for(var y = fragmentStart; y < fragmentEnd; y++){
			var base = y * 4 * width;
			if(offset > 0){
				for(var i = 0; i < width * 4; i++){
					if((i % 4) == 3) continue;
					//var noise = 0; // Math.floor(Math.random() * 8) - 4;
					newBitmap.data[base + i] = newBitmap.data[base + mod(i, width * 4)] * dry + newBitmap.data[base + mod(i + offset, width * 4) + noise] * wet;
				}
			} else {
				for(var i = width * 4 - 1; i >= 0; i--){
					if((i % 4) == 3) continue;
					//var noise = 0; // Math.floor(Math.random() * 8) - 4;
					newBitmap.data[base + i] = newBitmap.data[base + mod(i, width * 4)] * dry + newBitmap.data[base + mod(i + offset, width * 4) + noise] * wet;
				}
			}
		}
	}
    return newBitmap;
}

onmessage = function(e){
    var processedImage = doProcessing(e.data.image, e.data.width, e.data.height, e.data.mix / 10, e.data.colorShift);
    postMessage({ event: 'done', result: processedImage});
}

postMessage({
    event: 'init',
    name: 'Scanlinecrusher',
    params: {
		mix: { type: 'range', min: 0, max: 10 },
		colorShift: { type: 'flag' }
    }
});