(function(a){
var flashcopy = {
    version: "1.0.7",
    clients:null,
    moviePath: 'copy.swf',
    $: function (elem) {
        // simple DOM lookup utility function
        if (typeof(elem) == 'string') elem = document.getElementById(elem);
        if (!elem.addClass) {
            // extend element with a few useful methods
			elem.prototype={
					hide : function () {
						this.style.display = 'none';
					},
					show : function () {
						this.style.display = '';
					},
					addClass : function (name) {
						this.removeClass(name);
						this.className += ' ' + name;
					},
					removeClass : function (name) {
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
					hasClass : function (name) {
						return !!this.className.match(new RegExp("\\s*" + name + "\\s*"));
					}				
				};

        }
        return elem;
    },
    setMoviePath: function (path) {
        // set path to copy.swf
        this.moviePath = path;
    },
    dispatch: function (id, eventName, args) {
        if (this.clients) {
            this.clients.receiveEvent(eventName, args);
        }
    },
    getDOMObjectPosition: function (obj, stopObj) {
        // get absolute coordinates for dom element
        var info = {
            left: 0,
            top: 0,
            width: obj.width ? obj.width : obj.offsetWidth,
            height: obj.height ? obj.height : obj.offsetHeight
        };

        if (obj && (obj != stopObj)) {
			info.left += obj.offsetLeft;
            info.top += obj.offsetTop;
        }

        return info;
    },
	init:function(elem){
		if(!elem)return null;
		return new flashcopy.Client(elem);
		},
    Client: function (elem) {
		if(flashcopy.clients)
		{
			flashcopy.clients.init(elem);
			return flashcopy.clients;
		}
		this.handlers = {};
        this.movieId = 'flashcopyMovie_';// + this.id;
		flashcopy.clients=this;
        // create movie
        if (elem) this.glue(elem);
    }
};

flashcopy.Client.prototype = {
    //flash中调用js对象所用的名字
    alias:'flashcopy',
	elem:null,
	div:null,
    ready: false,
    movie: null,
    clipText: '',
	swfpath:'',
	success:function(){},
	init:function(elem){
		var _this=this;
		this.elem = flashcopy.$(elem);
		this.elem.onmouseover=function(){
			_this.elem=this;
			_this.reposition(_this.elem);
		};
		},
    glue: function (elem) {
		
        this.init(elem);
        var zIndex = 99;
        if (this.elem.style.zIndex) {
            zIndex = parseInt(this.elem.style.zIndex, 10) + 1;
        }
        var appendElem = document.getElementsByTagName('body')[0];
        var box = flashcopy.getDOMObjectPosition(this.elem);
        this.div = document.createElement('div');
        this.div.className = "zclip";
        this.div.id = "zclip-" + this.movieId;
       // $(this.elem).data('zclipId', 'zclip-' + this.movieId);
        var style = this.div.style;
        style.position = 'absolute';
        style.left = '' + box.left + 'px';
        style.top = '' + box.top + 'px';
        style.width = '' + box.width + 'px';
        style.height = '' + box.height + 'px';
        style.zIndex = zIndex;
        // style.backgroundColor = '#f00'; // debug
        appendElem.appendChild(this.div);

        this.div.innerHTML = this.getHTML(box.width,box.height);
    },
	onCopy:function(o){
		this.alias='flashcopy';
		this.getText=o.setText;
		this.success=o.success;
		this.swfpath=o.swfpath;
		},
    getHTML: function (width, height) {
        // return HTML for movie
        var html = '';
        var flashvars = 'id=0&width=' + width + '&height=' + height+'&alias='+this.alias;

        if (navigator.userAgent.match(/MSIE/)) {
            // IE gets an OBJECT tag
            var protocol = location.href.match(/^https/i) ? 'https://' : 'http://';
            html += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + protocol + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + width + '" height="' + height + '" id="' + this.movieId + '" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + this.swfpath + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + flashvars + '"/><param name="wmode" value="transparent"/></object>';
        } else {
            // all other browsers get an EMBED tag
            html += '<embed id="' + this.movieId + '" src="' + flashcopy.moviePath + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + width + '" height="' + height + '" name="' + this.movieId + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + flashvars + '" wmode="transparent" />';
        }
        return html;
    },

    destroy: function () {
        // destroy control and floater
        if (this.elem && this.div) {
            this.div.innerHTML = '';

            var body = document.getElementsByTagName('body')[0];
            try {
                body.removeChild(this.div);
            } catch (e) {;
            }

            this.elem = null;
            this.div = null;
        }
    },

    reposition: function (elem) {
        if (elem && this.div) {
            var box = flashcopy.getDOMObjectPosition(elem,this.div);
            var style = this.div.style;
            style.left = '' + box.left + 'px';
            style.top = '' + box.top + 'px';
        }
		this.setSize(box.width,box.height);
 },
	getText:function(){
		return '';
		},
//调用这个函数时相当于调用flash中的setText
    setText: function () {
        // set text to be copied to clipboard
        this.clipText = this.getText(this.elem);
        if (this.ready) {
            this.movie.setText(this.clipText);
        }
    },
//调用这个函数时相当于调用flash中的setText
    setSize: function (width,height) {
        // set text to be copied to clipboard
        if (this.ready) {
			this.div.style.width=width+'px';
			this.div.style.height=height+'px';
            this.movie.width=width;
            this.movie.height=height;
            //this.movie.setSize(width,height);
        }
    },

    receiveEvent: function (eventName, args) {
        // receive event from flash
        eventName = eventName.toString().toLowerCase().replace(/^on/, '');

        // special behavior for certain events
        switch (eventName) {
        case 'load':
            // movie claims it is ready, but in IE this isn't always the case...
            // bug fix: Cannot extend EMBED DOM elements in Firefox, must use traditional function
            this.movie = document.getElementById(this.movieId);
            if (!this.movie) {
                var self = this;
                setTimeout(function () {
                    self.receiveEvent('load', null);
                }, 1);
				
                return;
            }

            // firefox on pc needs a "kick" in order to set these in certain cases
            if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
                var self = this;
                setTimeout(function () {
                    self.receiveEvent('load', null);
                }, 100);
                this.ready = true;
                return;
            }

            this.ready = true;
            try {
                this.movie.setText(this.clipText);
            } catch (e) {}
            try {
            } catch (e) {}
			
			console.log('配置加载正常。。。');
            break;

        case 'mousedown':
			this.setText();
            break;
        case 'complete':
			this.success(this.elem,this.clipText);
            break;
        } // switch eventName
    }

};	
a.flashcopy=flashcopy;
})(window);

