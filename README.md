# ViewBox
Viewbox is a jQuery plugin for displaying images and other HTML content. [Demo page](http://pgood.ru/userfiles/file/viewbox/demo/)
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

Viewbox and Custom HTML Content
-------
Make an anchor link which points to content element.
```html
<p><a href="#popup" class="popup-link">Open popup window</a></p>
<!-- Use invisible wraper to hide popup window content -->
<div style="display:none;">
	<div id="popup">
		<h3>Popup content</h3>
		<p>Some text for popup window.</p>
		<p><button type="button" class="close-button">Close</button></p>
	</div>
</div>
```
Apply viewbox() method to an anchor link which points to content element.
```js
$(function(){
	var vb = $('.popup-link').viewbox();
	//optional: custom close button
	$('.close-button').click(function(){
		vb.trigger('viewbox.close');
	});
});
```
Or apply viewbox() method to a content element.
```js
$(function(){
	var vb = $('#popup').viewbox();
	$('.popup-open-button').click(function(){
		vb.trigger('viewbox.open');
	});
});
```

Options
-------
These options are default.
```js
$(function(){
	$('.thumbnail').viewbox({
		setTitle: true //add caption if link has title attribute
		,margin: 20
		,resizeDuration: 300
		,openDuration: 200
		,closeDuration: 200
		,closeButton: true
		,navButtons: true
		,closeOnSideClick: true
		,nextOnContentClick: false
		,useGestures: true
	});
});
```

Custom events
-------
There are some of custom events you can use to control Viewbox. To trigger these custom events, simply target the object created by the plugin.

**viewbox.open**
Opens Viewbox (if it is not already opened). 
Example: `vb.trigger('viewbox.open',[index]);`. 
index - index of item to show (0 default)

**viewbox.close**
Closes Viewbox (if it is not already closed). 
Example: `vb.trigger('viewbox.close');`.

**viewbox.next**
Shows next image in the set.
Example: `vb.trigger('viewbox.next');`.

**viewbox.prev**
Shows previous image in the set. 
Example: `vb.trigger('viewbox.prev');`.

## License
Copyright (c) 2015 Pavel Khoroshkov. Licensed under the [MIT license](https://github.com/pgooood/viewbox/blob/master/LICENSE).
