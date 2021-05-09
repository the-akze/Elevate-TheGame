class BaseClass
{
    constructor(x, y, width, height, color, image)
    {
        allBodyItems.push(this);
        var bodyOptions=
        {
            restitution:0.67,
            frictionAir:0,
            friction:1,
            frictionStatic:1,
            density:1
        }

        this.initialX = x;
        this.initialY = y;
        
        this.width = width;
        this.height = height;
        this.body = Bodies.rectangle(x,y,this.width,this.height,bodyOptions);
        World.add(world,this.body);

        this.image = image;
        this.color = color;

        this.sprite = createSprite(x, y, this.width, this.height);
        if (image)
        {
            this.sprite.setImage(image);
        }
        else
        {
            this.sprite.shapeColor = color;
        }
    }

    display()
    {
        // if (this.image)
        // {
        //     var angle = this.body.angle;
        //     push();
        //     translate(this.body.position.x, this.body.position.y);
        //     rotate(angle);
        //     imageMode(CENTER);
        //     image(this.image, 0, 0, this.width, this.height);
        //     pop();
        // }
        // else
        // {
        //     var angle = 180*this.body.angle/PI;
        //     push();
        //     noStroke();
        //     translate(this.body.position.x, this.body.position.y);
        //     fill(this.color);
        //     rotate(angle);
        //     rectMode(CENTER);
        //     rect(0, 0, this.width, this.height);
        //     pop();
        // }

        this.sprite.x = this.body.position.x;
        this.sprite.y = this.body.position.y;
        this.sprite.rotation = 180*this.body.angle/PI;
    }

    resetPosition()
    {
        Matter.Body.setPosition(this.body, {x:this.initialX, y:this.initialY});
        Matter.Body.setVelocity(this.body, {x:0, y:0});
        Matter.Body.setAngle(this.body, 0);
        Matter.Body.setAngularVelocity(this.body, 0);
    }
}