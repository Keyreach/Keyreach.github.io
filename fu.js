/*
 * Bright Future - makeshift library for deferred-like object and related utils
 * 
 */

function brightFuture(){
	this.status = 'pending';
	this.result = null;
	this.cb = null;
	this.ecb = null;
	this.resolve = function(result){
		/* console.log('+ resolved ' + result); */
		if(this.status != 'pending') return false;
		this.status = 'resolved';
		this.result = result;
		if(this.cb != null){
			this.cb(result);
		} /* else {
			console.log('E no resolve handler', this.ecb);
		} */
	};
	this.reject = function(error){
		/* console.log('+ rejected ' + error); */
		if(this.status != 'pending') return false;
		this.status = 'rejected';
		this.result = error;
		if(this.ecb != null){
			this.ecb(error);
		} /* else {
			console.log('E no reject handler', this.cb);
		} */
	};
	this.catch = function(Callback){
		/* console.log('+ reject handler'); */
		switch(this.status){
			case 'rejected':
				/* console.log('+ postponed reject handler invokation'); */
				Callback(this.result);
				break;
			case 'pending':
				/* console.log('+ setup future reject handler'); */
				this.ecb = function(UpCallback, self){
					return function(x){
						/* console.log('* reject handler fired'); */
						if(self.status == 'rejected'){
							UpCallback(x);
						}
					}
				}(Callback, this)
		}
	}
	this.then = function(Callback){
		/* console.log('+ resolve handler'); */
		/* wrapping callback into future */
		var ChainedFuture = new brightFuture();
		switch(this.status){
			case 'resolved':
				/* console.log('+ postponed resolve handler invokation'); */
				var response = Callback(this.result);
				if(response === undefined) response = null;
				if(response instanceof brightFuture){
					return response;
				} else {
					ChainedFuture.resolve(response);
				}
				break;
			case 'rejected':
				/* console.log('+ postponed reject handler invokation'); */
				ChainedFuture.reject(this.result);
				break;
			case 'pending':
				/* console.log('+ setup future handlers'); */
				this.ecb = function(UpFuture, self){
					return function(e){
						/* console.log('* reject passthru'); */
						UpFuture.reject(e);
					}
				}(ChainedFuture, this);
				this.cb = function(UpFuture, UpCallback, self){
					return function(x){
						/* console.log('* resolve handler fired'); */
						if(self.status == 'resolved'){
							var response = UpCallback(x);
							if(response === undefined) response = null;
							if(response instanceof brightFuture){
								/* console.log('+ got another brightFuture'); */
								response.then(function(UpUpFuture){
									return function(resp){
										UpUpFuture.resolve(resp);
										return true;
									}
								}(UpFuture)).catch(function(UpUpFuture){
									return function(resp){
										UpUpFuture.reject(resp);
										return true;
									}
								}(UpFuture));
							} else {
								UpFuture.resolve(response);
							}
						} else {
							/* console.log('* reject handler fired 2'); */
							UpFuture.reject(x);
						}
					}
				}(ChainedFuture, Callback, this)
				break;
		}
		return ChainedFuture;
	};
}

function futureTimer(time){
	var fu = new brightFuture();
	setTimeout(function(f){
		return function(){
			f.resolve(true);
		}
	}(fu), time * 1000);
	return fu;
}

function futureLoad(json){
	var fu = new brightFuture();
	try {
		var d = JSON.parse(json);
		fu.resolve(d);
	} catch(e) {
		fu.reject(null)
	}
	return fu;
}

function futureGetRequest(url){
	var isIE = navigator.appName.indexOf('Explorer') != -1;
	var future = new brightFuture();
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url + (isIE ? '?' + Math.round(Math.random()*1e5).toString(16) : ''), true);
	xhr.onreadystatechange = function(fu){
		return function(){
			if(this.readyState == XMLHttpRequest.DONE){
				fu.resolve(this);
			}
		}
	}(future);
	xhr.onerror = function(fu){
		return function(err){
			fu.reject(err);
		}
	}(future);
	xhr.send(null);
	return future;
}

function futurePostRequest(url, data, json){
	var isIE = navigator.appName.indexOf('Explorer') != -1;
	var future = new brightFuture();
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url + (isIE ? '?' + Math.round(Math.random()*1e5).toString(16) : ''), true);
	xhr.onreadystatechange = function(fu){
		return function(){
			if(this.readyState == XMLHttpRequest.DONE){
				fu.resolve(this);
			}
		}
	}(future);
	xhr.onerror = function(fu){
		return function(err){
			fu.reject(err);
		}
	}(future);
	if((typeof json != 'undefined') && (json == true)){
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify(data));
	} else {
		xhr.send(data);
	}
	return future;
}
