class Mountain
{
    constructor(color)
    {
        allBodyItems.push(this);
        
        var vertices = [
            {x: 1600, y : 900},
            {x: 1600, y : 700},
            {x: 20000, y: 700},
            {x: 20000, y: 900}
        ]

        this.highestPoint = {x: 1600, y: 700};
        
        this.mtnParts = []
        
        this.mtnParts.push(new MountainPart(vertices, "gray"));

        this.mtnVertices = [vertices[0]];

        // camera.zoom = 0.02;

        this.color = color;

    }
    
    generateMountain()
    {
        var btmV = this.highestPoint;
        var angle = random(-PI/4, -PI/2);
        var v = angleToVector(angle);
        var length = random(50, 200);
        var topV = 
        {
            x: btmV.x + v.x * length,
            y: btmV.y + v.y * length
        };
        // var length = random(100, 200);
        var verts = [topV, btmV, {x: btmV.x + 20000, y: btmV.y}, {x: topV.x + 20000, y: topV.y}];
        var newMtn = new MountainPart(verts, "gray", angle);
        this.mtnParts.push(newMtn);
        this.mtnVertices.push(btmV);
        this.highestPoint.x = topV.x;
        this.highestPoint.y = topV.y;
    }

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