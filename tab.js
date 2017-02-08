function Tab(){
	//some code
	this.init.apply(this, arguments) //初始对象属性
}

Tab.prototype = {
	init:function(ela, elb, paramObj){
		//默认参数设置
		this.defaultOptions = {
			curClass : "current",
			type : "mouseover",
			delay : 150
		}
		this.options = this.extend(this.defaultOptions,paramObj || {});
		this.oa = document.getElementById(ela);
		this.ob = document.getElementById(elb);
		this.triggerItem = this.oa.children;
		this.listItem = this.ob.children;
		this.tLen = this.triggerItem.length;
		this.arr = [];
		this.timer = null;
		this.isIE = ![-1,]; // 判断ie浏览器

		var self = this;
		this.options.delay = this.options.type === 'click' ? 0 : this.options.delay;

		for(var i=0;i<this.tLen;i++){
			this.triggerItem[i]['on' + this.options.type] = this.change(i); //绑定事件
			this.triggerItem[i].onmouseout = function(){
				clearTimeout(self.timer);
				self.timer = null
			}
		}
	},
	extend:function(source,target){
		for(var p in target){
			//在in遍历的时候，用hasOwnProperty来过滤
			if(target.hasOwnProperty(p)){
				source[p] = target[p];
			}
		}
		return source
	},
	trim:function(str){
		return str.replace(/^\s+/g,"").replace(/\s+$/g,"");
	},
	addClass:function(el,name){
		//要先做个是否存在的判定
		var arr = [],
			str = el.className,
			arr = str.split(/\s+/),
			len = arr.length,
			name = this.trim(name);
		for(var i = 0;i<len;i++){
			if(arr[i] === name){
				return;
			}
		}
		el.className += ' ' + name;
		el = null;
	},
	removeClass:function(el,name){
		var arr = [],
			str = el.className,
			arr = str.split(/\s+/),
			len = arr.length,
			name = this.trim(name);

		for(var i=0;i<len;i++){
			if(arr[i] === name){
				arr.splice(i,1);
				el.className = arr.join(' ');
				return;
			}
		}
	},
	//变换函数
	change:function(d){
		var self = this;
		return function(){
			self.timer = setTimeout(function(){
				for(var i=0;i<self.tLen;i++){
					if(i === d){
						self.addClass(self.triggerItem[d],self.options.curClass);
						self.listItem[i].style.display = 'block';
					}else{
						self.removeClass(self.triggerItem[i],self.options.curClass);
						self.listItem[i].style.display = 'none';
					}
				}
			},self.options.delay)
		}
	}
}