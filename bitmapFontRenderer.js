function bitmapFontRenderer(o) {
    'use strict';

    //var styleEl = document.head.querySelector('style');
    //styleEl.firstChild.nodeValue = styleEl.firstChild.nodeValue
    document.styleSheets[0].insertRule(
        "@font-face { font-family: '" + o.font + "'; src: url('" + o.font + "." + o.ext + "') format('" + o.ext + "'); }"
    , 0);

    var el = document.createElement('canvas');

    el.mozImageSmoothingEnabled = false;
	el.webkitImageSmoothingEnabled = false;
	el.imageSmoothingEnabled = false;

    el.setAttribute('width', o.size * o.characters.length);
    el.setAttribute('height', o.size + o.gap*2);
    document.body.appendChild(el);

    var c = el.getContext('2d');
    c.font = o.size + 'px ' + o.font;
    c.textBaseline = 'top';

    var x = 0;
    var dx = o.splitW;
    var gap = o.gap;
    var y = gap;

    c.fillStyle = o.splitColor;
    c.fillRect(x, y, dx, o.size);
    x += dx;

    o.characters.split('').forEach(function(ch) {
        x += gap;

        c.fillStyle = o.color;

        if (o.draw) {
            o.draw(c, ch, x, y, o);
        }
        else {
            c.fillText(ch, x, y);
        }

        var w = c.measureText(ch).width;

        x += gap;

        c.fillStyle = o.splitColor;
        c.fillRect(x+w, y, dx, o.size);

        x += w + dx;
    });

    // trim
    var el2 = document.createElement('canvas');
    el2.setAttribute('width', x);
    el2.setAttribute('height', o.size + o.gap*2);
    var c2 = el2.getContext('2d');
    c2.drawImage(el, 0, 0);
    document.body.removeChild(el);
    document.body.appendChild(el2);
}
