class MountainPart
{
    constructor(vertices, color)
    {   
        var bodyOptions=
        {
            restitution:0,
            frictionAir:0,
            friction:0.75,
            isStatic:true
        }
        vertices.push({x: 20000, y: vertices[1].y}, {x: 20000, y: vertices[0].y});
        this.body = Bodies.fromVertices(0, 0, vertices, bodyOptions, true);
        Matter.Body.setPosition(this.body, {x: -(this.body.vertices[0].x - vertices[0].x), y: -(this.body.vertices[0].y - vertices[0].y)});
        World.add(world,this.body);
        this.color = color;
    }

    display()
    {
        displayBody(this.body, this.color);
    }
}