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
        version:'1.0.1'
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
    }
    Ye.prototype.init.prototype = Ye.prototype;
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


    window.$ = Ye;
})(window, document)
