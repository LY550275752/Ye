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
        trim: function(str) {
            return str.replace(/^\s+/g, "").replace(/\s+$/g, "");
        },
        //得到的dom都按数组来处理,所以都需要for
        hasClass: function(cls) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)'),
                arr = [];
            for (var i = 0; i < this.length; i++) {
                if (this[i].className.match(reg)) {
                    arr.push(true);
                }else{
                    arr.push(false);
                } 
            }
            console.log(arr);
            if (arr.indexOf(true) != -1) return true;
            else return false;
        },
        addClass: function(cls) {
            var reg = new RegExp('\\s|^') + cls + new RegExp('\\s|$');
            for (var i = 0; i < this.length; i++) {
                if (!this[i].className.match(reg)) {
                    this[i].className += " " + cls
                }
            }
            return this;
        },
        removeClass: function(cls) {
            var reg = new RegExp('\\s|^') + cls + new RegExp('\\s|$');
            for (var i = 0; i < this.length; i++) {
                if (this[i].className.match(reg)) {
                    this[i].className = this[i].className.replace(cls, "")
                }
            }
            return this;
        },
        css: function(attr, val) {
            for (var i = 0; i < this.length; i++) {
                if (typeof attr == 'string') {
                    if (arguments.length == 1) {
                        return getComputedStyle(this[i], null)[attr];
                    }
                    this[i].style[attr] = val;
                } else {
                    var self = this[i];
                    f.each(attr, function(attr, val) {
                        self.cssText += '' + attr + ':' + val + ';';
                    });
                }
            }
            return this;
        },
        attr: function(attr, val) {
            for (var i = 0; i < this.length; i++) {
                if (typeof attr == 'srting') {
                    if (arguments.length == 1) {
                        return this[i].getAttribute(attr);
                    }
                    this[i].setAttribute(attr, val);
                } else {
                    var self = this[i];
                    f.each(attr, function(attr, val) {
                        self.setAttribute(attr, val);
                    });
                }
            }
            return this;
        },
        data: function(attr, val) {
            for (var i = 0; i < this.length; i++) {
                if (typeof attr == 'string') {
                    if (arguments.length == 1) {
                        return this[i].getAttribute('data-' + attr);
                    }
                    this[i].setAttribute('data-' + attr, val);
                } else {
                    var self = this[i];
                    f.each(attr, function(attr, val) {
                        self.setAttribute('data-' + attr, val);
                    });
                }
            }
            return this;
        },
        next: function() {
            return sibling(this[0], 'nextSibling');
        },
        prev: function() {
            return sibling(this[0], 'previousSibling');
        },
        parent: function() {
            var parent = this[0].parentNode;
            parent && parent.nodeType !== 11 ? parent : null;
            var a = Ye();
            a[0] = parent;
            a.length = 1;
            a.selector = parent.tagName.toLowerCase();
            return a;
        },
        parents: function() {
            var a = Ye(),
                i = 0;
            while ((this[0] = this[0].parentNode) && this[0].nodeType !== 9) {
                if (this[0].nodeType == 1) {
                    a[i] = this[0];
                    i++;
                }
            }
            a.length = i;
            console.log(a);
            return a;
        },
        find: function(selector) {
            if (!selector) return;
            var context = this.selector;
            return new Ye(context + ' ' + selector);
        },
        first: function() {
            return new Ye(this[0]);
        },
        last: function() {
            var num = this.length - 1;
            return new Ye(this[num]);
        },
        eq: function(num) {
            var num = num < 0 ? (this.length - 1) : num;
            return new Ye(this[num]);
        },
        get: function(num) {
            var num = num < 0 ? (this.length - 1) : num;
            return this[num];
        },
        html: function(value) {
            if (value === undefined) {
                return this[0].innerHTML;
            } else {
                for (var i = 0; i < this.length; i++) {
                    this[i].innerHTML = value;
                }
            }
            return this;
        },
        append: function(str) {
            for (var i = 0; i < this.length; i++) {
                domAppend(this[i], 'beforeend', str);
            }
            return this;
        },
        before: function(str) {
            for (var i = 0; i < this.length; i++) {
                domAppend(this[i], 'beforeBegin', str);
            }
            return this;
        },
        after: function(str) {
            for (var i = 0; i < this.length; i++) {
                domAppend(this[i], 'afterend', str);
            }
            return this;
        },
        remove: function() {
            //删除自身
            for (var i = 0; i < this.length; i++) {
                this[i].parentNode.removeChild(this[i]);
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
        width: function(w) {
            if (arguments.length == 1) {
                for (var i = 0; i < this.length; i++) {
                    this[i].style.width = w + 'px';
                }
            } else {
                if (this[0].document = doc) {
                    return this[0].innerWidth;
                } else if (this[0].nodeType == 9) {
                    return document.documentElement.clientWidth;
                } else {
                    return parseInt(getComputedStyle(this[0], null)['width']);
                }
            }
        },
        height: function(h) {
            if (arguments.length == 1) {
                for (var i = 0; i < this.length; i++) {
                    this[i].style.height = w + 'px';
                }
            } else {
                if (this[0].document = doc) {
                    return this[0].innerheight;
                } else if (this[0].nodeType == 9) {
                    return document.documentElement.clientheight;
                } else {
                    return parseInt(getComputedStyle(this[0], null)['height']);
                }
            }
        },
        sliblings:function(){
            var arr = [];
            sliblings(this[0],arr);
            return arr;
        }
    }
    Ye.prototype.init.prototype = Ye.prototype;

    //事件组
    Ye.Events = [];
    Ye.guid = 0;
    //事件委托数组
    Ye.deleEvents = [];
    Ye.deleId = 0;

    Ye.ready = function(fn) {
        doc.addEventListener('DOMContentLoaded', function() {
            fn && fn();
        }, false);
        doc.removeEventListen('DOMContentLoaded', fn, true);
    }
    Ye.ajax = function() {
        console.log("ajax");
    }
    Ye.each = function(obj, callback) {
        var len = obj.length,
            constru = obj.constructor,
            i = 0;
        if (constru = window.f) {
            for (; i < len; i++) {
                var val = callback.call(obj[i], i, obj[i]);
                if (val == false) break;
            }
        } else if (isArray(obj)) {
            for (; i < len; i++) {
                var val = callback.call(obj[i], i, obj[i]);
                if (val == false) break;
            }
        } else {
            for (var i in obj) {
                var val = callback.call(obj[i], i, obj[i]);
                if (val == false) break;
            }
        }
    }
    Ye.get = function() {}
    Ye.post = function() {}
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
    //回调列表对象
    Ye.Callbacks = function(){
        var list = [], //回调函数数组
            firing, //是否正在执行
            firingIndex,
            firingStart,
            firingLength,

            add = function(fn){
                list.push(fn);
            },
            fire = function(context ,args){
                args = args || [];
                firing = true;
                firingIndex = firingStart || 0,
                firingLength = list.length;
                for(;firingIndex < firingLength; firingIndex++){
                    list[firingIndex].apply(context,args);
                }
                firing = false;
            };
        var self = {
            add:function(){
                if(list){
                    var length = list.length;
                    add(arguments[0]);
                    //如果回调函数列表正在执行，就修正length，使得新加入的也会执行
                    if(firing){
                        firingLength = listLength;
                    }
                }
                return this;
            },
            remove:function(){
                var args = arguments,
                    argsIndex = 0,
                    argsLen = arguments.length;
                for(; argsIndex < argsLen; argsIndex++){
                    for(var i = 0; i < list.length; i++){
                        if(args[argsIndex] === list[i]){
                            //找到了，准备移除
                            if(argsIndex <= firingLength){
                                firingLength--;
                                if( i <= firingIndex){
                                    firingIndex--;
                                }
                            }
                            list.splice(i--,1);
                        }
                    }
                }
                return this;
            },
            empty:function(){},
            lock:function(){},
            fire:function(){
                fire(this,arguments);
                return this;
            }
        }
        return self;
    }

    /**************
      * 异步队列模块
    *********/
    Ye.extend({
        Deferred:function(func){
            var doneList = Ye.Callbacks(),
                failList = Ye.Callbacks(),
                progressList = Ye.Callbacks(),
                state = "pending",
                lists = {
                    //后面通过each来遍历增加方法，简化代码
                    resolve:doneList,
                    reject:failList,
                    notify:progressList
                },
                //异步队列的只读对象
                promise = {
                    done:doneList.add,
                    fail:failList.add,
                    progress:progressList.add,
                    state:function(){
                        return state;
                    },
                    then:function(doneCallbacks,failCallbacks,progressCallbacks){
                        deferred.done(doneCallbacks).fail(failCallbacks).progress(progressCallbacks);
                        return this;
                    },
                    always:function(){
                        deferred.done(arguments).fail(arguments);
                        return this;
                    },
                    promise:function(obj){
                        if(obj == null){
                            obj = promise;
                        }else{
                            for(var key in promise){
                                obj[key] = promise[key]
                            }
                        }
                        return obj;
                    }
                },
                deferred = promise.promise({}),
                key;
                //把只读promise放到异步队列里
                for(var key in lists){
                    deferred[key] = lists[key].fire,
                    deferred[key + "With"] = lists[key].fierWith;
                }

                //添加修改状态回调函数
                deferred.done(function(){
                    state = "resolved";
                }).fail(function(){
                    state = "rejected";
                })

                if(func){
                    func.call(deferred,deferred)
                }

                return deferred;
        },
        when:function(func){

        }
    })
    /**************
       * 异步队列模块结束
    *********/

    function ajax(options) {
        var defaultOptions = {
            url: false,
            type: "GET",
            data: false,
            success: false,
            complete: false
        };
        for (i in defaultOptions) {
            if (options[i] === undefined) {
                options[i] = defaultOptions[i];
            }
        }
        var xhr = new XMLHttpRequest(),
            url = options.url;
        xhr.open(options.type, url);
        xhr.onreadystatechange = onStateChange;
        if (options.type === 'POST') {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        xhr.send(options.data ? options.data : null);

        function onStateChange() {
            if (xhr.readyState == 4) {
                var result,
                    status = xhr.status;
                if ((status >= 200 && status < 300) || status == 304) {
                    result = xhr.responseText;
                    if (window.JSON) {
                        result = JSON.parse(result);
                    } else {
                        result = eval('(' + result + ')');
                    }
                    ajaxSuccess(result, xhr);
                } else {
                    console.log("ERR", xhr.status);
                }
            }
        }

        function ajaxSuccess(data, xhr) {
            var status = 'success';
            options.success && options.success(data, options, status, xhr);
            ajaxComplete(status);
        }

        function ajaxComplete(status) {
            options.complete && options.complete(status);
        }
    }

    function sibling(cur, dir) {
        while ((cur = cur[dir]) && cur.nodeType !== 1) {}
        return cur;
    }
    function sliblings(cur,arr){
        if(cur.previousSibling){
            sliblings(cur.previousSibling)
        }
        console.log(cur);
    }

    function isArray(obj) {
        return Array.isArray(obj);
    }

    function domAppend(elm, type, str) {
        elm.insertAdjacentHTML(type, str);
    }

    function bind(dom, type, guid) {
        console.log(dom, type, guid);
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
