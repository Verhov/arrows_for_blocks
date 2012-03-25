# HTML5 canvas arrows for blocks (javaScript) (beta)

It is small javaScript library for connecting static div blocks(without animation) an arrows on Your web page.

<img src="https://github.com/Verhov/arrows_for_blocks/blob/master/screenshot.png?raw=true" />

<a href="http://michael.verhov.com/Project/canvas_arrows_for_div">Examples and demo here.</a>


## How to use:

Step1: (Add lib.)

        <script src='../arrows.js' type='text/javascript'></script>

Step2: (Initialize(once) and draw arrows)

        <script type='text/javascript'>
          	arrow_initialize('parent_div', 'my_new_canvas');
          	arrow('my_new_canvas', 'div1', 4, 'div2', 2, 'black', 2, 'red', 4);
        </script>


### Parametrs:

arrow_initialize( divid, newid);

* divid: div block, for canvas initialize;
* newid: new created canvas id;

arrow(canvas, div1, div1side, div2, div2side, color, lineWidth, shadowColor, shadowBlur);

* canvas: canvas id for draw arrow;
* div1: new created canvas id;
* div1side: arrow start-end position: 1-left, 2-top, 3-right, 4-bottom;
* color: arrow color in css format;
* lineWidth: line width in pixels;
* shadowColor: shadow color;
* shadowBlur: shadow blur;


### Bug's:

canvas overlaps text block in some browsers (change "by hand" at the moment);