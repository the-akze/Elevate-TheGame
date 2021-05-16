class WaterBody
{
    constructor(x, y, width, height, subDivisions)
    {
        allWaterBodies.push(this);
        this.sprite = createSprite(x, y, width, height);
        this.sprite.shapeColor = rgb(100, 150, 200, 180/255);
        this.sprite.visible = false;
        this.vertices = [];
        this.vertices.push(
            {
                static: true,
                x: x + (width/2),
                y: y - (height/2)
            },
            {
                static: true,
                x: x + (width/2),
                y: y + (height/2)
            },
            {
                static: true,
                x: x - (width/2),
                y: y + (height/2)
            },
            {
                static: true,
                x: x - (width/2),
                y: y - (height/2)
            }
        );
        for (var subDivX = x - (width/2) + (0.5*width/subDivisions); subDivX < x + (width/2); subDivX += width/subDivisions)
        {
            var newSprite = createSprite(subDivX, y - (height/2), 0.8*width/subDivisions, 10);
            newSprite.velocityY = random(-5, 5);
            newSprite.visible = false;
            this.vertices.push(
                {
                    static: false,
                    sprite: newSprite
                }
            );
        }

        this.width = width;
        this.height = height;
        this.surfaceY = y - (height/2);
    }

    affectBodies(drag)
    {
        for (var i = 0; i < allBodyItems.length; i++)
        {
            if (allBodyItems[i].sprite.isTouching(this.sprite))
            {
                Matter.Body.setVelocity(allBodyItems[i].body, {x: allBodyItems[i].body.velocity.x*drag, y: allBodyItems[i].body.velocity.y*drag});
            }
        }
    }

    display()
    {
        push();
        noStroke();
        fill(this.sprite.shapeColor.levels[0], this.sprite.shapeColor.levels[1], this.sprite.shapeColor.levels[2], this.sprite.shapeColor.levels[3]);
        beginShape();
        for (var i = 0; i < this.vertices.length; i++)
        {
            if (this.vertices[i].static)
            {
                vertex(this.vertices[i].x, this.vertices[i].y);
            }
            else
            {
                vertex(this.vertices[i].sprite.x, this.vertices[i].sprite.y);
            }
        }
        endShape(CLOSE);
        pop();
    }
    
    dynamicWater(bodyEffectiveness, returnEffectiveness, rippleEffectiveness)
    {
        for (var v in this.vertices)
        {
            if (this.vertices[v].static == true)
            {
                continue;
            }
            var currentSprite = this.vertices[v].sprite;
            for (var b in allBodyItems)
            {
                if (allBodyItems[b].sprite.isTouching(this.vertices[v].sprite))
                {
                    currentSprite.velocityY += allBodyItems[b].body.velocity.y * bodyEffectiveness;
                }
            }
            currentSprite.velocityY = lerp(currentSprite.velocityY, (this.surfaceY - currentSprite.y), returnEffectiveness);
        }

        for (var i = 0; i < this.vertices.length; i++)
        {
            if (this.vertices[i].static == true)
            {
                continue;
            }
            if (i != this.vertices.length - 1)
            {
                if (this.vertices[i+1].static == false)
                {
                    this.vertices[i+1].sprite.velocityY = lerp(this.vertices[i+1].sprite.velocityY, this.vertices[i].sprite.velocityY, rippleEffectiveness);
                }
            }
            if (i != 0)
            {
                if (this.vertices[i-1].static == false)
                {
                    this.vertices[i-1].sprite.velocityY = lerp(this.vertices[i-1].sprite.velocityY, this.vertices[i].sprite.velocityY, rippleEffectiveness);
                }
            }
        }
    }
}