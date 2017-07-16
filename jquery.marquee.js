;(function ($){
    $.fn.marquee = function (options){
        var opts = $.extend({},$.fn.marquee.defaults, options);
        return this.each(function(){
            var $com = $(this);
            var $scrollObj = $com.children(':first-child');
                scrollW = $scrollObj.width(),
                scrollH = $scrollObj.height(),
                $children = $scrollObj.children(),
                len = $children.length,
                itemHeight = scrollH / len,
                itemWidth = $children.outerWidth();

            $children.clone().prependTo($scrollObj);
            var dir = (opts.direction == 'left'||opts.direction == 'right') ? 'marginLeft' : 'marginTop';
            var step = opts.step;
            switch (opts.direction) {
                case 'left':
                    $scrollObj.css({marginLeft:0,width:2*len*itemWidth});
                    $com.css({width:len*itemWidth});
                    step = -(step || itemWidth);
                    break;
                case 'right':
                    $scrollObj.css({marginLeft:-len*itemWidth,width:2*len*itemWidth});
                    $com.css({width:len*itemWidth});
                    step = step || itemWidth;                            
                    break;
                case 'up':
                    $scrollObj.css({marginTop:0,height:2*scrollH}); 
                    $com.css({height:scrollH});
                    step = -(step || itemHeight);                               
                    break;
                case 'down':
                    $scrollObj.css({marginTop:-scrollH,height:2*scrollH});
                    $com.css({height:scrollH}); 
                    step = step || itemHeight;                               
                    break;
                default:
                    throw new Error('not support direction');
            }
            var counter = 0;
            var timerId = setInterval(function(){
                counter++;
                if(opts.loop >0 && counter >= opts.loop){
                    clearInterval(timerId);
                }
                fScrollObj($scrollObj,step,dir,len);
            },opts.interval);
            $com.data('timerid',timerId);
        });

        function fScrollObj($scrollObj,step,dir,len){
            var aniObj = {};
            aniObj[dir] = '+=' + step;
            $scrollObj.animate(aniObj,500,function(){
                switch(opts.direction){
                    case 'left':
                        if(parseInt($scrollObj.css('marginLeft')) <= len*step){
                            $scrollObj.css({marginLeft:0})
                        }
                        break;
                    case 'right':
                        if(parseInt($scrollObj.css('marginLeft')) >= 0){
                            $scrollObj.css({marginLeft:-len*step})
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
    };

    $.fn.marquee.defaults = {
        "direction":'left',
        "step":'',
        "interval":3000,
        "loop":0
    }

    $.fn.marquee.removeScroll = function(comSelector){
        $(comSelector).each(function(i,item){
            clearInterval($(item).data('timerid'));
        });
    }
})(jQuery);


