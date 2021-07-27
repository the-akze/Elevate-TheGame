class Rocket
{
    constructor(x, y)
    {
        this.sprite = createSprite(x, y - 800)
        this.sprite.addImage("rocket", base.assets.rocket[0]);
        this.flySprite = createSprite(x, y - 800);
        this.flySprite.addImage("rocketFly", base.assets.rocket[1]);
        this.flySprite.scale = 1.25;
        this.flySprite.visible = false;
        this.hasCoal = false;
    }

    fly()
    {
        if (!this.hasCoal)
        {
            return;
        }
        this.sprite.visible = false;
        this.flySprite.visible = true;
        this.flySprite.velocityY -= 2;
        player.sprite.visible = false;
        player.playing = false;
        camera.x = lerp(camera.x, this.flySprite.x, 0.1);
        camera.y = lerp(camera.y, this.flySprite.y, 0.1);
        darkness++;
        zoom = 0.4;
        if (this.flySprite.y < -15000)
        {
            location = "end/end.html";
        }
    }
}