//initialize arrow canvas and options
function arrow_initialize(divid, newid) {
    var par = document.getElementById(divid);
    var canvas = document.createElement('canvas');
    canvas.innerHTML = "";
    canvas.id = newid;
    canvas.style.position = 'absolute';
    canvas.width = par.scrollWidth;
    canvas.height = par.scrollHeight;
    par.insertBefore(canvas, par.firstChild);
};
//draw arrow
function arrow(canvas, div1, div1side, div2, div2side, color, lineWidth, shadowColor, shadowBlur) {
    var canvas = document.getElementById(canvas);
    var context = canvas.getContext('2d');
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.shadowColor = shadowColor;
    context.shadowBlur = shadowBlur;
    context.lineJoin = "round";
    var dot1 = calccoord(canvas, document.getElementById(div1), div1side);
    var dot2 = calccoord(canvas, document.getElementById(div2), div2side);
    draw_arrow(context, dot1.x, dot1.y, dot2.x, dot2.y);
}
//calculate local canvas coordinates
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
//drawing arrow
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