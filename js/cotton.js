class Cotton
{
    constructor(x, y)
    {
        var sizeMulti = random(0.6, 1.6);
        this.sprite = createSprite(x, y - 60*sizeMulti);
        this.sprite.addImage("cotton", base.assets.nature.cotton[Math.round(random(0, 2))]);
        this.sprite.scale = 2*sizeMulti/15;

        
        allCotton.push(this);
    }

    hit()
    {
        this.broken = true;
        this.sprite.destroy();
        player.inventory.gather({
            cotton: 1
        });
    }
}