class Ground extends BaseClass
{
    constructor(x, y, width, height, color, image)
    {
        super(x, y, width, height, color, image);
        Matter.Body.setStatic(this.body, true);
        this.body.label = "Ground";
        allGrounds.push(this);
    }
}