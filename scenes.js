class Scene {
    constructor() {

    }

    setup() {
        console.log("Unimplemented Setup");
    }

    stepScene() {
        console.log("Unimplemented Step");
    }
}

class HelloScene extends Scene {
    constructor() {
        super();
    }
    setup () {
        
        new Rectangle(3,3,1,getWidth()-6,getHeight()-6);
        new RenderText(5,5,2,"Hello World");
        new RenderText(5,6,2,"This text is very epic");
        new RenderText(getWidth()-30,5,999,"Version 3");

        this.movingLine = new SlantedLine(30,30,0,60,60,10);
        new HLine(4,getWidth()-5,8,2);

        (new Rectangle(10,10,1,20,10)).setColor("0FF");
        (new Rectangle(13,13,1,20,10)).setColor("F0F");
        (new Rectangle(16,16,1,20,10)).setColor("FF0");

        this.movingLine.setColor("F00");
        (new Circle(40,50,5,10)).setColor("FA0");
        new VLine(80,9,getHeight() - 5,2);

        // (new FilledRectangle(82,10,999,getWidth()-87,getHeight()-15)).setColor("7F7");

        this.matrixParticles = new ShapeList();

    }
    
    stepScene(t) {
        this.movingLine.x1 = 30+15*(1+Math.sin(t/5));
        this.movingLine.x2 = 60-15*(1+Math.sin(t/5));

        if (randInt(1,5) > 2) {
            var p = new MatrixParticle(randInt(82,getWidth()-4),getHeight()-5,1,randInt(5,15));
            p.setColor("282");
            this.matrixParticles.add(p);
        }

        var deleteParticles = Array();
        this.matrixParticles.forAll(function (k,p) {
            p.y--;
            if (p.y < 9 + p.length) {
                deleteParticles.push(k);
            }
            if (randInt(1,2) == 1) {
                p.setString();
            }
        });
        deleteParticles.forEach(function f(k) {
            this.matrixParticles.get(k).delete();
            this.matrixParticles.deleteItem(k);
        },this);
    } //static scene
}