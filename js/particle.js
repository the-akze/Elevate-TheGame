class Particle
{
    constructor(x, y, width, height, angle, color)
    {
        this.initialX = x;
        this.initialY = y;
        this.sprite = createSprite(x, y, width, height);
        this.sprite.rotation = angle;
        this.sprite.shapeColor = color;

        this.swayAngle = random(2*PI);
        this.swayAmount = (width + height)/20;
        this.timeOffset = Math.round(random(1000));
    }

    sway()
    {
        // var rawOffset = base.mathStuff.angleToVector(this.swayAngle);
        // var moveOffset = this.swayAmount * Math.sin((this.timeOffset + frameCount) / 30);
        // this.sprite.x = this.initialX + rawOffset * moveOffset;
        // this.sprite.y = this.initialY + rawOffset * moveOffset;
        if (((frameCount + this.timeOffset) % 15) == 0)
        {
            this.sprite.x = this.initialX + random(-1, 1) * this.swayAmount;
            this.sprite.y = this.initialY + random(-1, 1) * this.swayAmount;
            this.sprite.rotation += random(-5, 5);
        }
    }
}