/**
 * ViewBox
 * @author Pavel Khoroshkov aka pgood
 * @link https://github.com/pgooood/viewbox
 */
(function($){$.fn.viewbox = function(options){
	
	if(typeof(options) === 'undefined')
		options = {};
	
	options = $.extend({
		template: '<div class="viewbox-container"><div class="viewbox-body"><div class="viewbox-header"></div><div class="viewbox-content"></div><div class="viewbox-footer"></div></div></div>'
		,loader: '<div class="loader"><div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div></div>'
		,setTitle: true
		,margin: 20
		,resizeDuration: 400
		,openDuration: 200
		,closeDuration: 200
		,closeButton: true
		,navButtons: true
		,closeOnSideClick: true
		,nextOnContentClick: false
		,useGestures: true
	},options);
	
	var $links = $(this)
		,$container = $(options.template)
		,$loader = $(options.loader)
		,state = false
		,locked = false
		,$current
		,arCloseWindowCallback = [];
	
	if(!$('#viewbox-sprite').length)	
		$('body').get(0).insertAdjacentHTML('afterbegin','<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="viewbox-sprite" style="display:none"><symbol id="viewbox-close-icon" viewBox="0 0 50 50"><path d="M37.304 11.282l1.414 1.414-26.022 26.02-1.414-1.413z"/><path d="M12.696 11.282l26.022 26.02-1.414 1.415-26.022-26.02z"/></symbol><symbol id="viewbox-prev-icon" viewBox="0 0 50 50"><path d="M27.3 34.7L17.6 25l9.7-9.7 1.4 1.4-8.3 8.3 8.3 8.3z"/></symbol><symbol id="viewbox-next-icon" viewBox="0 0 50 50"><path d="M22.7 34.7l-1.4-1.4 8.3-8.3-8.3-8.3 1.4-1.4 9.7 9.7z"/></symbol></svg>');
	
	function openWindow(width,height){
		var $body = get('body')
			,$content = get('content')
			,w,h;
		if(width)
			$content.width(width);
		if(height)
			$content.height(height);
		if(!state){
			state = true;
			$('body').append($container);
			$container.show();
			w = $body.width();
			h = $body.height();
			$container.hide();
			$container.fadeIn(options.openDuration);
		}else{
			w = $body.width();
			h = $body.height();
		};
		$body.css({
			'margin-left': -w/2
			,'margin-top': -h/2
		});
	};
	
	function closeWindow(handler){
		if(typeof(handler) !== 'undefined'){
			if(typeof(handler) === 'function')
				arCloseWindowCallback.push(handler);
			return;
		};
		if(state)
			$container.fadeOut(options.closeDuration,function(){
				$container.detach();
				state = false;
				var arCallback = [];
				while(arCloseWindowCallback.length)
					arCallback.push(arCloseWindowCallback.shift());
				while(arCallback.length)
					arCallback.shift()();
			});
	};
	
	function get(name){
		return $container.find('.viewbox-'+name);
	};
	
	function set(name,value){
		get(name).html(value);
	};
	
	function index(){
		var index = -1;
		if($current){
			$links.each(function(i){
				if($current.is(this)){
					index = i;
					return false;
				};
			});
		};
		return index;
	};
	
	function next(){
		if($links.length <= 1)
			return;
		var nextIndex = index() + 1;
		if(nextIndex >= $links.length)
			nextIndex = 0;
		$links.eq(nextIndex).click();
	};
	
	function prev(){
		if($links.length <= 1)
			return;
		var nextIndex = index() - 1;
		if(nextIndex < 0)
			nextIndex = $links.length - 1;
		$links.eq(nextIndex).click();
	};
	
	function isImage(href){
		return href.match(/(png|jpg|jpeg|gif)$/i);
	};
	
	function isAnchor(href){
		return href.match(/^#.+$/i) && $(href).length;
	}
	
	function isImageLoaded($img){
		return $img.get(0).complete;
	};
	
	function loader(state){
		if(state)
			$loader.appendTo(get('body'));
		else
			$loader.detach();
	};
	
	function addSvgButton(name){
		var $e = $('<div class="viewbox-button-default viewbox-button-'+name+'"></div>')
			,href = window.location.pathname+window.location.search+'#viewbox-'+name+'-icon';
		$e.appendTo($container)
			.get(0)
			.insertAdjacentHTML('afterbegin','<svg><use xlink:href="'+href+'"/></svg>');
		return $e;
	};
	
	function showImage(href,caption){
		var $img = $('<img class="viewbox-image" alt="">').attr('src',href);
		if(!isImageLoaded($img))
			loader(true);
		set('content','');
		set('header',caption);
		openWindow();
		var $body = get('body')
			,counter = 0
			,$content = get('content')
			,timerId = window.setInterval(function(){
				if(!isImageLoaded($img) && counter < 1000){
					counter++;
					return;
				};

				window.clearInterval(timerId);
				loader(false);

				$('body').append($img);
				var wOffset = $body.width() - $content.width() + options.margin*2
					,hOffset = $body.height() - $content.height() + options.margin*2
					,windowWidth = $(window).width() - wOffset
					,windowHeight = $(window).height() - hOffset
					,w = $img.width()
					,h = $img.height();
				$img.detach();

				if(w > windowWidth){
					h = h * windowWidth / w;
					w = windowWidth;
				};
				if(h > windowHeight){
					w = w * windowHeight / h;
					h = windowHeight;
				};
				locked = true;
				$body.animate(
					{
						'margin-left': -(w + wOffset)/2 + options.margin
						,'margin-top': -(h + hOffset)/2 + options.margin
					}
					,options.resizeDuration
				);
				$content.animate(
					{width: w,height: h}
					,options.resizeDuration
					,function(){
						$content.append($img);
						locked = false;
					}
				);
			},isImageLoaded($img) ? 0 : 200);
	};
	
	function showPopup(href,caption){
		var $ePlaceholder = $('<div class="viewbox-content-placeholder"></div>')
			,$eContent = $(href);
		$eContent.before($ePlaceholder);
		closeWindow(function(){
			$ePlaceholder.before($eContent);
			$ePlaceholder.detach();
		});
		set('content','');
		set('header',caption);
		get('content').append($eContent);
		openWindow('auto','auto');
	};
	
	function show($e){
		if(locked) return;
		var href = $e.attr('href')
			,caption = options.setTitle && $e.attr('title') ? $e.attr('title') : '';
		if(!href){
			$current = $e;
			showPopup($e,caption);
		}else if(isImage(href)){
			$current = $e;
			showImage(href,caption);
		}else if(isAnchor(href)){
			$current = $e;
			showPopup(href,caption);
		};
	};
	
	function onSwipe($e,callback){
  		if(typeof(callback) != 'function')
			return;
		var startPos,startTime
			,threshold = 150
			,restraint = 100
			,allowedTime = 300;
		$e.on('touchstart',function(event){
			var touch = event.originalEvent.changedTouches[0];
			startPos = {x:touch.pageX,y:touch.pageY};
			startTime = new Date().getTime();
		});
		$e.on('touchend',function(event){
			var touch = event.originalEvent.changedTouches[0]
				,swipedir = 'none'
				,elapsedTime = new Date().getTime() - startTime
				,endPos = {x:touch.pageX,y:touch.pageY}
				,dist = {
					x:endPos.x - startPos.x
					,y:endPos.y - startPos.y
				};	
			if(elapsedTime <= allowedTime){
				if(Math.abs(dist.x) >= threshold && Math.abs(dist.y) <= restraint)
					swipedir = dist.x < 0 ? 'left' : 'right';
				else if (Math.abs(dist.y) >= threshold && Math.abs(dist.x) <= restraint)
					swipedir = dist.y < 0 ? 'up' : 'down';
			};
			callback.call(this,swipedir);
		});
	};
	
	
	$container.bind('viewbox.close',function(){
		closeWindow();
	});
	
	$container.bind('viewbox.open',function(event,index){
		var run = function(){
			if($links.length)
				show($links.eq(index >= 0 && index < $links.length ? index : 0));
		};
		if(state){
			closeWindow(run);
			closeWindow();
		}else run();
	});
	
	$links.filter('a').click(function(){
		show($(this));
		return false;
	});
	
	get('body').click(function(event){
		event.stopPropagation();
		if(options.nextOnContentClick)
			next();
	});
	
	if(options.closeButton){
		addSvgButton('close').click(function(event){
			event.stopPropagation();
			closeWindow();
		});
	};
	
	if(options.navButtons && $links.length > 1){
		addSvgButton('next').click(function(event){
			event.stopPropagation();
			next();
		});
		addSvgButton('prev').click(function(event){
			event.stopPropagation();
			prev();
		});
	};
	
	if(options.closeOnSideClick){
		$container.click(function(){
			closeWindow();
		});
	};
	
	if(options.useGestures && 'ontouchstart' in document.documentElement){
		onSwipe($container,function(dir){
			switch(dir){
				case 'left':next();break;
				case 'right':prev();break;
			};
		});
	};
	
	return $container;
	
};}(jQuery));