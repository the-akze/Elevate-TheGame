class Ropable extends Copper
{
    constructor(x, y)
    {
        super(x, y, 100, 100);
        allRopable.push(this);
        this.secondSprite = createSprite(x, y, 60, 60);
        this.secondSprite.shapeColor = rgb(217, 138, 78);
        this.secondSprite.addImage("c", base.assets.textures[6]);
        this.secondSprite.scale = 0.5;
    }
}