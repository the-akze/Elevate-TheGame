class BaseClass
{
    constructor(x, y, width, height, color, image, isGround)
    {
        if ((y + (height/2) + 1000) > voidY)
        {
            voidY = y + (height/2) + 1000;
        }
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
        this.sprite.shapeColor = color;

        this.image = null;
        if (image)
        {
            this.image = (((typeof image) == "string") ? loadImage(image) : image);
            // this.sprite.addAnimation("img", this.image);
            this.sprite.visible = false;
        }

        this.isGround = isGround;
    }

    display()
    {
        if (this.image)
        {
            if (this.isGround)
            {
                if (buttonStuff.settings.textures)
                {
                    this.sprite.visible = false;
                    push()
                    imageMode(CORNER)
                    var sizeX = 50;
                    var sizeY = 50;
                    for (var x = this.initialX - (this.width/2); x < this.initialX + (this.width/2); x += sizeX)
                    {
                        for (var y = this.initialY - (this.height/2); y < this.initialY + (this.height/2); y += sizeY)
                        {
                            if (dist(player.sprite.x, player.sprite.y, x, y) < 1500)
                            {
                                image(this.image, x, y, sizeX, sizeY);
                            }
                        }
                    }
                    pop();
                }
                else
                {
                    this.sprite.visible = true;
                }
            }
            else
            {
                var angle = this.sprite.rotation;
                push();
                translate(this.body.position.x, this.body.position.y);
                rotate(angle);
                imageMode(CENTER);
                image(this.image, 0, 0, this.width, this.height);
                pop();
            }
        }

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