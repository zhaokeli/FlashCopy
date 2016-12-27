# FlashCopy
================================================
FlashCopy
在网页中执行复制的工具

---------------------
v1.0.0   第一个正试版本
支持h5和flash  如果支持h5会优先使用h5
##第一种方法直接传入元素id值绑定复制
```html
<a href="javascript:;" id="copytxt" class="btn" style="width:200px; height:100px;">点击复制1</a>
<script type="text/javascript">
    FlashCopy.setCopy({
        domid:'copytxt',
        getCopyText:function(dom){
            return '这是第一个要复制的数据';
        },
        copySuccess:function(dom,text){
            console.log(dom);
            console.log(text+' copy ok');
        }
    });
</script>
```
##第二种方法通过jquery选中一系列元素绑定复制
```html
//使用jquery通过类选择器选中一个元素列表
$('.btn btn-small copybtn').each(function(index, el) {
    var _t = $(this);
    FlashCopy.setCopy({
        domid: _t[0], //把jquery对象转为普通dom对象
        getCopyText: function(dom) {
            // 在这里返回要复制的值
                        //dom是当前点击的元素对象
            return $(dom).text();
        },
        copySuccess: function(dom, text) {
            // //复制成功后会调用参数为调用的文本
            // alert(text);
            alert('代码复制成功');
        }
    });
});

```
