# jquery.marquee

## Usage

### Quickstart

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
</script>
```

### params

- direction left,right,up,down default is left.
- step      the scroll step every time
- interval  the scroll interval
- loop      the scroll times, 0 is infinite