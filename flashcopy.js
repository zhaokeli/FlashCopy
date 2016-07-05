! function(a) {
    var b = {
        //flash中调用js对象所用的名字要和导出到window的一样
        alias: 'FlashCopy',
        movieId: 'flashcopyid',
        swfpath: '/copy.swf',
        swf: null,
        divswf: null,
        ready: false, //flash是否创建好啦
        /**
         * 查询元素
         * @type {[type]}
         */
        $: function(elem) {

            if (typeof(elem) == 'string') elem = document.getElementById(elem);
            //给元素扩展函数
            if (!elem.addClass) {
                elem.prototype = {
                    hide: function() {
                        this.style.display = 'none';
                    },
                    show: function() {
                        this.style.display = '';
                    },
                    addClass: function(name) {
                        this.removeClass(name);
                        this.className += ' ' + name;
                    },
                    removeClass: function(name) {
                        var classes = this.className.split(/\s+/);
                        var idx = -1;
                        for (var k = 0; k < classes.length; k++) {
                            if (classes[k] == name) {
                                idx = k;
                                k = classes.length;
                            }
                        }
                        if (idx > -1) {
                            classes.splice(idx, 1);
                            this.className = classes.join(' ');
                        }
                        return this;
                    },
                    hasClass: function(name) {
                        return !!this.className.match(new RegExp("\\s*" + name + "\\s*"));
                    }
                };

            }
            return elem;
        },

        setCopy: function(domid, copyText, success) {
            this.copyText = copyText;
            this.success = success;
            var _t = this;
            var dom = _t.$(domid);
            _t.initSwf(dom);
            dom.style.position = 'relative';
            dom.onmouseover = function() {
                // var s = _this.div.style;
                // s.top = '0px';
                // s.display = '';
                dom.appendChild(_t.divswf);
                //_t.divswf.display = 'block';
                // _this.elem = this;
                _t.reposition(dom);
            };
        },

        initSwf: function(dom) {
            var _t = this;
            if (!_t.divswf) {
                var zIndex = 9999999999999;
                var d = document.createElement('div');
                d.className = "zclip";
                d.id = "flashcopyzclip";
                d.style = 'display:none;position:absolute;left:0px;top:0px;zIndex:' + zIndex;
                document.getElementsByTagName('body')[0].appendChild(d);
                _t.divswf = d;
                var box = {
                    width: dom.width ? dom.width : dom.offsetWidth,
                    height: dom.height ? dom.height : dom.offsetHeight
                };
                this.divswf.innerHTML = this.getSwfHTML(box.width, box.height);
                this.swf = _t.$(_t.movieId);
            }
        },
        getSwfHTML: function(width, height) {
            // return HTML for movie
            var html = '';
            var flashvars = 'id=0&width=' + width + '&height=' + height + '&alias=' + this.alias;

            if (navigator.userAgent.match(/MSIE/)) {
                // IE gets an OBJECT tag
                var protocol = location.href.match(/^https/i) ? 'https://' : 'http://';
                html += '<object style="vertical-align: top;"  classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + protocol + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + width + '" height="' + height + '" id="' + this.movieId + '" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + this.swfpath + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + flashvars + '"/><param name="wmode" value="transparent"/></object>';
            } else {
                // all other browsers get an EMBED tag
                html += '<embed style="vertical-align: top;" id="' + this.movieId + '" src="' + this.swfpath + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + width + '" height="' + height + '" name="' + this.movieId + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + flashvars + '" wmode="transparent" />';
            }
            return html;
        },
        //移动swf到元素上面
        reposition: function(obj) {
            var box = {
                width: obj.width ? obj.width : obj.offsetWidth,
                height: obj.height ? obj.height : obj.offsetHeight
            };
            this.setSize(box.width, box.height);
        },
        setSize: function(width, height) {
            // set text to be copied to clipboard

            this.divswf.style.width = width + 'px';
            this.divswf.style.height = height + 'px';
            this.divswf.style.display = 'block';
            this.swf.width = width;
            this.swf.height = height;

        },
        /**
         * 分配事件
         * @param  id        索引id
         * @param  eventName 事件名字
         * @param  args      参数
         * @return [description]
         */
        dispatch: function(id, eventName, args) {

            this.receiveEvent(eventName, args);
        },
        //复制成功回调
        success: function() {
            console.log('copy success');
        },
        //设置文本回调
        copyText: function() {
            return '';
        },
        receiveEvent: function(eventName, args) {
            // receive event from flash
            eventName = eventName.toString().toLowerCase().replace(/^on/, '');

            // special behavior for certain events
            switch (eventName) {

                //保证flash创建完成
                case 'load':
                    // movie claims it is ready, but in IE this isn't always the case...
                    // bug fix: Cannot extend EMBED DOM elements in Firefox, must use traditional function
                    // this.movie = document.getElementById(this.movieId);
                    if (!this.swf) {
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
                    try {
                        this.swf.setText(this.clipText);
                    } catch (e) {
                        // alert('flash copy error');
                    }
                    try {} catch (e) {
                        //alert('flash copy error');
                    }
                    break;
                    //在flash上按下鼠标时
                case 'mousedown':
                    if (this.ready) {
                        this.swf.setText(this.copyText());
                    }
                    break;
                    //复制完成
                case 'complete':
                    this.success();
                    break;
            }
        }

    };
    a.FlashCopy = b;
}(window);