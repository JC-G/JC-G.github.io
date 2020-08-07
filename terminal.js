var WIDTH=0;
var HEIGHT=0;
var SCREEN = null;
var DEPTH_BUFFER = null;
var COLOR_BUFFER = null;

const BLOCK = "&#9608;" //█
const SHADES = ["&#9617;","&#9618;","&#9619;"]; //░▒▓

const DEFAULT_COLOR = "0F0";
var SCREEN_OBJECTS = {};

var c = null;
var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
class Renderable {
    static #counter = 0;
    constructor(x,y,z) {
        this.render = true;
        this.x=x;
        this.y=y;
        this.z=z;
        this.UID = Renderable.#counter;
        Renderable.#counter++;
        SCREEN_OBJECTS[this.UID] = this;

    }

    draw () {
        console.log("Unimplemented Draw!");
    }
}

class Rectangle extends Renderable {
    constructor(x,y,z,w,h) {
        super(x,y,z);
        this.width = w;
        this.height = h;
        this.x=x;
        this.y=y;
    }
    draw() {
        for (var dx = this.x; dx < this.x+this.width;dx++) {
            for (var dy = this.y; dy < this.y+this.height;dy++) {
                setPixel(dx,dy,this.z,SHADES[0]);
            }
        }
    }
}

class Circle extends Renderable {
    constructor (x,y,z,r) {
        super(x,y,z);
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
                    setPixel(dx,dy,this.z,BLOCK,"0F0");
                } else if (dist < 0) {
                    setPixel(dx,dy,this.z,BLOCK,"EFA");
                }
            }
        }
    }
}

class RandomChar extends Renderable {
    constructor(x,y,z) {
        super(x,y,z);
    }
    draw () {
        setPixel(this.x,this.y,this.z,characters.charAt(Math.floor(Math.random() * characters.length)),"F0F");
    }
}
function resetBuffers() {
    
    SCREEN = Array(HEIGHT).fill(0).map(_ => Array(WIDTH).fill(" "));
    DEPTH_BUFFER = Array(HEIGHT).fill(0).map(_ => Array(WIDTH).fill(0));
    COLOR_BUFFER = Array(HEIGHT).fill(0).map(_ => Array(WIDTH).fill(DEFAULT_COLOR));
    
}

function setPixel(x,y,z,ch,col) {

    
    if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) {
        return;
    }
    if (z < DEPTH_BUFFER[y][x]) {
        return;
    }
    SCREEN[y][x]=ch;
    COLOR_BUFFER[y][x] = col;
    DEPTH_BUFFER[y][x] = z;
}

function setWindowSize() {
    var clone = $("#terminal").clone();
    clone.attr("id","sizeTest");
    clone.removeClass("fullscreen");
    $(document.documentElement).append(clone);
    clone.text("C");
    WIDTH = Math.floor($(window).width() / clone.width());
    HEIGHT = Math.floor($(window).height() / clone.height());
    resetBuffers();
    clone.remove();
}

function renderScreen() {
    var screenText = "<span style='color:#" + DEFAULT_COLOR + "'>";
    resetBuffers();
    for (const [k,v] of Object.entries(SCREEN_OBJECTS)) {
        if (v.render) {
            v.draw();
        }
    }
    var prevColor = "";
    for (var y = 0; y < HEIGHT; y++) {
        for (var x = 0; x < WIDTH; x++) {
            if (COLOR_BUFFER[y][x] != prevColor) {
                prevColor = COLOR_BUFFER[y][x];
                screenText += "</span><span style='color:#" + COLOR_BUFFER[y][x] + "'>";
            }
            screenText += SCREEN[y][x];
        }
        screenText += "\n";   
    }
    
    screenText += "</span>";
    SCREEN[0].forEach(function(){screenText += BLOCK;});
    screenText += BLOCK;
    $('#terminal').html(screenText);

}
function renderLoop() {
    c.x += 0.5;
    c.y += 1;
    renderScreen();
}

$(document).ready( function() {
    resetBuffers();
    r = new Rectangle(10,3,1,10,3);
    r.render = false;
    r.width = 20;
    new Circle(25,25,1,20);
    new Circle(35,35,1,15);
    c = new Circle(20,20,1,5);
    new Circle(3,3,1,3)
    new RandomChar(15,15,2);
    for (var i = 0; i < 60; i++) {
        new RandomChar(i,i,2);
    }

    $(window).resize( function () {
        setWindowSize();
        renderScreen();
    });
    setWindowSize();
    renderScreen();
    setInterval(renderLoop, 1000);
    
});


