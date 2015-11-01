/**
 * ViewBox
 * @author Pavel Khoroshkov aka pgood
 */
(function($){$.fn.viewbox = function(options){
	
	if(typeof(options) === 'undefined')
		options = {};
	
	options = $.extend({
		template: '<div class="viewbox-container"><div class="viewbox-body"><div class="viewbox-header"></div><div class="viewbox-content"></div><div class="viewbox-footer"></div></div></div>'
		,loader: '<div class="loader"><div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div></div>'
		,setTitle: true
		,margin: 20
		,resizeDuration: 300
		,openDuration: 200
		,closeDuration: 200
		,closeButton: true
		,navButtons: true
		,closeOnSideClick: true
		,nextOnContentClick: true
	},options);
	
	var $links = $(this)
		,$container = $(options.template)
		,$loader = $(options.loader)
		,state = false
		,locked = false
		,$current;
		
	$('body').get(0).insertAdjacentHTML('afterbegin','<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="viewbox-sprite" style="display:none">\
			<symbol id="viewbox-close-icon" viewBox="0 0 50 50"><path d="M37.304 11.282l1.414 1.414-26.022 26.02-1.414-1.413z"/><path d="M12.696 11.282l26.022 26.02-1.414 1.415-26.022-26.02z"/></symbol>\
			<symbol id="viewbox-prev-icon" viewBox="0 0 50 50"><path d="M27.3 34.7L17.6 25l9.7-9.7 1.4 1.4-8.3 8.3 8.3 8.3z"/></symbol>\
			<symbol id="viewbox-next-icon" viewBox="0 0 50 50"><path d="M22.7 34.7l-1.4-1.4 8.3-8.3-8.3-8.3 1.4-1.4 9.7 9.7z"/></symbol>\
		</svg>');
	
	function show(){
		if(!state){
			$('body').append($container);
			$container.fadeIn(options.openDuration);
			state = true;
		};
		var $body = get('body');
		$body.css({
			'margin-left': -$body.width()/2
			,'margin-top': -$body.height()/2
		})
	};
	
	function hide(){
		if(state){
			$container.fadeOut(options.closeDuration,function(){
				$container.detach();
			});
			state = false;
		};
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
	
	function isImageLoaded($img){
		return $img.get(0).complete;
	}
	
	function loader(state){
		if(state)
			$loader.appendTo(get('body'));
		else
			$loader.detach();
	};
	
	function addSvgButton(name){
		var $e = $('<div class="viewbox-button-default viewbox-button-'+name+'"></div>');
		$e.appendTo($container)
			.get(0)
			.insertAdjacentHTML('afterbegin','<svg><use xlink:href="#viewbox-'+name+'-icon"/></svg>');
		return $e;
	};
	
	
	$links.click(function(){
		if(locked) return;
		$e = $(this);
		set('header',options.setTitle && $e.attr('title') ? $e.attr('title') : '');
		if(isImage($e.attr('href'))){
			var $img = $('<img class="viewbox-image" alt="">').attr('src',$e.attr('href'))
			$current = $e;
			set('content','');
			show();
			if(!isImageLoaded($img))
				loader(true);
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
						{
							width: w
							,height: h
						}
						,options.resizeDuration
						,function(){
							$content.append($img);
							locked = false;
						}
					);
				},isImageLoaded($img) ? 0 : 200);
		}
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
			hide();
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
		$container.click(hide);
	};
	
	return this;
	
}}(jQuery));