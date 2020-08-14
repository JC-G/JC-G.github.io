var WIDTH=0;
var HEIGHT=0;

function getWidth() {
    return WIDTH;
}
function getHeight() {
    return HEIGHT;
}

var SCREEN = null;
var DEPTH_BUFFER = null;
var COLOR_BUFFER = null;

const BLOCK = "&#9608;" //█
const SHADES = ["&#9617;","&#9618;","&#9619;"]; //░▒▓

const DEFAULT_COLOR = "0F0";
var SCREEN_OBJECTS = {};

var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

var t = 0;

function randInt(start,stop) {
    return Math.floor(start + (stop-start)*Math.random());
}

function resetBuffers() {
    
    SCREEN = Array(HEIGHT).fill(0).map(_ => Array(WIDTH).fill(" "));
    DEPTH_BUFFER = Array(HEIGHT).fill(0).map(_ => Array(WIDTH).fill(0));
    COLOR_BUFFER = Array(HEIGHT).fill(0).map(_ => Array(WIDTH).fill(DEFAULT_COLOR));
    
}


function setPixel(x,y,z,ch,col) {
    x = Math.floor(x);
    y = Math.floor(y);
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
    ACTIVE_SCENE.stepScene(t);
    renderScreen();
    t++;
}

$(document).ready( function() {
    resetBuffers();
    

    $(window).resize( function () {
        setWindowSize();
        renderScreen();
    });
    setWindowSize();
    ACTIVE_SCENE.setup();

    renderScreen();
    setInterval(renderLoop, 70);
    
});


