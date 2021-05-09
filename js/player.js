class Player extends BaseClass
{
    constructor(x, y, width, height, playerInfo, color, image)
    {
        super(x, y, width, height, color, image);
        this.moveSpeed = playerInfo.moveSpeed;
        this.jumpStrength = playerInfo.jumpStrength;
        this.body.restitution = 0;
        this.body.friction = 0;
        this.body.frictionStatic = 0;
        this.groundSensor = createSprite(x, y + (height/2), width*0.8, height*0.02);
        this.groundSensor.visible = false;
        this.grounded = false;
    }

    //player movement
    move(direction)
    {
        //direction must be a direction with magnitude 1 (left or right), or 0, meaning it does not move.
        if ((direction != 1) && (direction != -1) && (direction != 0))
        {
            console.log("Enter 1, -1, or 0 for direction in move(). You entered " + direction + ".");
            return;
        }

        var speedMulti = this.grounded ? 1 : 0.25;

        Matter.Body.applyForce(this.body, {x: this.body.position.x, y: this.body.position.y}, {x: direction * this.moveSpeed * speedMulti, y: 0});

        //Make sure it only goes up to a specific speed, that too, only if it is on the ground
        if (this.grounded)
        {
            Matter.Body.setVelocity(this.body, {x: clamp(this.body.velocity.x, -this.moveSpeed, this.moveSpeed), y: this.body.velocity.y});
        }

        if (direction == 0)
        {
            if (Math.abs(this.body.velocity.x) < this.moveSpeed/10)
            {
                Matter.Body.setVelocity(this.body, {x: 0, y: this.body.velocity.y});
                return;
            }

            Matter.Body.applyForce(this.body, this.body.position, {x: this.moveSpeed * (this.body.velocity.x > 0 ? -1 : this.body.velocity.x < 0 ? 1 : 0) * Math.pow(speedMulti, 1.5), y: 0});

            return;
            // Matter.Body.setVelocity(this.body, {x: this.body.velocity.x - direction*this.moveSpeed, y: this.body.velocity.y});
        }
    }

    updateGroundSensor()
    {
        // this.groundSensor.x = this.body.position.x;
        // this.groundSensor.y = this.body.position.y + (this.height/2);

        var offset = angleToVector(-this.body.angle);

        this.groundSensor.x = this.body.position.x - offset.x * this.height/2;
        this.groundSensor.y = this.body.position.y - offset.y * this.height/2;


        //.add(createSprite((vertices[0].x + vertices[1].x)/2, (vertices[0].y + vertices[1].y)/2, dist(vertices[0].x, vertices[0].y, vertices[1].x, vertices[1].y), 5));
        this.groundSensor.rotation = (180*this.body.angle/PI);

        this.grounded = this.checkGrounded();
    }

    checkGrounded()
    {
        for (var i in allGrounds)
        {
            if (allGrounds[i].sprite.isTouching(this.groundSensor))
            {
                return true;
            }
        }
        return false;
    }

    tryToJump(force)
    {
        if (this.grounded)
        {
            var direction = angleToVector(this.body.angle);
            Matter.Body.applyForce(this.body, {x: this.body.position.x, y: this.body.position.y}, {x: direction.x*force, y: -direction.y*force});
            console.log(direction);
        }
    }

    cameraMove(lerpFactor)
    {
        var fastEnough = this.body.speed > 2;
        var tooFast = this.body.speed > 20;
        camera.position = {
            x: lerp(camera.position.x, this.body.position.x, lerpFactor * (tooFast ? 2 : (fastEnough ? 1 : 0.25))),
            y: lerp(camera.position.y, this.body.position.y, lerpFactor * (tooFast ? 2 : (fastEnough ? 1 : 0.25)))
        }
    }
    
    //play, what it does each frame supposedly
    play()
    {
        if (clamp(this.body.angle, -PI/6, PI/6) != this.body.angle)
        {
            Matter.Body.setAngle(this.body, clamp(this.body.angle, -PI/6, PI/6));
            Matter.Body.setAngularVelocity(this.body, 0);
        }
        Matter.Body.setAngularVelocity(this.body, lerp(this.body.angularVelocity, -this.body.angle, 0.01));
        if (this.grounded)
        {
            // Matter.Body.setAngularVelocity(this.body, 0);
        }
        // Matter.Body.setPosition(this.groundSensor, {x: this.body.position.x, y: this.body.position.y + (this.height/2)});
        // Matter.Body.setVelocity(this.groundSensor, this.body.velocity);
        this.move((keyDown("right") || keyDown("d")) - (keyDown("left") || keyDown("a")));

        this.updateGroundSensor();
        
        if (keyDown("space") || keyDown("up") || keyDown("w"))
        {
            this.tryToJump(this.jumpStrength);
        }
        
        if (this.body.position.y > voidY)
        {
            this.resetPosition();
            camera.position = {x: this.body.position.x, y: this.body.position.y};
        }

        if (Math.abs(mountain.highestPoint.y - this.body.position.y) < 1500)
        {
            mountain.generateMountain();
        }
    }
}