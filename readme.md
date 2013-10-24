# HTML5 canvas arrows for blocks (javaScript)

It is small javaScript library for connecting static div blocks an arrows on web page.

<img src="https://github.com/Verhov/arrows_for_blocks/blob/master/screenshot.png?raw=true" />

~~<a href="http://michael.verhov.com/Project/canvas_arrows_for_div">Examples and demo here.</a>~~


## How to use:

Step1: (Add lib.)

        <script src='../arrows.1.0.0.js' type='text/javascript'></script>

Step2: (Initialize(once) and draw arrows)

        <script type='text/javascript'>
              var cArrow = $cArrows('#commonParent').arrow('#fromDiv', '.toDiv').arrow('.fromDiv2', '#toDiv2');
        </script>

### Methods:

* arrow(from, to, options)	- from(string), to(string), options(object - optional)
* arrows(arrowsArray)		- arrowsArray(array[])
* clear()
* draw()
* redraw()
* updateOptions(newOptions)

### Advanced Settings:

        <script type='text/javascript'>
              var cArrow2 = $cArrows('#commonParent', { render: { strokeStyle: '#EC971F', lineWidth: 3 } }) // options for all arrows
              .arrow('#fromDiv', '.toDiv')
              .arrow('.fromDiv2', '#toDiv2', { render: { strokeStyle: '#2D6CA2' } }); //options for one arrow
              
              cArrow2.arrow('.block3', '.block2', { arrow: { connectionType: 'ellipseAngle', arrowSize: 4 } }); // drawing more other arrows
        </script>

### License: GNU GPL