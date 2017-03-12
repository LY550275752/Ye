;
(function(window, document) {
    var w = window,
        doc = document;
    var Ye = function(selector) {
        //调用返回一个实例，达到无new调用的效果
        return new Ye.prototype.init(selector);
    }
    Ye.prototype = {
        constructor: Ye,
        version:'1.0.1',
        length: 0,
        splice: [].splice,
        sort:[].sort,
        splice:[].splice,
        selector: '',
        init: function(selector, context) {
            //返回一个空Ye对象
            if (!selector) return this;

            //有nodeType属性，判断为dom对象,封装为Ye对象
            if (selector.nodeType) {
                if (selector.length != undefined) {
                    for (var i = 0; i < selector.length; i++) {
                        this[i] = selector[i];
                    }
                    this.length = selector.length;
                } else {
                    this[0] = selector;
                    this.length = 1;
                }
                return this;
            //调用ready
            } else if (typeof selector == 'function') {
                Ye.ready(selector);
                return;
            }

            var context = context || doc,
                elm;

            //判断为id
            if (selector.charAt(0) == '#' && !selector.match('\\s')) {
                selector = selector.substring(1);
                elm = document.getElementById(selector);

                //记得作数组处理
                this[0] = elm;
                this.length = 1;
                return this;
            //判断为class
            } else {
                elm = context.querySelectorAll(selector);
                for (var i = 0; i < elm.length; i++) {
                    this[i] = elm[i];
                }
                this.selector = selector;
                this.length = elm.length;
                return this;
            }
        },
        on: function(type, selector, fn) {
            if (typeof selector == 'function') {
                fn = selector;
                //无三个参数
                for (var i = 0; i < this.length; i++) {
                    if (!this[i].guid) {
                        this[i].guid = ++Ye.guid;  
                        //给这个guid下创建一个新事件,存储这个DOM上的所有事件
                        Ye.Events[Ye.guid] = {};
                        //把事件存进这个事件类型数组
                        Ye.Events[Ye.guid][type] = [fn];
                        //自定义的事件绑定函数
                        bind(this[i], type, this[i].guid);
                    } else {
                        var id = this[i].guid;
                        if (Ye.Events[id][type]) {
                            //此类型已经存在，加进数组就好
                            Ye.Events[id][type].push(fn);
                        } else {
                            //存新的类型，需要绑定
                            Ye.Events[id][type] = [fn];
                            bind(this[i], type, id);
                        }
                    }
                }
            } else {
                for (var i = 0; i < this.length; i++) {
                    //如果没有deleId
                    if (!this[i].deleId) {
                        this[i].deleId = ++Ye.deleId;
                        Ye.deleEvents[Ye.deleId] = {};
                        Ye.deleEvents[Ye.deleId][selector] = {};
                        Ye.deleEvents[Ye.deleId][selector][type] = [fn];
                        delegate(this[i], type, selector);
                    } else {
                        var id = this[i].deleId;
                        if (Ye.deleEvents[id][selector][type]) {
                            Ye.deleEvents[id][selector][type].push(fn);
                        } else {
                            Ye.deleEvents[id][selector][type] = [fn];
                            delegate(this[i], type, selector);
                        }
                    }
                }
            }
        },
        off: function(type, selector) {
            if (arguments.length == 0) {
                //没传参数，移除所有事件
                for (var i = 0; i < this.length; i++) {
                    var id = this[i].guid;
                    for (var j in Ye.Events[id]) {
                        delete Ye.Events[id][j];
                    }
                }
            } else if (arguments.length == 1) {
                //传了一个指定事件
                for (var i = 0; i < this.length; i++) {
                    var id = this[i].guid;
                    delete Ye.Events[id][type];
                }
            } else {
                for (var i = 0; i < this.length; i++) {
                    var Did = this[i].deleId;
                    delete Ye.deleEvents[Did][selector][type];
                }
            }
        },
    }
    Ye.prototype.init.prototype = Ye.prototype;

    //事件组
    Ye.Events = [];
    Ye.guid = 0;
    //事件委托数组
    Ye.deleEvents = [];
    Ye.deleId = 0;
    
    Ye.prototype.extend = Ye.extend = function() {
        if(arguments.length == 1){
            var options = arguments[0];
            for (var i in options) {
                this[i] = options[i];
            }
        }else{
            var target = arguments[0];
                source = arguments[1];
            for(var i in source){
                target[i] = source[i];
            }
            return target;
        }
    }

    function bind(dom, type, guid) {
        dom.addEventListener(type, function(e) {
            for (var i = 0; i < Ye.Events[guid][type].length; i++) {
                Ye.Events[guid][type][i].call(dom, e);
            }
        })
    }

    function delegate(agent, type, selector) {
        var id = agent.deleId;
        agent.addEventListener(type, function(e) {
            var target = e.target,
                ctarget = e.currentTarget,
                bubble = true; //是否阻止冒泡

            //当阻止冒泡，并且没到顶时就循环
            while (bubble && target != ctarget) {
                if (filiter(agent, selector, target)) {
                    for (var i = 0; i < Ye.deleEvents[id][selector][type].length; i++) {
                        Ye.deleEvents[id][selector][type][i].call(target, e);
                    }
                }
                target = target.parentNode;
                return bubble;
            }
        }, false)
    }
    //过滤，看目标是否在选择器selector里面
    function filiter(agent, selector, target) {
        var nodes = agent.querySelectorAll(selector);
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i] == target) {
                return true;
            }
        }
    }

    window.$ = Ye;
})(window, document)
