function neListVw(opts){
	this.container = opts.elem || document.createElement('div');
	this.multi = opts.multi || false;
	this.schema = {
		key: opts.key || 'id',
		columns: opts.display
	};
	if(!('style' in opts)) opts.style = {};
	this.style = {
		'normal': opts.style.normal || 'listview-item',
		'selected': opts.style.selected || 'listview-hilite'
	}
	this.length = 0;
	this._list = [];
	this.dom = [];
	this.selected = -1;
	this.selectedItems = [];
	this.setFocus = function(elem){
		if(typeof elem.classList != 'undefined')
			elem.classList.add(this.style.selected)
		else
			elem.className += ' ' + this.style.selected;
	}
	this.unsetFocus = function(elem){
		if(typeof elem.classList != 'undefined')
			elem.classList.remove(this.style.selected)
		else
			elem.className = elem.className.replace(this.style.selected, '').replace(/\s+/g, ' ');
	}
	this.set = function(index){
		if(this.multi == false){
			if(this.selected != -1)
				this.unsetFocus(this.dom[this.selected]);
			if((index != null) && (index > -1) && (index < this.length)){
				this.selected = index;
				this.setFocus(this.dom[index]);
			} else {
				this.selected = -1;
			}
		} else {
			if((index != null) && (index > -1) && (index < this.length)){
				if(this.selectedItems.indexOf(index) != -1){
					console.log('unset');
					this.unsetFocus(this.dom[index]);
					this.selectedItems.splice(this.selectedItems.indexOf(index), 1);
				} else {
					console.log('set');
					this.setFocus(this.dom[index]);
					this.selectedItems.push(index);
				}
			} else {
				console.log('something went wrong');
			}
		}
	}
	this.render = function(){
		this.container.innerHTML = '';
		if(this.list.length == 0){
			var dummyItem = document.createElement('div');
			dummyItem.className = this.style.normal;
			dummyItem.innerHTML = 'Нет элементов';
			dummyItem.style.opacity = '.3';
			this.container.appendChild(dummyItem);
		}
		for(var i = 0; i < this.length; i++){
			this.dom[i] = document.createElement('div');
			this.dom[i].className = this.style.normal;
			this.dom[i].setAttribute('data-index', i);
			// var contents = '';
			
            if(typeof this.schema.columns == 'function'){
                this.schema.columns(this.dom[i], this.list[i], i);
            } else {
                if(typeof this.list[i] != 'object'){
                    contents = this.schema.columns.default(this.list[i]);
                } else {
                    for(var k in this.schema.columns){
                        var col = document.createElement('span');
                        if(typeof this.schema.columns[k] == 'function'){
                            col.innerHTML = this.schema.columns[k](this.list[i][k]);
                        } else {
                            col.innerHTML = this.schema.columns[k].filter(this.list[i][k]);
                            for(var prop in this.schema.columns[k].style){
                                col.style[prop] = this.schema.columns[k].style[prop];
                            }
                        }
                        this.dom[i].appendChild(col);
                    }
                }
            }
			// this.dom[i].innerHTML = contents;
			this.dom[i].onclick = function(self, index){
				return function(){
					self.set(index);
				}
			}(this, i);
			this.customize(this.dom[i], this.list[i], i);
			this.container.appendChild(this.dom[i]);
		}
	};
	this.update = function(self){ return function(list){
		self.list = list;
	} }(this);
	this.customize = function(elem, val, index){

	};
    this.add = function(item){
        this._list.push(item);
        this.length++;
        this.render();
    }
    this.cut = function(index){
        var result = this._list.splice(i, 1)[0];
        this.length--;
        this.render();
        return result;
    }
	Object.defineProperty(this, 'value', {
		configurable: true,
		get: function(self){ return function(){
			if(self.selected == -1) return null;
			return self.list[self.selected];
		}}(this),
		set: function(self){ return function(x){
			for(var i in self.list){
				if(self.list[i][self.schema.key] == x){
					self.set(i);
					return;
				}
			}
			self.set(null);
		}}(this)
	});
	Object.defineProperty(this, 'list', {
		configurable: true,
		get: function(self){ return function(){
			return self._list;
		}}(this),
		set: function(self){ return function(x){
			if(typeof x != 'object') return false;
			self.length = x.length;
			self._list = x.slice();
			self.render();
		}}(this)
	});
}
