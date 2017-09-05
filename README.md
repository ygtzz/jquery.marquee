# jquery.marquee

## Quickstart

```html
<style>
    .scrolllWrapr{overflow:hidden;}
    .scrollHorizontal{width:100px}
</style>
<script src="jquery.js"></script>
<script src="jquery.marquee.js"></script>
<script>
    $('#scrollWrapper').marquee({
        direction:'down',
        step:22,
        interval:3000,
        loop:5
    });
    //pause the scroller
    $('#scrollWrapper').marquee('pause');
    //replay the paused scroller
    $('#scrollWrapper').marquee('play');
</script>
```

## Params

- `direction` left,right,up,down, default is left.
- `step`      the scroll step every time, when step=1, it will scroll continuous, when step=1 and the container width or height greater than element's show space, it will not scroll
- `interval`  the scroll interval
- `spent`     the time spent every scroll, default is 500ms
- `loop`      the scroll times, 0 is infinite, default is infinite
- `hoverPause` whether stop scroll when mouse hover, default is true


## License

MIT