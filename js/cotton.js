class Cotton
{
    constructor(x, y)
    {
        var sizeMulti = 2*random(2, 3)/15;
        let img = base.assets.nature.cotton[Math.round(random(0, base.assets.nature.cotton.length-1))];
        this.sprite = createSprite(x, y - (img.height/2)*sizeMulti);
        this.sprite.addImage("cotton", img);
        this.sprite.scale = sizeMulti;
        // this.sprite.debug = true;
        
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