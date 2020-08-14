
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
    }

    draw () {
        var t = 5000;
        var stepx = (this.x2-this.x1)/t;
        var stepy = (this.y2-this.y1)/t;
        var stepz = (this.z2-this.z1)/t;
        for (var i = 0; i <= t; i++ ) {
            setPixel(this.x1+stepx*i,this.y1+stepy*i,this.z1+stepz*i,SHADES[0],this.color);
        }

    }

}

class VLine extends Renderable {
    constructor(x,y1,y2,z) {
        super(x,y1,z);
        this.y1 = y1;
        this.y2 = y2;
    }

    draw () {
        for (var i = this.y1; i <= this.y2; i++) {
            setPixel(this.x,i,this.z,"|",this.color);
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
    }

    draw() {
        for (var dx = this.x; dx < this.x+this.width;dx++) {
            setPixel(dx,this.y,this.z,SHADES[1],this.color);
            setPixel(dx,this.y+this.height-1,this.z,SHADES[1],this.color);
        }
        for (var dy = this.y; dy < this.y+this.height;dy++) {
            setPixel(this.x,dy,this.z,SHADES[1],this.color);
            setPixel(this.x+this.width-1,dy,this.z,SHADES[1],this.color);
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
    }

    draw() {
        for (var dx = this.x; dx < this.x+this.width;dx++) {
            for (var dy = this.y; dy < this.y+this.height;dy++) {
                setPixel(dx,dy,this.z,SHADES[0],this.color);
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
                    setPixel(dx,dy,this.z,BLOCK,this.color);
                } else if (dist < 0) {
                    setPixel(dx,dy,this.z,BLOCK,this.color);
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
    }

    draw () {
        for (var i = this.x1; i <= this.x2; i++) {
            setPixel(i,this.y,this.z,"=",this.color);
        }
    }
}

class RandomChar extends Renderable {
    constructor(x,y,z) {
        super(x,y,z);
    }
    draw () {
        setPixel(this.x,this.y,this.z,characters.charAt(Math.floor(Math.random() * characters.length)),this.color);
    }
}

class RenderText extends Renderable {
    constructor(x,y,z,text) {
        super(x,y,z);
        this.text = text;
    }

    draw () {
        for (var i = 0; i < this.text.length; i++) {
            setPixel(this.x+i,this.y,this.z,this.text.charAt(i),this.color);
        }

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
            setPixel(this.x,this.y-i,this.z,this.str.charAt(i),this.color);

        }
    }

    setString() {
        this.str = "";
        for (var i = 0; i < this.length; i++) {
            this.str +=characters.charAt(Math.floor(Math.random() * characters.length));
        }
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

    deleteArray(arr) {
        
    }

    forAll(f) {
        for (const [k,v] of Object.entries(this._internal)) {
            f(k,v);
        }
    }

}