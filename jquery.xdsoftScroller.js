$.fn.xdsoftScroller = function( _percent ) {
	return this.each(function() {
		var timeboxparent = $(this);
		if( !$(this).hasClass('xdsoft_scroller_box') ) {
			var pointerEventToXY = function( e ) {
					var out = {x:0, y:0};
					if( e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel' ) {
						var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
						out.x = touch.pageX;
						out.y = touch.pageY;
					}else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
						out.x = e.pageX;
						out.y = e.pageY;
					}
					return out;
				},
				move = 0,
				timebox = timeboxparent.children().eq(0),
				parentHeight = timeboxparent[0].clientHeight,
				height = timebox[0].offsetHeight,
				scrollbar = $('<div class="xdsoft_scrollbar"></div>'),
				scroller = $('<div class="xdsoft_scroller"></div>'),
				maximumOffset = 100,
				start = false;

			scrollbar.append(scroller);

			timeboxparent.addClass('xdsoft_scroller_box').append(scrollbar);
			scroller.on('mousedown.xdsoft_scroller',function ( event ) {
				if( !parentHeight )
					timeboxparent.trigger('resize_scroll.xdsoft_scroller',[_percent]);
				var pageY = event.pageY,
					top = parseInt(scroller.css('margin-top')),
					h1 = scrollbar[0].offsetHeight;
				$(document.body).addClass('xdsoft_noselect');
				$([document.body,window]).on('mouseup.xdsoft_scroller',function arguments_callee() {
					$([document.body,window]).off('mouseup.xdsoft_scroller',arguments_callee)
						.off('mousemove.xdsoft_scroller',move)
						.removeClass('xdsoft_noselect');
				});
				$(document.body).on('mousemove.xdsoft_scroller',move = function(event) {
					var offset = event.pageY-pageY+top;
					if( offset<0 )
						offset = 0;
					if( offset+scroller[0].offsetHeight>h1 )
						offset = h1-scroller[0].offsetHeight;
					timeboxparent.trigger('scroll_element.xdsoft_scroller',[maximumOffset?offset/maximumOffset:0]);
				});
			});

			timeboxparent
				.off('scroll_element.xdsoft_scroller')
				.off('resize_scroll.xdsoft_scroller')
				.on('scroll_element.xdsoft_scroller',function( event,percent ) {
					if( !parentHeight )
						timeboxparent.trigger('resize_scroll.xdsoft_scroller',[percent,true]);
					percent = percent>1?1:(percent<0||isNaN(percent))?0:percent;
					scroller.css('margin-top',maximumOffset*percent);
					timebox.css('marginTop',-parseInt((height-parentHeight)*percent))
				})
				.on('resize_scroll.xdsoft_scroller',function( event,_percent,noTriggerScroll ) {
					parentHeight = timeboxparent[0].clientHeight;
					height = timebox[0].offsetHeight;
					var percent = parentHeight/height,
						sh = percent*scrollbar[0].offsetHeight;
					if( percent>1 )
						scroller.hide();
					else{
						scroller.show();
						scroller.css('height',parseInt(sh>10?sh:10));
						maximumOffset = scrollbar[0].offsetHeight-scroller[0].offsetHeight;
						if( noTriggerScroll!==true )
							timeboxparent.trigger('scroll_element.xdsoft_scroller',[_percent?_percent:Math.abs(parseInt(timebox.css('marginTop')))/(height-parentHeight)]);
					}
				});
		
				timeboxparent.off('mousewheel');
				timeboxparent.on('mousewheel', function(event) {
					var top = Math.abs(parseInt(timebox.css('marginTop')));
					timeboxparent.trigger('scroll_element.xdsoft_scroller',[(top-event.deltaY*20)/(height-parentHeight)]);
					event.stopPropagation();
					return false;
				});
				
	
			timeboxparent.off('touchstart');
			timeboxparent.on('touchstart',function( event ) {
				start = pointerEventToXY(event);
			});
			timeboxparent.off('touchmove');
			timeboxparent.on('touchmove',function( event ) {
				if( start ) {
					var coord = pointerEventToXY(event), top = Math.abs(parseInt(timebox.css('marginTop')));
					timeboxparent.trigger('scroll_element.xdsoft_scroller',[(top-(coord.y-start.y))/(height-parentHeight)]);
					event.stopPropagation();
					event.preventDefault();
					start = pointerEventToXY(event);
				}
			});
			timeboxparent.off('touchend touchcancel');
			timeboxparent.on('touchend touchcancel',function( event ) {
				start = false;
			});
		}
		timeboxparent.trigger('resize_scroll.xdsoft_scroller',[_percent]);
	});
};
