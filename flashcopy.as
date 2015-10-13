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
            var flashvars:* = LoaderInfo(this.root.loaderInfo).parameters;
			alias=flashvars.alias;
			_this=this;
			//_this.console(flashvars);
            id = flashvars.id;
			//_this.console(id);
            button = new Sprite();
            button.buttonMode = true;
            button.useHandCursor = true;
            button.graphics.beginFill(13434624);
            button.graphics.drawRect(0, 0, stage.stageWidth,stage.stageHeight);
            button.alpha = 0.5;
            addChild(button);
            button.addEventListener(MouseEvent.CLICK, clickHandler);
            button.addEventListener(MouseEvent.MOUSE_OVER, function (event:Event)
            {
				//_this.console("移动到flash");
                ExternalInterface.call(alias+".dispatch", id, "mouseOver", null);
                return;
            }// end function
            );
            button.addEventListener(MouseEvent.MOUSE_OUT, function (event:Event)
            {
				//_this.console("移出啦flash");
                ExternalInterface.call(alias+".dispatch", id, "mouseOut", null);
                return;
            }// end function
            );
            button.addEventListener(MouseEvent.MOUSE_DOWN, function (event:Event)
            {
				//_this.console("单击啦flash");
                ExternalInterface.call(alias+".dispatch", id, "mouseDown", null);
                return;
            }// end function
            );
            button.addEventListener(MouseEvent.MOUSE_UP, function (event:Event)
            {
				//_this.console("抬起啦鼠标flash");
                ExternalInterface.call(alias+".dispatch", id, "mouseUp", null);
                return;
            }// end function
            );
			
			//映射js和flash中的函数对应
            ExternalInterface.addCallback("setHandCursor", setHandCursor);//设置光标
			//调用浏览器setText设置文本到flash中的变量中
            ExternalInterface.addCallback("setText", setText);
			ExternalInterface.addCallback("setSize", setSize);
			
			
			
			//初始化时直接调用浏览器中js,并回调flash中对应的函数设置flash
            ExternalInterface.call(alias+".dispatch", id, "load", null);
            return;
        }// end function

        public function setHandCursor(param1:Boolean)
        {
            button.useHandCursor = param1;
            return;
        }// end function

        private function clickHandler(event:Event) : void
        {
            System.setClipboard(clipText);
            ExternalInterface.call(alias+".dispatch", id, "complete", clipText);
            return;
        }// end function

        public function setText(param1)
        {
            clipText = param1;
            return;
        }// end function
		public function setSize(param1:Number,param2:Number):void{
			button.width=param1;
			button.height=param2;
			return;
			}
		public function console(obj){
			ExternalInterface.call("console.log",obj);			
			}

    }
}
