class GrapheneWall extends Ground
{
    constructor(x, y)
    {
        super(x, y - 500, 100, 1000, rgb(10, 10, 10, 0.95), undefined, "graphene");
        this.sprite.addImage("graphene", base.assets.textures[0]);
    }

    hit(strength, material)
    {
        if (!this.mining)
        {
            return;
        }
        if (Inventory.materialBreaks()[material].indexOf(this.mining.material) == -1)
        {
            if ((frameCount % 30) == 0)
            {
                new GameMessage("Can't break " + this.mining.material + " with " + material, [168, 76, 50], [143, 51, 25], 60);
            }
            return;
        }
        this.mining.health = this.mining.health - strength;
        if (this.mining.health <= 0)
        {
            this.broken = true;
            this.sprite.destroy();
            World.remove(world, this.body);
            if (Inventory.materialBreaks()[material].indexOf(this.mining.material) != -1)
            {
                eval(`player.inventory.gather({
                        ` + this.mining.material + `: 1
                    })`
                );
            }
            else
            {
                new GameMessage("Can't break " + this.mining.material + " with " + material, [168, 76, 50], [143, 51, 25], 60);
            }
        }
    }
}