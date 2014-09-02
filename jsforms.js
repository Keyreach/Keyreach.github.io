/*
 * JS-Forms
 */
function mkForm(){
	kfm = document.createElement('div');
	kfm.style.border = '2px solid #444';
	kfm.style.position = 'absolute';
	kfm.style.background = '#FFF';
	kfm.style.width = '320px';
	kfm.style.height = '240px';
	kfm.style.top = (window.innerHeight-240)/2+'px';
	kfm.style.left = (window.innerWidth-320)/2+'px';
	kfm.style.font = '400 12pt Clear Sans';
	kfm.style.padding = '8px';
	kfm.style.textAlign = 'center';
	kfm.innerHTML = '<u onclick="rmUnit(this.parentNode)" style="float:right;font-size:x-small;cursor:pointer">close</u>';
	document.body.appendChild(kfm);
	return kfm;
}
function mkText(text, fm){
	ktx = document.createElement('div');
	ktx.innerHTML = text;
	ktx.style.margin = '3px';
	fm.appendChild(ktx);
	return ktx;
}
function mkButton(text, fun, fm){
	kbt = document.createElement('input');
	kbt.type = 'button';
	kbt.onclick = function(){ eval(fun) };
	kbt.style.margin = '3px';
	kbt.value = text;
	fm.appendChild(kbt);
	return kbt;
}
function mkEdit(text, fun, fm){
	ked = document.createElement('input');
	ked.type = 'text';
	ked.onkeyup = function(event){ if(event.keyCode==13){ eval(fun) } };
	ked.style.margin = '3px';
	ked.value = text;
	fm.appendChild(ked);
	return ked;
}
function clForm(fm){
	fm.innerHTML = '';
}
function rmUnit(unit){
	unit.parentNode.removeChild(unit);
}
