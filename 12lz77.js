function unpackTriplet(str, index){
    var a = str.charCodeAt(index);
    var b = str.charCodeAt(index + 1);
    var c = str.charCodeAt(index + 2);
    return [
        (a << 4) + (b >> 4),
        ((b & 0xF) << 8) + c,
        str[index + 3]
    ];
}
function packTriplet(offset, length, char){
    if((offset >= 4096) || (length >= 4096)){
        console.log('overflow');
    }
    return String.fromCharCode(offset >> 4) + String.fromCharCode(((offset & 0xF) << 4) + (length >> 8)) + String.fromCharCode(length & 0xFF) + char;
}
function lz77_compress(data, windowsize){
    var out = '';
    var preamble = 256;
    var pointer = preamble;
    var text = '';
    for(var i = 0; i < preamble; i++){
        text += String.fromCharCode(i);
    }
    text += data;
    while(pointer < text.length){
      offset = 0;
      length = 0;
      windowStart = Math.max(0, pointer - windowsize);
      for(var i = 1; i < Math.min(windowsize, text.length - pointer); i++){
        tmp = text.indexOf(text.substr(pointer, i), windowStart);
        if((tmp == -1) || (tmp >= pointer - i)) break;
        offset = tmp - windowStart;
        length = i;
      }
      out += packTriplet(offset, length, text[pointer + length]);
      pointer += length + 1;
    }
    return out;
}

function lz77_decompress(data, windowsize){
    var text = '';
    var preamble = 256;
    for(var i = 0; i < preamble; i++){
        text += String.fromCharCode(i);
    }
    var pointer = preamble;
    for(var i = 0; i < data.length; i+=4){
        triplet = unpackTriplet(data, i);
        offset = triplet[0];
        length = triplet[1];
        char = triplet[2];
        windowStart = Math.max(0, pointer - windowsize);
        text += text.substr(windowStart + offset, length) + char;
        pointer += length + 1;
    }
    return text.substr(preamble);
}