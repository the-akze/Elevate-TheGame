class Ropable extends Copper
{
    constructor(x, y)
    {
        super(x, y, 100, 100);
        allRopable.push(this);
        this.secondSprite = createSprite(x, y, 60, 60);
        this.secondSprite.shapeColor = rgb(217, 138, 78);
    }
}