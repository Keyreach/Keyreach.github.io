function doProcessing(image, width, height, K){
    var newBitmap = new ImageData(
        new Uint8ClampedArray(image.data),
        width,
        height
    );
    var flag = true;
    var noise = 3;
    for(var i = 0; i < newBitmap.data.length; i += 4) {
        if(i % (newBitmap.width * 4) == 0){ noise = flag ? 3 : -3; flag = !flag; }
        //var noise = Math.random() * 10 - 5;
        newBitmap.data[i] = Math.round((newBitmap.data[i] + noise) / K) * K;
        newBitmap.data[i + 1] = Math.round((newBitmap.data[i + 1] + noise) / K) * K;
        newBitmap.data[i + 2] = Math.round((newBitmap.data[i + 2] + noise) / K) * K;
        /* newBitmap.data[i + 3] = Math.round((newBitmap.data[i + 3] + noise) / K) * K; */
        noise = -noise;
    }
    return newBitmap;
}

onmessage = function(e){
    var processedImage = doProcessing(e.data.image, e.data.width, e.data.height, parseInt(e.data.span));
    postMessage({ event: 'done', result: processedImage});
}

postMessage({
    event: 'init',
    name: 'Chromaredu',
    params: {
        span: { type: 'enum', options: { 3: '614125 colors', 5: '132651 colors', 15: '4913 colors', 17: '3375 colors', 51: '125 colors', 85: '27 colors' } }
    }
});