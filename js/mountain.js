class Mountain
{
    constructor(color)
    {
        mainMountain = this;
        
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

        this.done = false;
    }
    
    generateMountain(offset)
    {
        if (this.done)
        {
            return;
        }
        var btmV = this.highestPoint;
        // if (this.highestPoint.y)
        var angle = random(-PI/5, -PI/2);
        var v = base.mathStuff.angleToVector(angle);
        var length = random(50, 200);
        var topV;
        if (offset)
        {
            topV =
            {
                x: btmV.x + Math.abs(offset.x),
                y: btmV.y - Math.abs(offset.y)
            }
        }
        else
        {
            topV = 
            {
                x: btmV.x + v.x * length,
                y: btmV.y + v.y * length * 0.5
            };
        }
        var verts = [topV, btmV, {x: btmV.x + 20000, y: btmV.y}, {x: topV.x + 20000, y: topV.y}];
        var newMtn = new MountainPart(verts, "gray", angle);
        this.mtnParts.push(newMtn);
        this.mtnVertices.push(btmV);
        this.highestPoint.x = topV.x;
        this.highestPoint.y = topV.y;
    }

    display()
    {
        for (var part in this.mtnParts)
        {
            this.mtnParts[part].display();
        }
    }
}