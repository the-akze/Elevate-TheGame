class Ground extends BaseClass
{
    constructor(x, y, width, height, color, image, minableMaterial)
    {
        super(x, y, width, height, color, image);
        Matter.Body.setStatic(this.body, true);
        this.body.label = "Ground";
        allGrounds.push(this);
        for (var i = allBodyItems.length - 1; i >= 0; i++)
        {
            if (allBodyItems[i] == this)
            {
                allBodyItems.splice(i, 1);
                break;
            }
        }

        if (minableMaterial)
        {
            if (Inventory.itemClassification()[minableMaterial] == "materials")
            {
                allMinable.push(this);
                var h;
                var isCommonMaterial;
                if (Inventory.materialLevels().indexOf(minableMaterial) != -1)
                {
                    h = Inventory.materialStrength()[Inventory.materialLevels().indexOf(minableMaterial)] * 60;
                    isCommonMaterial = true;
                }
                else
                {
                    h = Inventory.otherMaterialStrengths()[minableMaterial] * 60;
                    isCommonMaterial = false;
                }
                this.mining = 
                {
                    originalHealth: h,
                    health: h,
                    material: minableMaterial
                }
            }
        }
        
    }
    
    hit(strength, material)
    {
        if (!this.mining)
        {
            return;
        }
        this.mining.health = this.mining.health - strength;
        if (this.mining.health <= 0)
        {
            this.mining.health = this.mining.originalHealth;
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