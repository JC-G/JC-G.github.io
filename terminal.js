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
var LINK_BUFFER = null;

var CURRENT_LOOP = null;

const BLOCK = "&#9608;" //█
const SHADES = ["&#9617;","&#9618;","&#9619;"]; //░▒▓

var DO_STEP = true;

const DEFAULT_COLOR = "000";
var SCREEN_OBJECTS = {};

var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

var t = 0;

function randInt(start,stop) {
    return Math.floor(start + (stop-start)*Math.random());
}

function resetBuffers() {
    
    SCREEN = Array(HEIGHT).fill(0).map(_ => Array(WIDTH).fill(BLOCK));
    DEPTH_BUFFER = Array(HEIGHT).fill(0).map(_ => Array(WIDTH).fill(0));
    COLOR_BUFFER = Array(HEIGHT).fill(0).map(_ => Array(WIDTH).fill(DEFAULT_COLOR));
    LINK_BUFFER = Array(HEIGHT).fill(0).map(_ => Array(WIDTH).fill(""));
    
}


function setPixel(x,y,z,ch,col,link) {
    x = Math.floor(x);
    y = Math.floor(y);
    if (!ch) {
        // console.log("Undefined Character");
        ch = "?";
    }
    if (!link && link != "") {
        // console.log("Undefined Link");
        link = "";
    }
    if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) {
        return;
    }
    if (z < DEPTH_BUFFER[y][x]) {
        return;
    }
    SCREEN[y][x]=ch;
    COLOR_BUFFER[y][x] = col;
    DEPTH_BUFFER[y][x] = z;
    LINK_BUFFER[y][x] = link;
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
    var prevLink= "";
    for (var y = 0; y < HEIGHT; y++) {
        for (var x = 0; x < WIDTH; x++) {
            if (COLOR_BUFFER[y][x] != prevColor) {
                prevColor = COLOR_BUFFER[y][x];
                // if we are currently in an <a> tag, close it
                if (prevLink != "") {
                    screenText += "</span>";
                    prevLink = "";
                }
                screenText += `</span><span style='color:#${COLOR_BUFFER[y][x]}'>`;
            }
            if (LINK_BUFFER[y][x] != prevLink) {

                if (prevLink != "") {
                    screenText += "</span>"; // close the previous link
                    console.log(prevLink);
                    DO_STEP = false;
                }

                if (LINK_BUFFER[y][x] != "") {
                    screenText += `<span onclick='DO_STEP = false; window.location = "${LINK_BUFFER[y][x]}";'>`;
                }
                prevLink = LINK_BUFFER[y][x];
            }

            screenText += SCREEN[y][x];
        }
        screenText += "\n";   
    }
    if (prevLink != "") {
        // if we are in a link, close it
        screenText += "</span>";
    }
    screenText += "</span>";
    SCREEN[0].forEach(function(){screenText += BLOCK;});
    screenText += BLOCK;
    $('#terminal').html(screenText);

}

function renderLoop() {
    if (DO_STEP) {
        ACTIVE_SCENE.stepScene(t);
        renderScreen();
        t++;
    }
}

$(document).ready( function() {
    resetBuffers();
    

    $(window).resize( function () {
        setWindowSize();
        setScene();
        renderScreen();
    });

    setWindowSize();
    setScene();
    renderScreen();
    CURRENT_LOOP = setInterval(renderLoop, 1000);
    
});


