
/*********************************************************************************************************************
	JavaScript | canvas arrows v.1.0 | updated: 14.09.2013 (257) | author: michael verhov | http://michael.verhov.com | License: GNU GPL
**********************************************************************************************************************/

(function (window, undefined) {

    var $cArrows = function (commonParent, genrealOptions) {
		if (window === this) {
		    return new $cArrows(commonParent, genrealOptions);
		}

        // default options, lazy = false
		this.options = {
            canvasZIndex: -10,
		    alertErrors: true,
            putToContainer: true,
            renderOptions: {
                arrow: {
                    connectionType: 'rectangleAuto', // : point, centerOffset [center,angle,auto(autoAngle),side]
                    arrowType: 'arrow'               // : line(empty), arrow, bilateralArrow // fillArrow
                    // side, angle
                },
                render: {
                    lineWidth: 2,
                    strokeStyle: '#2D6CA2'
                    // another options e.g.: shadowColor: 'rgba(0, 0, 0, 0)', shadowBlur: 0, lineJoin: 'round',
                }
		    }
		};
		this.ParentsAndCanvases = [[], [], []]; // stack for: [0] - for common parents; [1] - for canvas; [2] - for drawn arrows [from, to, options]

        // get common parent nodes
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
		if (genrealOptions !== undefined) {
		    if (genrealOptions.render !== undefined)
		        extend(this.options.renderOptions.render, genrealOptions.render);
		    if (genrealOptions.arrow !== undefined)
		        extend(this.options.renderOptions.arrow, genrealOptions.arrow);
		}

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

		    // set identifier, if necessary
		    if (this.options['canvasId'] !== undefined) {    // && commonParentResult.length === 1
		        canvas.id = this.options['canvasId'];
		    }
		    if (this.options['canvasClass'] !== undefined) {
		        canvas.className = this.options['canvasClass'];
		    }

		    this.ParentsAndCanvases[0][iParent].insertBefore(canvas, this.ParentsAndCanvases[0][iParent].firstChild);
		    this.ParentsAndCanvases[1].push(canvas);
		}

		return this;
    };


    function extend(target, source) {
        if (target != null && source != null) { // n: lot of check
            for (name in source) {
                if (source[name] !== undefined) {
                    target[name] = source[name];
                }
            }
        }
        return target;
    }
    function getOffset(canvas, childrenEl) {
        var canv = canvas.getBoundingClientRect(),
            box = childrenEl.getBoundingClientRect();

            return {
                top: box.top - canv.top,
                left: box.left - canv.left,
                width: childrenEl.offsetWidth,
                height: childrenEl.offsetHeight
            };
    }
    function DegToRad(deg){
        return deg * (Math.PI / 180);
    }
    function RadToDeg(deg) {
        return deg * (180 / Math.PI);
    }
    function getSideCoord(coods, side) {
        var x = 0, y = 0;

        switch (side) {
            case 'top':
                x = coods.left + (coods.width / 2);
                y = coods.top;
                break;
            case 'right':
                x = coods.left + coods.width;
                y = coods.top + (coods.height / 2);
                break;
            case 'bottom':
                x = coods.left + (coods.width / 2);
                y = coods.top + coods.height;
                break;
            case 'left':
                x = coods.left;
                y = coods.top + (coods.height / 2);
                break;
            default:    // def: bottom
                x = coods.left + (coods.width / 2);
                y = coods.top + coods.height;
                break;
        }
        return { x: x, y: y }
    }
    function getCenterCoord(coods) {
        return {
            x: coods.left + coods.width / 2,
            y: coods.top + (coods.height / 2)
        }
    }
    function getAngleCoord(r, c, angle) {
        var x, y,
            rAngle = Math.acos(
                Math.sqrt(Math.pow(r.left + r.width - c.x, 2)) /
                Math.sqrt(Math.pow(r.left + r.width - c.x, 2) + Math.pow(r.top - c.y, 2))
                );

        if (angle >= 2 * Math.PI - rAngle || angle < rAngle) {
            x = r.left + r.width;
            y = c.y + Math.tan(angle) * (r.left + r.width - c.x);
        } else
            if (angle >= rAngle && angle < Math.PI- rAngle) {
                x = c.x - ((r.top - c.y) / Math.tan(angle));
                y = r.top + r.height;
            } else
                if (angle >= Math.PI - rAngle && angle < Math.PI + rAngle) {
                    x = r.left;
                    y = c.y - Math.tan(angle) * (r.left + r.width - c.x);
                }
                else
                    if (angle >= Math.PI + rAngle) {
                        x = c.x + ((r.top - c.y) / Math.tan(angle));
                        y = r.top;
                    }
        return {
            x: x,
            y: y
        };
    }
    function canvasDraw(context, fromx, fromy, tox, toy) {
        var headlen = 9;
        // dx = tox - fromx;
        // dy = toy - fromy;
        var angle = Math.atan2(toy - fromy, tox - fromx);
        context.beginPath();
        context.moveTo(fromx, fromy);
        context.lineTo(tox, toy);
        context.moveTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
        context.lineTo(tox, toy);
        context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
        context.stroke();
    }
    function drawArrow(canvas, div1, div2, gRenderOptions, cRenderOptions) {    //, color, lineWidth, shadowColor, shadowBlur , div1side, div2side
        var context = canvas.getContext('2d'),
            arrowOpt = gRenderOptions.arrow,
            dot1 = getOffset(canvas, div1),//
            dot2 = getOffset(canvas, div2);

        // extend here with custom
        extend(context, gRenderOptions.render);

        if (cRenderOptions !== undefined) {
            if (cRenderOptions.render !== undefined)
                extend(context, cRenderOptions.render);
            if (cRenderOptions.arrow !== undefined)
                extend(arrowOpt, cRenderOptions.arrow);
        }

        // circleAngle and circleAuto
        switch (arrowOpt.connectionType) {
            case 'center':
                dot1 = getCenterCoord(dot1);
                dot2 = getCenterCoord(dot2);
                break;
            case 'rectangleAngle':
                dot1 = getAngleCoord(dot1, arrowOpt.angleFrom);
                dot2 = getAngleCoord(dot2, DegToRad(arrowOpt.angleTo));
                break;
            case 'rectangleAuto':
                var c1 = getCenterCoord(dot1),
                    c2 = getCenterCoord(dot2);
                dot1 = getAngleCoord(dot1, c1, Math.atan2(c1.y - c2.y, c1.x - c2.x) + Math.PI);
                dot2 = getAngleCoord(dot2, c2, Math.atan2(c2.y - c1.y, c2.x - c1.x) + Math.PI);
                break;
            case 'side':
                dot1 = getSideCoord(dot1, arrowOpt.sideFrom);
                dot2 = getSideCoord(dot2, arrowOpt.sideTo);
                break;
            default: break;   // auto
        }

        canvasDraw(context, dot1.x, dot1.y, dot2.x, dot2.y);    // - сюда передать тип стрелки
    }


    $cArrows.fn = $cArrows.prototype = {
        trowException: function (ex) {
            if (this.options.alertErrors === true)
                alert('CanvasArrows error: ' + ex);
            throw new Error(ex);
        },
        arrow: function (from, to, cRenderOptions) {
            for (iParent in this.ParentsAndCanvases[0]) {
                var fromChildrens = this.ParentsAndCanvases[0][iParent].querySelectorAll(from);
                var toChildrens = this.ParentsAndCanvases[0][iParent].querySelectorAll(to);
                for (var fi = 0; fi < fromChildrens.length; fi++) {
                    for (var ti = 0; ti < toChildrens.length; ti++) {
                        drawArrow(this.ParentsAndCanvases[1][iParent], fromChildrens[fi], toChildrens[ti], this.options.renderOptions, cRenderOptions);
                    }
                    if (this.options.putToContainer === true)
                        this.ParentsAndCanvases[2].push([from, to, cRenderOptions]);
                }
            }
            return this;
        },
        arrows: function (arrowsArr) {
            for (var i = 0; i < arrowsArr.length; i++) {
                this.arrow(arrowsArr[i][0], arrowsArr[i][1], arrowsArr[i][2]);
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
                this.arrow(this.ParentsAndCanvases[2][iArrow][0], this.ParentsAndCanvases[2][iArrow][1], this.ParentsAndCanvases[2][iArrow][2]);
            }
            this.options.putToContainer = putToContainer;
            return this;
        },
        redraw: function () {
            return this.clear().draw();
        },
        updateOptions: function (options) {
            if (options.render !== undefined)
                extend(this.options.renderOptions.render, options.render);
            if (options.arrow !== undefined)
                extend(this.options.renderOptions.arrow, options.arrow);
            return this;
        }
	};

	window.$cArrows = $cArrows;
})(window);