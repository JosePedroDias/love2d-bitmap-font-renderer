function round(n, mult) {
    return Math.ceil(n / mult) * mult;
}

function bitmapFontRenderer(o) {
    'use strict';

    var rule = [
        "@font-face {\n",
            "font-family: '", o.font, "';\n",
            "src: url('", o.font, ".", o.ext, "') format('", o.ext, "');\n",
        "}"
    ].join('');

    var styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
    var styleSheet = styleEl.sheet;
    styleSheet.insertRule(rule, 0);

    // VERY HACKY STUFF SO CHROME PLAYS NICE
    var testerDiv = document.createElement('div');
    testerDiv.appendChild( document.createTextNode( o.characters ) );
    testerDiv.style.fontFamily = o.font;
    document.body.appendChild(testerDiv);

    var img = new Image();
    img.src = o.font + '.' + o.ext;
    img.onerror = function() {
        setTimeout(function() {
            testerDiv.parentNode.removeChild(testerDiv);
            letsGo();
        }, 500);
    }

    function letsGo() {
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
        var chars = o.characters.split('');


        // font rendering pass
        if (o.color) {
            x += dx;

            chars.forEach(function(ch) {
                x += gap;

                c.fillStyle = o.color;

                if (o.draw) {
                    o.draw(c, ch, x, y, o);
                }
                else {
                    c.fillText(ch, x, y);
                }

                var w = c.measureText(ch).width;

                x += gap + w + dx;
            });
        }


        // split overlay pass
        if (o.splitColor) {
            x = 0;

            c.fillStyle = o.splitColor;
            c.fillRect(x, y-gap, dx, o.size+gap*2);
            x += dx;

            chars.forEach(function(ch) {
                x += gap;

                var w = c.measureText(ch).width;

                x += gap;

                c.fillStyle = o.splitColor;
                c.fillRect(x+w, y-gap, dx, o.size+gap*2);

                x += w + dx;
            });
        }


        // trim
        var el2 = document.createElement('canvas');

        var W = x;
        var H = o.size + o.gap*2;
        if (o.roundTo) {
            W = round(W, o.roundTo);
            H = round(H, o.roundTo);
        }

        el2.setAttribute('width', W);
        el2.setAttribute('height', H);
        var c2 = el2.getContext('2d');
        c2.drawImage(el, 0, 0);
        document.body.removeChild(el);
        document.body.appendChild(el2);
    }
}
