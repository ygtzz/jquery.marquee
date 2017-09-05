;(function ($){
    var methods = {
        init:function(options){
            var opts = $.extend({},$.fn.marquee.defaults, options);
            return this.each(function(){
                var $con = $(this);
                var $scrollObj = $con.children(':first-child'),
                    scrollW = $scrollObj.width(),
                    scrollH = $scrollObj.height(),
                    $children = $scrollObj.children(),
                    len = $children.length,
                    itemHeight = scrollH / len,
                    itemWidth = $children.outerWidth();
    
                var dir = (opts.direction == 'left'||opts.direction == 'right') ? 'marginLeft' : 'marginTop';
                var step = opts.step;
                switch (opts.direction) {
                    case 'left':
                        if(step == 1 && $con.width() > len * itemWidth){
                            return;
                        }
                        $scrollObj.css({marginLeft:0,width:2*len*itemWidth});
                        $con.css({width:len*itemWidth});
                        step = -(step || itemWidth);
                        break;
                    case 'right':
                        if(step == 1 && $con.width() > len * itemWidth){
                            return;
                        }
                        $scrollObj.css({marginLeft:-len*itemWidth,width:2*len*itemWidth});
                        $con.css({width:len*itemWidth});
                        step = step || itemWidth;                            
                        break;
                    case 'up':
                        if(step == 1 && $con.height() > scrollH){
                            return;
                        }
                        $scrollObj.css({marginTop:0,height:2*scrollH}); 
                        $con.css({height:scrollH});
                        step = -(step || itemHeight);                               
                        break;
                    case 'down':
                        if(step == 1 && $con.height() > scrollH){
                            return;
                        }
                        $scrollObj.css({marginTop:-scrollH,height:2*scrollH});
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


