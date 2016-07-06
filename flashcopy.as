package
{
    import flash.display.*;
    import flash.events.*;
    import flash.external.*;
    import flash.system.*;

    public class flashcopy extends Sprite
    {
        private var button:Sprite;
        private var id:String = "";
        private var clipText:String = "";
		private var _this:flashcopy=null;
		private var alias:String="flashcopy";

        public function flashcopy()
        {
            stage.scaleMode = StageScaleMode.EXACT_FIT;
            Security.allowDomain("*");
			//加载传过来的变量
            var flashvars:* = LoaderInfo(this.root.loaderInfo).parameters;
			alias=flashvars.alias;
			_this=this;
			//_this.console(flashvars);
            id = flashvars.id;
			//_this.console(id);
            button = new Sprite();
            button.buttonMode = true;
            button.useHandCursor = true;
			//按钮背景色
            button.graphics.beginFill(13434624);
            button.graphics.drawRect(0, 0, stage.stageWidth,stage.stageHeight);
            button.alpha = 0;
            addChild(button);
		   button.addEventListener(MouseEvent.CLICK, clickHandler);
            button.addEventListener(MouseEvent.MOUSE_MOVE,function (event:Event)
            {
				//console('Flash msg:flash mouseIng!');
				//trace('mouse move');
                ExternalInterface.call(alias+".dispatch", id, "mouseMove", null);
				
                return;
            }
            );
            button.addEventListener(MouseEvent.MOUSE_DOWN, function (event:Event)
            {
				console("单击啦flash");
				//System.setClipboard(clipText);
				//trace('mouse_down copyed:'+clipText);
                ExternalInterface.call(alias+".dispatch", id, "mouseDown", null);
                return;
            }
            );
	try{
			//映射js和flash中的函数对应
        //    ExternalInterface.addCallback("setHandCursor", setHandCursor);//设置光标
			//调用浏览器setText设置文本到flash中的变量中
            ExternalInterface.addCallback("setText", setText);
			ExternalInterface.addCallback("setSwfSize", setSwfSize);
			//初始化时直接调用浏览器中js,并回调flash中对应的函数设置flash
            ExternalInterface.call(alias+".dispatch", id, "load", null);
			trace('flash load');
			console('Flash msg:flash copy load ok!');
	}catch(e){
		console(e);
		}
            return;
        }

		//复制文本
        private function clickHandler(event:Event) : void
        {
            System.setClipboard(clipText);
			trace('mouse_click copyed:'+clipText);
            ExternalInterface.call(alias+".dispatch", id, "complete", clipText);
            return;
        }
		//先设置要复制的文本
        public function setText(param1)
        {
			//console('set flash clip text!'+param1);
			trace('set copytext:'+param1);
            clipText = param1;
            return;
        }
		//设置按钮大小 
		public function setSwfSize(param1:Number,param2:Number):void{
			console('reset button size!'+param1+''+param2);
			button.width=param1;
			button.height=param2;
			return;
			}
		//调试输出信息
		public function console(obj){
			//ExternalInterface.call("console.log",obj);
			}

    }
}
