# ViewBox
Viewbox is a jQuery plugin for displaying images. [Demo page](http://pgood.ru/userfiles/file/viewbox/demo/)
```js
$(function(){
	$('.thumbnail').viewbox();
});
```
```html
<a href="images/i1.jpg" class="thumbnail">
	<img src="images/i1.jpg" alt="">
</a>
<a href="images/i2.jpg" class="thumbnail" title="Image Title">
	<img src="images/i2.jpg" alt="">
</a>
<a href="images/i3.jpg" class="thumbnail">
	<img src="images/i3.jpg" alt="">
</a>
```
Some options
```js
$(function(){
	$('.thumbnail').viewbox({
		setTitle: true
		,margin: 20
		,resizeDuration: 300
		,openDuration: 200
		,closeDuration: 200
		,closeButton: true
		,navButtons: true
		,closeOnSideClick: true
		,nextOnContentClick: true
	});
});
```
