class Rope
{
    constructor(body, length, strength, point, sprite)
    {
        var conOpt =
        {
            bodyA: body,
            length: length,
            stiffness: strength,
            pointA: {x: 0, y: 0},
            pointB: point
        }

        this.point = point;
        this.constraint = Constraint.create(conOpt);
        World.add(world, this.constraint);
        this.on = true;
        this.connectedSprite = sprite ? sprite : null;
    }

    updatePointToSprite(sprite)
    {
        this.connectedSprite = sprite;
        this.point = {
            x: sprite.x,
            y: sprite.y
        }
        this.constraint.pointB = this.point;
    }

    disable()
    {
        this.on = false;
        this.constraint.bodyA = null;
    }

    enable(body)
    {
        this.on = true;
        this.constraint.bodyA = body;
        var len = dist(this.point.x, this.point.y, body.position.x, body.position.y);
        this.constraint.length = len * 0.7;
    }

    drawLine(color, width)
    {
        if (!this.on)
        {
            return;
        }

        push();
        stroke(color);
        strokeWeight(width);
        
        var body1ConPos = {x:this.constraint.bodyA.position.x + this.constraint.pointA.x, y:this.constraint.bodyA.position.y + this.constraint.pointA.y};
        
        imageMode(CENTER);
        image(base.assets.textures[7], this.point.x, this.point.y, 60, 60);

        var n = base.mathStuff.normalize(this.point.x - player.sprite.position.x, this.point.y - player.sprite.position.y, 15);
        
        line(body1ConPos.x, body1ConPos.y, this.point.x - n.x, this.point.y - n.y);

        pop();
    }
}