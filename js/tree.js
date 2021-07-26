class Tree
{
    constructor(x, y, width, height)
    {
        allTrees.push(this);
        
        this.width = width;
        this.height = height;

        // this.image = base.assets.trees[
        //     Math.round(random(0, base.assets.trees.length-1))
        // ];
        this.image = base.assets.nature.trees[
            Math.round(random(0, base.assets.nature.trees.length-1))
        ];
        
        this.sprite = createSprite(x, y - (height/2), this.width, this.height);
        this.sprite.shapeColor = rgb(114, 92, 66);
        this.sprite.visible = false;
        // this.leaves = this.generateLeafCircle(height/2, 200, 1.2, 1);
        this.sprite.depth = 1;
        
        allMinable.push(this);
        this.mining = 
        {
            originalHealth: Inventory.materialStrength()[Inventory.materialLevels().indexOf("wood")] * 60,
            health: Inventory.materialStrength()[Inventory.materialLevels().indexOf("wood")] * 60,
            material: "wood"
        };
    }

    generateLeafCircle(radius, amount, dilateX, dilateY)
    {
        var allLeaves = [];

        var centerPos = 
        {
            x: this.sprite.x,
            y: this.sprite.y - (this.height/2)
        }

        for (var i = 0; i < amount; i++)
        {
            var leafDist = random(radius);
            var leafNormOffset = base.mathStuff.angleToVector(random(2*PI));
            var leafOffset = base.mathStuff.normalize(leafNormOffset.x, leafNormOffset.y, leafDist);
            if (dilateX){ leafOffset.x = leafOffset.x * dilateX; }
            if (dilateY){ leafOffset.y = leafOffset.y * dilateY; }

            var leafSize = random(this.width/2, this.width*2);
            var sizeOffset = random(-this.width/10, this.width/10);

            
            var leaf = new Particle(centerPos.x + leafOffset.x, centerPos.y + leafOffset.y, leafSize + sizeOffset, leafSize - sizeOffset, random(0, 360), rgb(40, 140, 40, random(0.2, 0.8)));

            var leafIsOnTrunk = (Math.abs(leafOffset.x) - (leafSize*0.7) < this.width/4) && (leafOffset.y > 0);

            if (leafIsOnTrunk)
            {
                var oldRGB = leaf.sprite.shapeColor.levels;
                leaf.sprite.shapeColor = rgb(oldRGB[0], oldRGB[1], oldRGB[2], random(0.02, 0.2));
            }

            allLeaves.push(leaf);
        }

        return allLeaves;
    }

    swayLeaves()
    {
        if (buttonStuff.settings.dynamicTrees)
        {
            for (var p in this.leaves)
            {
                this.leaves[p].sway();
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
            if (Inventory.materialBreaks()[material].indexOf(this.mining.material) != -1)
            {
                eval(`player.inventory.gather({
                        ` + this.mining.material + `: 1
                    })`
                );
            }
            this.break();
        }
    }

    display()
    {
        if (this.broken)
        {
            return;
        }
        // if (buttonStuff.settings.textures)
        // {
        //     this.sprite.visible = false;
        //     push();
        //     imageMode(CENTER)
        //     image(this.image, this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height);
        //     pop();
        // }
        // else
        // {
        //     this.sprite.visible = true;
        // }

        push();
        imageMode(CENTER);
        image(this.image, this.sprite.x, this.sprite.y, this.image.width * ((this.sprite.height) / this.image.height), this.sprite.height);
        pop();
    }

    break()
    {
        for (var l in this.leaves)
        {
            this.leaves[l].sprite.lifetime = Math.round(random(10, 20));
            delete this.leaves[l];
        }
        this.sprite.destroy();
        this.broken = true;
    }
}