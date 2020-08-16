
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
        this.color = "0F0";

    }
    delete () {
        delete SCREEN_OBJECTS[this.UID];
    }

    draw () {
        console.log("Unimplemented Draw!");
    }

    setColor(c) {
        this.color = c;
    }

    setChar(c) {
        this.char = c;
    }

    setLink(link) {
        this.link = link;
    }

    drawPixel(x,y,z) {
        setPixel(x,y,z,this.char,this.color,this.link);
    }
}

class ShapeList {
    constructor() {
        this.counter = 0;
        this._internal = {};
    }

    add (o) {
        var id = this.counter++;
        this._internal[id] = o;
        return id;
    }

    get (id) {
        return this._internal[id];
    }

    deleteItem (id) {
        delete this._internal[id];
    }

    forAll(f) {
        for (const [k,v] of Object.entries(this._internal)) {
            f(k,v);
        }
    }

}

class SlantedLine extends Renderable {
    constructor(x1,y1,z1,x2,y2,z2) {
        super(x1,y1,z1);
        
        this.x1 = x1;
        this.y1 = y1;
        this.z1 = z1;
        
        this.x2 = x2;
        this.y2 = y2;
        this.z2 = z2;

        this.setChar(BLOCK);
    }

    draw () {
        var t = 200;
        var stepx = (this.x2-this.x1)/t;
        var stepy = (this.y2-this.y1)/t;
        var stepz = (this.z2-this.z1)/t;
        for (var i = 0; i <= t; i++ ) {
            this.drawPixel(this.x1+stepx*i,this.y1+stepy*i,this.z1+stepz*i);
        }

    }

}

class VLine extends Renderable {
    constructor(x,y1,y2,z) {
        super(x,y1,z);
        this.y1 = y1;
        this.y2 = y2;

        this.setChar("|");
    }

    draw () {
        for (var i = this.y1; i <= this.y2; i++) {
            this.drawPixel(this.x,i,this.z);
        }
    }
}

class Rectangle extends Renderable {
    constructor(x,y,z,w,h) {
        super(x,y,z);
        this.width = w;
        this.height = h;
        this.x=x;
        this.y=y;

        this.setChar(SHADES[0]);
    }

    draw() {
        for (var dx = this.x; dx < this.x+this.width;dx++) {
            this.drawPixel(dx,this.y,this.z);
            this.drawPixel(dx,this.y+this.height-1,this.z);
        }
        for (var dy = this.y; dy < this.y+this.height;dy++) {
            this.drawPixel(this.x,dy,this.z);
            this.drawPixel(this.x+this.width-1,dy,this.z);
        }
    }
}

class FilledRectangle extends Renderable {
    constructor(x,y,z,w,h) {
        super(x,y,z);
        this.width = w;
        this.height = h;
        this.x=x;
        this.y=y;

        this.setChar(BLOCK);
    }

    draw() {
        for (var dx = this.x; dx < this.x+this.width;dx++) {
            for (var dy = this.y; dy < this.y+this.height;dy++) {
                this.drawPixel(dx,dy,this.z);
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

        this.setChar(SHADES[2]);
    }
    draw () {
        for (var dx = this.x - this.radius; dx <= this.x + this.radius; dx+=1) {
            for (var dy = this.y-this.radius; dy <= this.y + this.radius; dy+=1) {
                var d2 = (dy-this.y)*(dy-this.y) + (dx-this.x)*(dx-this.x);
                var dist = Math.sqrt(d2) - this.radius
                if (Math.abs(dist) < 0.5) {
                    // boundary
                    this.drawPixel(dx,dy,this.z);
                } else if (dist < 0) {
                    // center
                    this.drawPixel(dx,dy,this.z);
                }
            }
        }
    }
}

class HLine extends Renderable {
    constructor(x1,x2,y,z) {
        super(x1,y,z);
        this.x1 = x1;
        this.x2 = x2;

        this.setChar("=");
    }

    draw () {
        for (var i = this.x1; i <= this.x2; i++) {
            this.drawPixel(i,this.y,this.z);
        }
    }
}

class RandomChar extends Renderable {
    constructor(x,y,z) {
        super(x,y,z);
    }
    draw () {
        this.drawPixel(this.x,this.y,this.z);
    }

    drawPixel(x,y,z) {
        setPixel(x,y,z,characters.charAt(Math.floor(Math.random() * characters.length)),this.color);
    }
}

class RenderText extends Renderable {
    constructor(x,y,z,text) {
        super(x,y,z);
        this.text = text;
    }

    draw () {
        for (var i = 0; i < this.text.length; i++) {
            this.drawPixel(this.x+i,this.y,this.z,this.text.charAt(i));
        }
    }

    drawPixel(x,y,z,c) {
        setPixel(x,y,z,c,this.color,this.link);
    }
}

class MatrixParticle extends Renderable {
    constructor(x,y,z,length) {
        super(x,y,z);
        this.length = length;
        this.setString();
    }

    draw () {
        for (var i = 0; i < this.length; i++) {
            this.drawPixel(this.x,this.y-i,this.z,this.str.charAt(i));

        }
    }

    drawPixel(x,y,z,c) {
        setPixel(x,y,z,c,this.color);
    }

    setString() {
        this.str = "";
        for (var i = 0; i < this.length; i++) {
            this.str +=characters.charAt(Math.floor(Math.random() * characters.length));
        }
    }
}

class RenderImage extends Renderable {
    constructor(x,y,z,w,h,img) {
        super(x,y,z);
        this.w = w;
        this.h = h;
        this.drawn = false;

        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');

        this.img = new Image(w,h);
        this.img.crossOrigin = "Anonymous";
        this.img.src = img;

        this.setChar(BLOCK);

    }

    getPixel(i,j) {
        return this.context.getImageData(i,j, 1, 1).data;
    }

    draw () {
        if (this.img.naturalWidth == 0) {
            console.log("Waiting for the image to load...");
            return;
        }
        if (!this.drawn) {
            this.context.drawImage(this.img, 0, 0,this.w,this.h);
            this.drawn = true;
            // Force redraw the screen now the image has loaded
            renderScreen();
        }
        for (var i = 0; i < this.w; i++) {
            for (var j = 0; j < this.h; j++) {
                var px = this.getPixel(i,j);
                var r = px[0];
                var g = px[1];
                var b = px[2];
                this.drawPixel(this.x+i,this.y+j,this.z,rgbToHex(r,g,b));
            }
        }
    }

    // Do not bother overriding drawPixel here for now, the drawing code is too different
    drawPixel(x,y,z,col) {
        setPixel(x,y,z,this.char,col,this.link);
    }
}