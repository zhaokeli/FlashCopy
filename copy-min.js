!function(a){var b={version:"1.0.0",clients:null,moviePath:"",$:function(a){return"string"==typeof a&&(a=document.getElementById(a)),a.addClass||(a.prototype={hide:function(){this.style.display="none"},show:function(){this.style.display=""},addClass:function(a){this.removeClass(a),this.className+=" "+a},removeClass:function(a){var b,c=this.className.split(/\s+/),d=-1;for(b=0;b<c.length;b++)c[b]==a&&(d=b,b=c.length);return d>-1&&(c.splice(d,1),this.className=c.join(" ")),this},hasClass:function(a){return!!this.className.match(new RegExp("\\s*"+a+"\\s*"))}}),a},setSwfPath:function(a){this.moviePath=a},dispatch:function(a,b,c){this.clients&&this.clients.receiveEvent(b,c)},getDOMObjectPosition:function(a,b){var c={left:0,top:0,width:a.width?a.width:a.offsetWidth,height:a.height?a.height:a.offsetHeight};return a&&a!=b&&(c.left+=a.offsetLeft,c.top+=a.offsetTop),c},init:function(a){return a?b.clients?(b.clients.init(a),b.clients):new b.Client(a):null},Client:function(a){this.movieId="FlashCopyMovie_",b.clients=this,a&&this.glue(a)}};b.Client.prototype={alias:"FlashCopy",elem:null,div:null,ready:!1,movie:null,clipText:"",success:function(){},init:function(a){var c=this;this.elem=b.$(a),this.elem.onmouseover=function(){c.elem=this,c.reposition(c.elem)}},glue:function(a){var c,d,e,f;this.init(a),c=99,this.elem.style.zIndex&&(c=parseInt(this.elem.style.zIndex,10)+1),d=document.getElementsByTagName("body")[0],e=b.getDOMObjectPosition(this.elem),this.div=document.createElement("div"),this.div.className="zclip",this.div.id="zclip-"+this.movieId,f=this.div.style,f.position="absolute",f.left=""+e.left+"px",f.top="-1000px",f.width=""+e.width+"px",f.height=""+e.height+"px",f.zIndex=c,d.appendChild(this.div),this.div.innerHTML=this.getHTML(e.width,e.height)},onCopy:function(a){this.alias="FlashCopy",this.elem.prototype={onCopygetText:a.setText,onCopysuccess:a.success}},getHTML:function(a,c){var d,e="",f="id=0&width="+a+"&height="+c+"&alias="+this.alias;return navigator.userAgent.match(/MSIE/)?(d=location.href.match(/^https/i)?"https://":"http://",e+='<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="'+d+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="'+a+'" height="'+c+'" id="'+this.movieId+'" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="'+b.moviePath+'" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="'+f+'"/><param name="wmode" value="transparent"/></object>'):e+='<embed id="'+this.movieId+'" src="'+b.moviePath+'" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="'+a+'" height="'+c+'" name="'+this.movieId+'" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="'+f+'" wmode="transparent" />',e},destroy:function(){if(this.elem&&this.div){this.div.innerHTML="";var a=document.getElementsByTagName("body")[0];try{a.removeChild(this.div)}catch(b){}this.elem=null,this.div=null}},reposition:function(a){var c,d;a||(elel=this.elem),a&&this.div&&(c=b.getDOMObjectPosition(a,this.div),d=this.div.style,d.left=""+c.left+"px",d.top=""+c.top+"px"),this.setSize(c.width,c.height)},getText:function(){return""},setText:function(){this.clipText=this.elem.prototype.onCopygetText(this.elem),this.ready&&this.movie.setText(this.clipText)},setSize:function(a,b){this.ready&&(this.div.style.width=a+"px",this.div.style.height=b+"px",this.movie.width=a,this.movie.height=b)},receiveEvent:function(a){var b;switch(a=a.toString().toLowerCase().replace(/^on/,"")){case"load":if(this.movie=document.getElementById(this.movieId),!this.movie)return b=this,setTimeout(function(){b.receiveEvent("load",null)},1),void 0;if(!this.ready&&navigator.userAgent.match(/Firefox/)&&navigator.userAgent.match(/Windows/))return b=this,setTimeout(function(){b.receiveEvent("load",null)},100),this.ready=!0,void 0;this.ready=!0;try{this.movie.setText(this.clipText)}catch(c){alert("flash copy error")}try{}catch(c){alert("flash copy error")}break;case"mousedown":this.setText();break;case"complete":this.elem.prototype.onCopysuccess(this.elem,this.clipText)}}},a.FlashCopy=b}(window);