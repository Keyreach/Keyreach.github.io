function FastExpo(exponent){
    this.exponent = exponent;
    this.factors = null;
    this.binaryFactors = function(x){
        var result = [];
        var s = Math.ceil(Math.log2(x));
        while(s >= 0){
            var t = (1 << s);
            if(t <= x){ x-= t; result.push(s); }
            s--;
        }
        this.factors = result;
    };
    this.binmodexp = function(x, n, module){
        var result = x;
        for(var i = 0; i < n; i++){
            result = (result * result) % module;
        }
        return result;
    };
    this.calculate = function(a, module){
        return this.factors.reduce((total, factor) => {
            return (total * this.binmodexp(a, factor, module)) % module;
        }, 1);
    };
    this.binaryFactors(exponent);
}

var nanoRSA = {
    primes: [2, 3, 5],
    initPrimes: function(){
        for(var i = 7; i < 1024; i+=2){
            var isPrime = true;
            for(var j = 0; j < this.primes.length; j++){
                if(i % this.primes[j] == 0){
                    isPrime = false; break;
                }
            }
            if(isPrime) this.primes.push(i);
        }
    },
    generateKeys: function(){
        var p = 1, q = 1, n = 1;
        do {
            p = this.primes[Math.floor(Math.random() * this.primes.length)];
            q = this.primes[Math.floor(Math.random() * this.primes.length)];
            n = p * q;
        } while((p == q) || (n < 0x10000)); // 0x10000 for utf-16
        var fn = (p - 1) * (q - 1);

        var e = 0, d = 1, k = 1;
        do {
            e = 1 + Math.floor(Math.random() * (n - 1));
			if(e % fn == 0) continue;
            d = 1;
            k = 1;
            while(k < 1000){
                d = (k * fn + 1) / e; k++;
                if(d % 1 == 0) break;
            }
        } while(d % 1 != 0);
        return { public: [e, n], private: [d, n] }
    },
    crypt: function(x, key){
        var fe = new FastExpo(key[0]);
        return fe.calculate(x, key[1]);
    },
    hexPad: function(digits, x){
        var hx = x.toString(16);
        for(var i = hx.length; i < digits; i++){
            hx = '0' + hx;
        }
        return hx;
    },
    encodeString: function(key, str){
        //var klen = Math.ceil(Math.log(private[1])/Math.log(16));
        var fe = new FastExpo(key[0]);
		var dt = Math.ceil(Math.log(key[1])/Math.log(16));
        return [].map.call(str, (x, i) => {
            return this.hexPad(dt, fe.calculate(x.charCodeAt(0) + i, key[1]));
        }).join('');
    },
    decodeString: function(key, str){
        var fe = new FastExpo(key[0]);
		var result = '';
		var dt = Math.ceil(Math.log(key[1])/Math.log(16));
		for(var i = 0; i * dt < str.length; i++){
			result += String.fromCharCode(fe.calculate(parseInt(str.substr(i * dt, dt), 16), key[1]) - i);
		}
        return result;
    }
};

function prettyKey(key){
    return key.map(x => x.toString(16)).join('.').toUpperCase();
}

nanoRSA.initPrimes();