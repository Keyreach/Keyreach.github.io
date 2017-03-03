function mkListView(obj){
	if(!obj){
		var ret = document.createElement('div');
	} else {
		var ret = obj;
		ret.innerHTML = '';
	}
	ret.className = 'listview';
	ret.selectedIndex = -1;
	ret.total = 0;
	ret.options = [];
	ret.addOption = function(o){
		return function(caption, value, css){
			var opt = document.createElement('div');
			opt.innerHTML = caption;
			opt.setAttribute('data-value', value);
			opt.itemIndex = this.total;
			opt.className = 'listview-item';
			if(css){
				opt.classList.add(css);
			}
			opt.doBlur = function(){
				this.classList.remove('listview-hilite');
			};
			opt.doFocus = function(){
				this.classList.add('listview-hilite');
			}
			opt.onclick = function(){
				if(o.selectedIndex != -1)
					o.options[o.selectedIndex].doBlur();
				o.selectedIndex = this.itemIndex;
				this.doFocus();
			}
			o.appendChild(opt);
			o.options[o.total] = opt;
			o.total++;
		}
	}(ret);
	ret.removeOption = function(i){
		if(i < this.total && i >= 0){
			this.removeChild(this.options[i]);
			this.options.splice(i,1);
			this.selectedIndex = -1;
			this.total--;
		}
		for(var i in this.options){
			this.options[i].itemIndex = i;
		}
	};
	ret.getValue = function(){
		if(this.selectedIndex != -1)
			return this.options[this.selectedIndex].getAttribute('data-value');
		else
			return null;
	};
	ret.loadFromArray = function(a){
		this.innerHTML = '';
		this.options = [];
		this.selectedIndex = -1;
		this.total = 0;
		var size = a.length;
		for(var i = 0; i < size; i++){
			if(a[i] instanceof Array){
				if(a[i].length == 3){
					this.addOption(a[i][0], a[i][1], a[i][2]);
				} else {
					this.addOption(a[i][0], a[i][1]);
				}
			} else {
				this.addOption(a[i], a[i]);
			}
		}
	};
	ret.saveToArray = function(){
		var retval = [];
		for(var i = 0; i < this.total; i++){
			retval.push(this.options[i].getAttribute('data-value'));
		}
		return retval;
	};
	return ret;
}
