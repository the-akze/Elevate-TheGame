class MountainPart
{
    constructor(vertices, color, angle)
    {   
        var bodyOptions=
        {
            restitution:0,
            frictionAir:0,
            friction:0.75,
            isStatic:true
        }

        this.sprite = createGroup();
        this.sprite.add(createSprite((vertices[0].x + vertices[1].x)/2, (vertices[0].y + vertices[1].y)/2, dist(vertices[0].x, vertices[0].y, vertices[1].x, vertices[1].y), 1));
        this.sprite[0].rotation = -((180*angle/PI) - 90);
        // this.sprite[0].shapeColor = "red";
        this.sprite[0].visible = false;
        this.sprite.add(createSprite((vertices[0].x + vertices[3].x)/2, vertices[0].y, vertices[3].x - vertices[0].x, 1));
        // this.sprite[1].shapeColor = "red";
        this.sprite[1].visible = false;

        allGrounds.push(this);

        this.body = Bodies.fromVertices(0, 0, vertices, bodyOptions);
        Matter.Body.setPosition(this.body, {x: -(this.body.vertices[0].x - vertices[0].x), y: -(this.body.vertices[0].y - vertices[0].y)});
        World.add(world,this.body);
        this.color = color;
        console.log(vertices);
        console.log(this.body.vertices);

        this.durability = this.body.area*5;
    }

    display()
    {
        displayBody(this.body, this.color);
    }
}