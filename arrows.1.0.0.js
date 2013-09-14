
/*********************************************************************************************************************
	JavaScript | canvas arrows v.1.0 | updated: 14.09.2013 (257) | author: michael verhov | http://michael.verhov.com | License: GNU GPL
**********************************************************************************************************************/

(function (window, undefined) {

    // initialization
    var $cArrows = function (commonParent, genrealOptions) {
		if (window === this) {
		    return new $cArrows(commonParent, genrealOptions);
		}

        // default options, lazy = false
		this.options = {
            canvasZIndex: -10,
		    alertErrors: true,
		    draw: [],
            putToContainer: true,
		    renderOptions: {    //some options: shadowColor: 'rgba(0, 0, 0, 0)', shadowBlur: 0
		        lineWidth: 2,
		        lineJoin: 'round',
		        strokeStyle: '#000000'
		    },
		    drawOptions: {
                drawPositionFrom: ''
		    }
		};
		this.ParentsAndCanvases = [[], [], []]; // - [0] - for common parents; [1] - for canvas; [2] - for drawn arrows [from, to, options]

        // get parent nodes
		if (typeof commonParent === 'string') {
		    var commonParentResult = document.querySelectorAll(commonParent);
		}
		else
		    this.trowException('common parent must be specified');

		if (commonParentResult.length > 0) {
		    for (var i = 0; i < commonParentResult.length; i++) {
		        this.ParentsAndCanvases[0][i] = commonParentResult[i];
		    }
		    this.ParentsAndCanvases[0].length = commonParentResult.length;
		}
		else
		    this.trowException('common parent not found');

        // extend options
		if (genrealOptions != undefined && genrealOptions != null)
		    extend(this.options, genrealOptions);

        // set up canvas for each node
		for (iParent in this.ParentsAndCanvases[0]) {
		    this.ParentsAndCanvases[0][iParent].style.position = 'relative';
		    var canvas = document.createElement('canvas');
		    canvas.innerHTML = "";
		    canvas.style.position = 'absolute';
		    canvas.style.left = '0px';
		    canvas.style.top = '0px';
		    canvas.style.zIndex = this.options.canvasZIndex;
		    canvas.width = this.ParentsAndCanvases[0][iParent].scrollWidth;
		    canvas.height = this.ParentsAndCanvases[0][iParent].scrollHeight;

		    this.ParentsAndCanvases[0][iParent].insertBefore(canvas, this.ParentsAndCanvases[0][iParent].firstChild);
		    this.ParentsAndCanvases[1].push(canvas);
		}
        // draw if necessary
		if (this.options.draw.length > 0) {
		}
		return this;
    };


    // private functions
    function extend(target, source) {
        if (target != null && source != null) {
            for (name in source) {
                if (source[name] !== undefined) {
                    target[name] = source[name];
                }
            }
        }
        return target;
    };
    function calccoord(canvas, div, side) {
        var x = 0; var y = 0;
        switch (side) {
            case 1:
                x = div.offsetLeft - canvas.offsetLeft;
                y = div.offsetTop - canvas.offsetTop + (div.offsetHeight / 2);
                break;
            case 2:
                x = div.offsetLeft - canvas.offsetLeft + (div.offsetWidth / 2);
                y = div.offsetTop - canvas.offsetTop;
                break;
            case 3:
                x = div.offsetLeft - canvas.offsetLeft + div.offsetWidth;
                y = div.offsetTop - canvas.offsetTop + (div.offsetHeight / 2);
                break;
            case 4:
                x = div.offsetLeft - canvas.offsetLeft + (div.offsetWidth / 2);
                y = div.offsetTop - canvas.offsetTop + div.offsetHeight;
                break;
            default:    //4
                x = div.offsetLeft - canvas.offsetLeft + (div.offsetWidth / 2);
                y = div.offsetTop - canvas.offsetTop + div.offsetHeight;
                break;
        }
        return { 'x': x, 'y': y }
    }
    function draw_arrow(context, fromx, fromy, tox, toy) {
        var headlen = 9;
        var dx = tox - fromx;
        var dy = toy - fromy;
        var angle = Math.atan2(dy, dx);
        context.beginPath();
        context.moveTo(fromx, fromy);
        context.lineTo(tox, toy);
        context.moveTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
        context.lineTo(tox, toy);
        context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
        context.stroke();
    }
    function arrow(canvas, div1, div2, gRenderOptions, cRenderOptions) {    //, color, lineWidth, shadowColor, shadowBlur , div1side, div2side
        var context = canvas.getContext('2d');
        if (gRenderOptions != undefined)
            extend(context, gRenderOptions);
        
        if (cRenderOptions != undefined)
            extend(context, cRenderOptions);

        var dot1 = calccoord(canvas, div1, 4);
        var dot2 = calccoord(canvas, div2, 2);
        draw_arrow(context, dot1.x, dot1.y, dot2.x, dot2.y);
    }


    // global methods
    $cArrows.fn = $cArrows.prototype = {
        trowException: function (ex) {
            if (this.options.alertErrors === true)
                alert('CanvasArrows error: ' + ex);
            throw new Error(ex);
        },
        drawArrow: function (from, to, customRenderOptions) {
            for (iParent in this.ParentsAndCanvases[0]) {
                var fromChildrens = this.ParentsAndCanvases[0][iParent].querySelectorAll(from);
                var toChildrens = this.ParentsAndCanvases[0][iParent].querySelectorAll(to);
                for (var fi = 0; fi < fromChildrens.length; fi++) {
                    for (var ti = 0; ti < toChildrens.length; ti++) {
                        arrow(this.ParentsAndCanvases[1][iParent], fromChildrens[fi], toChildrens[ti], this.options.renderOptions, customRenderOptions);
                    }
                    if (this.options.putToContainer === true)
                        this.ParentsAndCanvases[2].push([from, to, customRenderOptions]);
                }
            }
            return this;
        },
        drawArrows: function (arrowsArr) {
            for (var i = 0; i < arrowsArr.length; i++) {
                this.drawArrow(arrowsArr[i][0], arrowsArr[i][1], arrowsArr[i][2]);
            }
            return this;
        },
        clear: function () {
            for (iCanvas in this.ParentsAndCanvases[1]) {
                var canvas = this.ParentsAndCanvases[1][iCanvas];
                var context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
            return this;
        },
        draw: function () {
            var putToContainer = this.options.putToContainer;
            this.options.putToContainer = false;
            for (iArrow in this.ParentsAndCanvases[2]) {
                this.drawArrow(this.ParentsAndCanvases[2][iArrow][0], this.ParentsAndCanvases[2][iArrow][1], this.ParentsAndCanvases[2][iArrow][2]);
            }
            this.options.putToContainer = putToContainer;
            return this;
        },
        redraw: function () {
            this.clear().draw();
            return this;
        },
        updateOptions: function (options) {
            extend(this.options, options);
            return this;
        }
	};

	window.$cArrows = $cArrows;
})(window);