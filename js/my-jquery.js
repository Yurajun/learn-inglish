function Elems(elems){
	const elements = elems || [];

	function nospace(str){
		const VRegExp = new RegExp(/^(\s|\u00A0)+/g);
		const VResult = str.replace(VRegExp, '');
		return VResult;
	}

	this.text = function (text){
		const txt = text || 'undefined';
		if (txt === 'undefined'){
			return nospace(elements[0].value);
		}
		let i = 0;
		for (i; i < elements.length; i++){
			elements[i].value = txt;
		}
		return this;
	};

	this.html = function (code){
		if (code === ' '){
			let i = 0;
			for (i; i < elements.length; i++){
				elements[i].innerHTML = code;
			}
			return this;
		}
		const cods = code || 'undefined';
		if (cods === 'undefined'){
			return nospace(elements[0].innerHTML);
		}
		let i = 0;
		for (i; i < elements.length; i++){
			elements[i].innerHTML += cods;
		}
		return this;
	};

	function fadePrivete(flag, elem, time, callback){
		let op = 1;
		const fr = 20;
		let steps = time / fr;
		const dOp = op / steps;
		if (!flag) {
			op = 0;
			elem.style.opacity = op;
			elem.style.display = 'block';
		}
		const interval = setInterval(function (){
			steps -= 1;
			op = flag ? op - dOp : op + dOp;
			elem.style.opacity = op;
			if (steps <= 0){
				clearInterval(interval); callback();
			}
		}, fr);
	}

	function fade(flag, t, c){
		const time = t || 300;
		const callback = c || function (){};
		let i = 0;
		for (i; i < elements.length; i++){
			if (flag){
				fadePrivete(true, elements[i], time, callback);
			}else {
				fadePrivete(false, elements[i], time, callback);
			}
		}
	}

	this.fadeOut = function (t, c){
		fade(true, t, c);
		return this;
	};

	this.fadeIn = function (t, c){
		fade(false, t, c);
		return this;
	};

	this.hide = function (){
		let i = 0;
		for (i; i < elements.length; i++){
			elements[i].style.display = 'none';
		}
		return this;
	};

	this.setCss = function (prop, val){
		const property = prop || 'undefined';
		const value = val || 'undefined';
		if (property === 'undefined' && value === 'undefined'){
			return this;
		}else if (value === 'undefined'){
			return elements[0].style[property];
		}
		let i = 0;
		for (i; i < elements.length; i++){
			elements[i].style[property] = value;
		}
		return this;
	};

	function action(event, f){
		if (f === 'undefined'){
			let i = 0;
			for (i; i < elements.length; i++){
				switch (event){
					case 'click': elements[i].onclick(); break;
					case 'enter': elements[i].onkeydown(); break;
				}
			}
		}else {
			let i = 0;
			for (i; i < elements.length; i++){
				switch (event){
					case 'click': elements[i].onclick = f; break;
					case 'enter': elements[i].onkeydown = f; break;
				}
			}
		}
	}

	this.click = function (f){
		action('click', f);
		return this;
	};

	this.keyDown = function (f){
		action('enter', f);
		return this;
	};

	this.toggleAction = function (elem, f){
		if (f === 'undefined'){
			elem.onclick = '';
			return this;
		}
		elem.onclick = f;
		return this;
	};
}

function jq(selector){
	let elems;
	if (typeof selector === 'string') {
		elems = document.querySelectorAll(selector);
	}else {
		elems = [selector];
	}
	return new Elems(elems);
}
