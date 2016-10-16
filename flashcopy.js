/**
 * **************************
 * FlashCopy
 * blog:http:www.zhaokeli.com
 * v1.0.0
 * author:zhaokeli
 *****************************
 *swf文件和flashcopy.js文件放在同一个目录
 *引入flashcopy.js就可以swf文件会自动加载
 */
! function(a) {
    "use strict";
    var b = {
        ish5: function() {
            return document.execCommand ? true : false;
        }(),
        //flash中调用js对象所用的名字要和导出到window的一样
        alias: 'FlashCopy',
        movieId: 'flashcopyid',
        swfpath: function() {
            var a = document.scripts,
                b = a[a.length - 1],
                c = b.src;
            return c.substring(0, c.lastIndexOf("/") + 1);
        }() + 'flashcopy.swf',
        swfobj: null,
        divswf: null,
        ready: false, //flash是否已经加载好啦
        activeDom: null,

        /**
         * 查询元素
         * @type {[type]}
         */
        $: function(elem) {
            return (typeof(elem) == 'string') ? document.getElementById(elem) : elem;
        },
        // {
        //     domid:'copytext',
        //     getCopyText:function(){
        //         return '7777777777777';
        //     },
        //     copySuccess:function(){
        //         console.log('copy ok');
        //     }
        //}
        addClass: function(dom, name) {
            this.removeClass(dom, name);
            dom.className += ' ' + name;
        },
        removeClass: function(dom, name) {
            var classes = dom.className.split(/\s+/);
            var idx = -1;
            for (var k = 0; k < classes.length; k++) {
                if (classes[k] == name) {
                    idx = k;
                    k = classes.length;
                }
            }
            if (idx > -1) {
                classes.splice(idx, 1);
                dom.className = classes.join(' ');
            }
            return dom;
        },
        hasClass: function(dom, name) {
            return !!dom.className.match(new RegExp("\\s*" + name + "\\s*"));
        },
        setCopy: function(o) {
            var _t = this;
            var d = _t.$(o.domid);
            if (!d) {
                return false;
            }
            d.prototype = {
                getCopyText: o.getCopyText,
                copySuccess: o.copySuccess,
                copyFail: o.copyFail
            };
            if (_t.ish5) {
                d.onclick = function() {
                    var tex = d.prototype.getCopyText(d);
                    var msg = _t.copyTextToClipboard(tex);
                    if (msg) {
                        d.prototype.copySuccess(d, tex);
                    } else {
                        d.prototype.copyFail(d, tex);
                    }

                }
                return true;
            }
            _t.initSwf(d);
            d.style.position = 'relative';
            //下面使用闭包,保证每个元素有独立的事件
            (function() {
                var _tt = _t;
                var dd = d;
                dd.onmouseover = function() {
                    _tt.activeDom = dd;
                    _tt.reposition(dd);
                };
            })();
        },
        getObjRect: function(id) {
            return this.$(id).getBoundingClientRect();
        },
        getScrollTop: function() {
            var scrollTop = 0;
            if (document.documentElement && document.documentElement.scrollTop) {
                scrollTop = document.documentElement.scrollTop;
            } else if (document.body) {
                scrollTop = document.body.scrollTop;
            }
            return scrollTop;
        },
        /**
         * 取元素的宽高
         * @param  {[type]} dom [description]
         * @return {[type]}     [description]
         */
        getWH: function(dom) {
            return {
                width: dom.width ? dom.width : dom.offsetWidth,
                height: dom.height ? dom.height : dom.offsetHeight
            };
        },
        initSwf: function(dom) {
            var _t = this;
            if (!_t.divswf) {
                var zIndex = 9999999999999;
                var d = document.createElement('div');
                d.className = "zclip";
                d.id = "flashcopyzclip";
                d.style.cssText = 'display:block;top:-10000000px;position:absolute;left:-100000px;cursor:pointer;z-index:' + zIndex;
                document.getElementsByTagName('body')[0].appendChild(d);
                _t.divswf = d;
                var box = _t.getWH(dom);
                this.divswf.innerHTML = this.getSwfHTML(box.width, box.height);
                this.swfobj = _t.$(_t.movieId);
            }
        },
        getSwfHTML: function(width, height) {
            // return HTML for movie
            var html = '';
            var flashvars = 'id=0&width=' + width + '&height=' + height + '&alias=' + this.alias;

            if (navigator.userAgent.match(/MSIE/)) {
                // IE gets an OBJECT tag
                var protocol = location.href.match(/^https/i) ? 'https://' : 'http://';
                html += '<object style="vertical-align: top;"  classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + protocol + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="' + width + '" height="' + height + '" id="' + this.movieId + '" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + this.swfpath + '?' + Math.random() + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + flashvars + '"/><param name="wmode" value="transparent"/></object>';
            } else {
                // all other browsers get an EMBED tag
                html += '<embed style="vertical-align: top;" id="' + this.movieId + '" src="' + this.swfpath + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + width + '" height="' + height + '" name="' + this.movieId + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + flashvars + '" wmode="transparent" />';
            }
            return html;
        },
        //移动swf到元素上面
        reposition: function(dom) {
            var box = this.getWH(dom);
            var re = this.getObjRect(dom);
            this.divswf.style.left = re.left + 'px';
            this.divswf.style.top = re.top + this.getScrollTop() + 'px';
            this.setSize(box.width, box.height);

        },
        setSize: function(width, height) {
            // set text to be copied to clipboard

            this.divswf.style.width = width + 'px';
            this.divswf.style.height = height + 'px';
            this.divswf.style.display = 'block';
            this.swfobj.width = width;
            this.swfobj.height = height;
            (typeof this.swfobj.setSwfSize == 'function') && this.swfobj.setSwfSize(width, height);


        },
        /**
         * 分配事件
         * @param  id        索引id
         * @param  eventName 事件名字
         * @param  args      参数
         * @return [description]
         */
        dispatch: function(eventName, args) {
            this.receiveEvent(eventName, args);
            // console.log(this.swfobj.setText);
        },
        receiveEvent: function(eventName, args) {
            // receive event from flash
            eventName = eventName.toString().toLowerCase().replace(/^on/, '');
            switch (eventName) {

                //保证flash创建完成
                case 'load':
                    if (!this.swfobj) {
                        var self = this;
                        setTimeout(function() {
                            self.receiveEvent('load', null);
                        }, 1);

                        return;
                    }
                    // firefox on pc needs a "kick" in order to set these in certain cases
                    if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
                        var self = this;
                        setTimeout(function() {
                            self.receiveEvent('load', null);
                        }, 100);
                        this.ready = true;
                        return;
                    }
                    this.ready = true;
                    break;
                    //在flash上按下鼠标时
                case 'mousedown':
                    if (this.ready) {
                        if (typeof(this.swfobj.setText) == 'undefined') {
                            //console.log('this.swfobj.setText undefined');
                        } else {

                            this.swfobj.setText(this.activeDom.prototype.getCopyText(this.activeDom));
                        }
                    }
                    break;
                    //鼠标在flash上移动时调用
                case 'mousemove':
                    // console.log('mousemove');
                    break;
                    //鼠标放在flash上面时调用
                case 'mouseover':
                    // console.log('mouseover');
                    this.addClass(this.activeDom, 'hover');
                    //this.ready && this.swfobj.setText(this.activeDom.prototype.getCopyText(this.activeDom));
                    break;
                    //鼠标离开flash时调用
                case 'mouseout':
                    // console.log('mouseout');
                    this.removeClass(this.activeDom, 'hover');
                    break;
                    //复制完成时调用
                case 'complete':
                    this.activeDom.prototype.copySuccess(this.activeDom, args);
                    break;
            }
        },
        //html5复制
        copyTextToClipboard: function(text) {
            var ta = document.createElement("textarea")
            ta.style.position = 'fixed'
            ta.style.top = 0
            ta.style.left = 0
            ta.style.width = '2em'
            ta.style.height = '2em'
            ta.style.padding = 0
            ta.style.border = 'none'
            ta.style.outline = 'none'
            ta.style.boxShadow = 'none'
            ta.style.background = 'transparent'
            ta.value = text
            document.body.appendChild(ta)
            ta.select()
            try {
                var msg = document.execCommand('copy');
                document.body.removeChild(ta)
                return msg;
            } catch (err) {
                document.body.removeChild(ta)
                alert('不能使用这种方法复制内容')
                return false;
            }
        }
    };
    // b.ish5 = b.copyTextToClipboard('');
    a.FlashCopy = b;
}(window);