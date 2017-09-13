;(function ($){
    var prefixer = (function(){
        var prefixer = {},
        oStyle = document.head.style,
        aEvents = {
            'transform': {
                'transform': 'transform',
                'webkitTransform': 'webkitTransform',
                'MozTransform': 'MozTransform',
                'msTransform': 'msTransform',
                'OTransform': 'OTransform'
            },
            'transition': {
                'transition': 'transition',
                'webkitTransition': 'webkitTransition',
                'MozTransition': 'MozTransition',
                'msTransition': 'msTransition',
            }
        },
        fGetEvent = function(sEventName) {
            sEventName = (sEventName || '').toLowerCase();
            if (!aEvents[sEventName]) {
                throw new Error('prefix: unkown event name ' + sEventName);
            }
            for (var p in aEvents[sEventName]) {
                if (typeof(oStyle[p]) !== undefined) {
                    return aEvents[sEventName][p];
                }
            }
            return '';
        };
    
        prefixer.transform = function(){
            return fGetEvent('transform');
        } 
        prefixer.transition = function(){
            return fGetEvent('transition');
        }
        
        return prefixer;
    })();

    var methods = {
        init:function(options){
            var opts = $.extend({},$.fn.marquee.defaults, options),
                jsTransform = prefixer.transform(),
                jsTransiton = prefixer.transition();
            return this.each(function(){
                var $con = $(this);
                var $scrollObj = $con.children(':first-child'),
                    scrollObj = $scrollObj[0],
                    scrollW = $scrollObj.width(),
                    scrollH = $scrollObj.height(),
                    $children = $scrollObj.children(),
                    len = $children.length,
                    itemHeight = scrollH / len,
                    itemWidth = $children.outerWidth();
                var dir = jsTransform;
                if(!dir){
                    dir = (opts.direction == 'left'||opts.direction == 'right') ? 'marginLeft' : 'marginTop';
                }
                var step = opts.step;
                switch (opts.direction) {
                    case 'left':
                        if(step == 1 && $con.width() > len * itemWidth){
                            return;
                        }
                        if(dir == jsTransform){
                            scrollObj.style[jsTransform] = 'translate(0,0)';
                            $scrollObj.css({width:2*len*itemWidth});                            
                        }
                        else{
                            $scrollObj.css({dir:0,width:2*len*itemWidth});
                        }
                        $con.css({width:len*itemWidth});
                        step = -(step || itemWidth);
                        break;
                    case 'right':
                        if(step == 1 && $con.width() > len * itemWidth){
                            return;
                        }
                        if(dir == jsTransform){
                            scrollObj.style[dir] = 'translate(' + (-len*itemWidth) + 'px,0)';
                            $scrollObj.css({width:2*len*itemWidth});
                        }
                        else{
                            $scrollObj.css({dir:-len*itemWidth,width:2*len*itemWidth});
                        }
                        $con.css({width:len*itemWidth});
                        step = step || itemWidth;                            
                        break;
                    case 'up':
                        if(step == 1 && $con.height() > scrollH){
                            return;
                        }
                        if(dir == jsTransform){
                            scrollObj.style[dir] = 'translate(0,0)';
                            $scrollObj.css({height:2*scrollH}); 
                        }
                        else{
                            $scrollObj.css({dir:0,height:2*scrollH}); 
                        }
                        $con.css({height:scrollH});
                        step = -(step || itemHeight);                               
                        break;
                    case 'down':
                        if(step == 1 && $con.height() > scrollH){
                            return;
                        }
                        if(dir == jsTransform){
                            scrollObj.style[dir] = 'translate(0,' + (-scrollH) + 'px)';
                            $scrollObj.css({height:2*scrollH});
                        }
                        else{
                            $scrollObj.css({dir:-scrollH,height:2*scrollH});
                        }
                        $con.css({height:scrollH}); 
                        step = step || itemHeight;                               
                        break;
                    default:
                        throw new Error('not support direction');
                }
                $children.clone().prependTo($scrollObj);                
                //先移除先前的timer，再开启新的timer
                $.fn.marquee.removeScroll($scrollObj);
                var counter = 0;
                var timerId = setInterval(function(){
                    if($scrollObj.data('pause')){
                        return;
                    }
                    counter++;
                    if(opts.loop >0 && counter >= opts.loop){
                        clearInterval(timerId);
                    }
                    fScrollObj($scrollObj,step,itemWidth,scrollH,dir,len);
                },opts.interval);
                $scrollObj.attr('data-timerid',timerId)
                if(opts.hoverPause){
                    $scrollObj.mouseover(function(){
                            $(this).data("pause", true);
                        }).mouseout(function(){
                            $(this).data("pause", false);
                        });
                }
            });
    
            function fScrollObj($scrollObj,step,itemWidth,scrollH,dir,len){
                var bTransform = /transform/.test(dir),
                    scrollObj = $scrollObj[0],
                    transform = scrollObj.style[dir],
                    offset = 0;
                if(bTransform){
                    switch(opts.direction){
                        case 'left':
                            offset = fGetTranslate(transform,'x');
                            if(offset <= -len*itemWidth){
                                scrollObj.style[jsTransiton] = '';
                                scrollObj.style[dir] = 'translate(0,0)';
                                offset = 0;
                            }
                            else{
                                offset += step;
                                fScrollTransform(scrollObj,dir,offset,'x');
                            }
                            break;
                        case 'right':
                            offset = fGetTranslate(transform,'x');
                            if(offset >= 0){
                                scrollObj.style[jsTransiton] = '';
                                scrollObj.style[dir] = 'translate(' + -len*itemWidth + 'px,0)';
                                offset = -len*itemWidth;
                            }
                            else{
                                offset += step;
                                fScrollTransform(scrollObj,dir,offset,'x');
                            }
                            break;
                        case 'up':
                            offset = fGetTranslate(transform,'y');
                            if(offset <= -scrollH){
                                scrollObj.style[jsTransiton] = '';
                                scrollObj.style[dir] = 'translate(0,0)';
                                offset = 0;
                            }
                            else{
                                offset += step;
                                fScrollTransform(scrollObj,dir,offset,'y');
                            }
                            break;
                        case 'down':
                            offset = fGetTranslate(transform,'y');
                            if(offset >= 0){
                                scrollObj.style[jsTransiton] = '';
                                scrollObj.style[dir] = 'translate(0,' + -scrollH + 'px)';
                                offset = -scrollH;
                            }
                            else{
                                offset += step;
                                fScrollTransform(scrollObj,dir,offset,'y');
                            }
                            break;
                        default:
                            throw new Error('not support direction');
                    }
                }
                else{
                    var aniObj = {};
                    aniObj[dir] = '+=' + step;
                    $scrollObj.animate(aniObj,opts.spent,function(){
                        switch(opts.direction){
                            case 'left':
                                if(parseInt($scrollObj.css('marginLeft')) <= -len*itemWidth){
                                    $scrollObj.css({marginLeft:0})
                                }
                                break;
                            case 'right':
                                if(parseInt($scrollObj.css('marginLeft')) >= 0){
                                    $scrollObj.css({marginLeft: -len*itemWidth})
                                }
                                break;
                            case 'up':
                                if(parseInt($scrollObj.css('marginTop')) <= -scrollH){
                                    $scrollObj.css({marginTop:0})
                                }
                                break;
                            case 'down':
                                if(parseInt($scrollObj.css('marginTop')) >= 0){
                                    $scrollObj.css({marginTop:-scrollH})
                                }
                                break;
                            default:
                                throw new Error('not support direction');
                        }
                    })
                }
            }

            function fScrollTransform(scrollObj,dir,offset,type){
                scrollObj.style[jsTransiton] = 'all ' + opts.spent/1000 + 's';
                if(type == 'x'){
                    scrollObj.style[dir] = 'translate(' + offset + 'px,0)';
                }
                else{
                    scrollObj.style[dir] = 'translate(0,' + offset + 'px)';
                }
            }

            function fGetTranslate(transform,type){
                var aTrans = transform.slice(10,-1).split(',');
                aTrans = aTrans.map(function(item){
                    return parseInt(item);
                });
                switch(type){
                    case 'x':
                        return aTrans.length > 0 ? aTrans[0] : '';
                    case 'y':
                        return aTrans.length > 1 ? aTrans[1] : '';
                    case 'z':
                        return aTrans.length > 2 ? aTrans[2] : '';
                    default:
                        break;
                }
                return aTrans;
            }
        },
        pause:function(){
            $(this).children(':first-child').data('pause',true);
        },
        play:function(){
            $(this).children(':first-child').data('pause',false);
        }
    }

    $.fn.marquee = function (method){
        if(methods[method]){
            return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
        }else if(typeof method === 'object' || !method){
            return methods.init.apply(this,arguments);
        }else{
            $.error('no ' + method + ' method jquery.marquee support');
        }
    };

    $.fn.marquee.defaults = {
        direction:'left',
        step:'',
        interval:3000,
        spent: 500,
        loop:0,
        hoverPause:true
    }

    $.fn.marquee.removeScroll = function(scrollSelector){
        $(scrollSelector).each(function(i,item){
            clearInterval($(item).attr('data-timerid'));
        });
    }
})(jQuery);


