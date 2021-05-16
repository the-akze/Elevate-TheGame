class GameMessage
{
    constructor(message, color, outline, lifetime)
    {
        allNotifications.push(this);

        this.message = message;
        this.color = color;
        this.outline = outline;
        if (lifetime)
        {
            this.lifetime = lifetime;
        }
        else
        {
            this.lifetime = 90;
        }

        this.position = {
            x: random(player.sprite.x - 200, player.sprite.x + 200),
            y: random(player.sprite.y - 100, player.sprite.y - 50)
        };
    }

    display()
    {
        this.position.y = this.position.y - 1.5;
        this.lifetime = this.lifetime - 1;

        push();
        fill(this.color);
        textSize(50);
        textAlign(CENTER);
        if (this.outline)
        {
            strokeWeight(5);
            stroke(this.outline);
        }
        text(this.message, this.position.x, this.position.y);
        pop();
    }
}