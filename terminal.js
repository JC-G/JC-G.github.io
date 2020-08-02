var WIDTH=0;
var HEIGHT=0;
var SCREEN = null;

const BLOCK = "&#9608;" //█
const SHADES = ["&#9617;","&#9618;","&#9619;"]; //░▒▓

var SCREEN_OBJECTS = {};

class Renderable {
    static #counter = 0;
    constructor() {
        this.render = true;

        this.UID = Renderable.#counter;
        Renderable.#counter++;
        SCREEN_OBJECTS[this.UID] = this;

    }

    draw () {
        console.log("Unimplemented Draw!");
    }
}

class Rectangle extends Renderable {
    constructor(w,h,x,y) {
        super();
        this.width = w;
        this.height = h;
        this.x=x;
        this.y=y;
    }
    draw() {
        for (var dx = this.x; dx < this.x+this.width;dx++) {
            for (var dy = this.y; dy < this.y+this.height;dy++) {
                setPixel(dx,dy,SHADES[0]);
            }
        }
    }
}

class Circle extends Renderable {
    constructor (x,y,r) {
        super();
        this.x = x;
        this.y = y;
        this.radius = r;
    }
    draw () {
        for (var dx = this.x - this.radius; dx <= this.x + this.radius; dx+=1) {
            for (var dy = this.y-this.radius; dy <= this.y + this.radius; dy+=1) {
                var d2 = (dy-this.y)*(dy-this.y) + (dx-this.x)*(dx-this.x);
                var dist = Math.sqrt(d2) - this.radius
                if (Math.abs(dist) < 0.5) {
                    setPixel(dx,dy,BLOCK,"0F0");
                } else if (dist < 0) {
                    setPixel(dx,dy,SHADES[1],"F00");
                }
            }
        }
    }
}

function setPixel(x,y,ch,col) {
    if (col == "") {
        SCREEN[y][x]=ch;
    } else {
        SCREEN[y][x] = "<span style='color:#" + col + "'>" + ch + "</span>";
    }
}

function setWindowSize() {
    var clone = $("#terminal").clone();
    clone.attr("id","sizeTest");
    clone.removeClass("fullscreen");
    $(document.documentElement).append(clone);
    clone.text("C");
    WIDTH = Math.floor($(window).width() / clone.width());
    HEIGHT = Math.floor($(window).height() / clone.height());
    SCREEN = Array(HEIGHT).fill(0).map(x => Array(WIDTH).fill(" "));
    clone.remove();
}

function renderScreen() {
    var screenText = "";
    // SCREEN_OBJECTS.forEach(function(o) {if (o.render) {o.draw()}});
    for (const [k,v] of Object.entries(SCREEN_OBJECTS)) {
        if (v.render) {
            v.draw();
        }
    }
    SCREEN.forEach(function(r) {
        r.forEach(function(c) {
            screenText += c;
        });
        screenText += BLOCK +"\n";
    });
    SCREEN[0].forEach(function(){screenText += BLOCK;});
    screenText += BLOCK;
    $('#terminal').html(screenText);

}


$(document).ready( function() {
    r = new Rectangle(10,3,10,3);
    r.render = false;
    r.width = 20;
    new Circle(25,25,20);
    new Circle(30,30,15);
    new Circle (20,20,5);
    $(window).resize( function () {
        setWindowSize();
        renderScreen();
    });
    setWindowSize();
    renderScreen();
    
});


