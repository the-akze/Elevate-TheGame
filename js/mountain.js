class Mountain
{
    constructor(color)
    {
        allBodyItems.push(this);
        var bodyOptions=
        {
            restitution:0,
            frictionAir:0,
            friction:0.75,
            isStatic:true
        }

        var vertices = [
            {x: 1600, y : 900},
            {x: 1600, y : 700}
        ]
        
        this.mtnParts = [
            new MountainPart(vertices, "gray")
        ]
        
        // camera.zoom = 0.02;
        
        // for (var i = 0; i < 10; i++)
        // {
        //     this.generateVertices();
        // }

        this.color = color;
    }

    //unfinished function...
    // generateMountain()
    // {
    //     var btmV = this.mtnParts[this.mtnParts.length - 1].vertices[1];
    //     var angle = random(0, -PI/2);
    //     var v = angleToVector(angle);
    //     this.mtnParts.push(new MountainPart([btmV, btmV]))
    // }

    // generateMountainVertices()
    // {
    //     var offsetX = random(0.01, 1);
    //     var offsetY = random(0.01, 1);

    //     var newVerticeOffset = normalize(offsetX, offsetY);

    //     var vert = [];

    //     for (var i in this)
    //     {
    //         vert.push({x: fromSet[i].x, y: fromSet[i].y});
    //     }

    //     var lastVert = fromSet[fromSet - 1];

    //     vert.push({x: lastVert.x + newVerticeOffset.x, y: lastVert.y + newVerticeOffset.y});

    //     return vert;
    // }

    // generateVertices()
    // {
    //     console.log("generating");

    //     var offsetX = random(0.01, 1);
    //     var offsetY = random(-1, -0.01);

    //     console.log("made offsets");
        
    //     var newVerticeOffset = normalize(offsetX, offsetY);
    //     newVerticeOffset.x *= 100;
        
    //     console.log("normalized offsets");

    //     var vert = [];
    //     for (var i in this.body.vertices)
    //     {
    //         if (i == 0)
    //         {
    //             break;
    //         }
    //         prevVertices.push({x: this.body.vertices[i].x, y: this.body.vertices[i].y});
    //     }
    //     var lastVert = this.body.vertices[this.body.vertices.length - 1];
    //     vert.push({x: lastVert.x + newVerticeOffset.x, y: lastVert.y + newVerticeOffset.y});

    //     Matter.Body.setVertices(this.body, vert);
    // }

    display()
    {
        for (var part in this.mtnParts)
        {
            this.mtnParts[part].display();
        }
    }
}