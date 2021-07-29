class Inventory
{
    constructor(startingOptions)
    {
        this.content = {};
        this.content.materials = {};
        this.content.misc = {};
        this.hasRope = false;
        this.gather(startingOptions);
        this.tool = -1;
    }

    gather(items, hideMessage) //items must be an object, for example, {wood: 2, stone: 1}
    {
        for (var i in items)
        {
            if (Inventory.itemClassification()[i])
            {
                this.add(Inventory.itemClassification()[i], i, items[i], hideMessage);
            }
            else
            {
                this.add("misc", i, items[i]);
            }
        }

        buttonStuff.inventoryUI.update();
        
    }

    add(classification, item, count, hideMessage)
    {
        if (!hideMessage)
        {
            var nc = this.content[classification][item] + count;
            // new GameMessage("+" + count + " " + item + ((((nc % 3) == 0) || ((nc % 5) == 0)) && (item != "cotton") ? "\n('E' to see materials and crafting)" : ""), [35, 186, 113], [10, 161, 88], 60, base.assets.materialIcons[item], 30, 30);
            if (count != 0)
            {
                new GameMessage("", undefined, undefined, undefined, base.assets.materialIcons[item], 30, 30);
            }
        }
        if (this.content[classification][item])
        {
            this.content[classification][item] = this.content[classification][item] + count;
        }
        else
        {
            this.content[classification][item] = count;
        }
    }

    craft(product)
    {
        var cost = Inventory.costs()[product];
        var afford = true;
        var missing = null;
        for (var c in cost)
        {
            if (this.content.materials[c])
            {
                if (this.content.materials[c] < cost[c])
                {
                    afford = false;
                    missing = c;
                    break;
                }
            }
            else
            {
                afford = false;
                missing = c;
                break;
            }
        }
        if (!afford)
        {
            new GameMessage("You need more " + missing + " to make " + product.replace("Club", "Fist"), [168, 76, 50], [143, 51, 25], 60);
            return;
        }
        if (Inventory.craftable().indexOf(product) == -1)
        {
            new GameMessage("It's not possible to craft '" + product + "'...", [168, 76, 50], [143, 51, 25], 60);
            return;
        }
        var loss = "";
        for (var c in cost)
        {
            this.content.materials[c] = this.content.materials[c] - cost[c];
            loss = loss + "-" + cost[c] + " " + c + "\n";
        }
        if (Inventory.itemClassification()[product] == "materials")
        {
            eval(`this.gather(
            {
                ` + product + `: 1
            }, true);`);
            new GameMessage("Successfully crafted " + product + "\n" + loss, [35, 186, 113], [10, 161, 88], 60);
        }
        else if (Inventory.itemClassification()[product] == "tools")
        {
            var index = Inventory.clubLevels().indexOf(product);
            if (index > this.tool)
            {
                new GameMessage("Successfully upgraded fist to " + product.replace("Club", "Fist"), [35, 186, 113], [10, 161, 88], 60);
            }
            else if (index < this.tool)
            {
                new GameMessage("Successfully downgraded fist to " + product.replace("Club", "Fist"), [35, 186, 113], [10, 161, 88], 60);
            }
            else
            {
                new GameMessage("Successfully wasted materials\nto remake a " + product.replace("Club", "Fist"), [35, 186, 113], [10, 161, 88], 60);
            }
            this.tool = Inventory.clubLevels().indexOf(product);
        }

        buttonStuff.inventoryUI.update();
    }

    makeRope()
    {
        if (this.content.materials.cotton)
        {
            if (this.content.materials.cotton >= 12)
            {
                this.hasRope = true;
                this.content.materials.cotton = this.content.materials.cotton - 12;
                new GameMessage("Created rope. Press R or C to use.", [35, 186, 113], [10, 161, 88], 60);
            }
            else
            {
                new GameMessage("You need 12 cotton to make a rope.", [168, 76, 50], [143, 51, 25], 60);
            }
        }
        else
        {
            new GameMessage("You need 12 cotton to make a rope.", [168, 76, 50], [143, 51, 25], 60);
        }

        buttonStuff.inventoryUI.update();
    }

    static itemClassification()
    {
        return {
            wood: "materials",
            stone: "materials",
            iron: "materials",
            copper: "materials",
            bronze: "materials",
            diamond: "materials",
            coal: "materials",
            cotton: "materials",
            graphene: "materials",
            
            woodClub: "tools",
            stoneClub: "tools",
            ironClub: "tools",
            bronzeClub: "tools",
            diamondClub: "tools",
        };
    }

    static allMaterials()
    {
        return [
            'wood', 'stone', 'iron', 'copper', 'bronze', 'diamond', 'coal', 'cotton', 'graphene'
        ];
    }

    static clubLevels()
    {
        return ["woodClub", "stoneClub", "ironClub", "bronzeClub", "diamondClub"];
    }

    static materialLevels()
    {
        return ["wood", "stone", "iron", "bronze", "diamond"];
    }

    static materialStrength()
    {
        return [
            2,
            6,
            12,
            20,
            40
        ];
    }

    static otherMaterialStrengths()
    {
        return {
            coal: 8,
            copper: 16,
            graphene: 80
        };
    }

    static materialBreaks()
    {
        return {
            hand:       ["wood"],
            wood:       ["wood", "stone"],
            stone:      ["wood", "stone", "iron", "coal"],
            iron:       ["wood", "stone", "iron", "copper", "coal"],
            bronze:     ["wood", "stone", "iron", "copper", "diamond", "coal"],
            diamond:    ["wood", "stone", "iron", "copper", "diamond", "coal", "graphene"]
        }
    }

    static minimumMaterialToolBreaks()
    {
        return {
            wood: "hand",
            stone: "woodFist",
            iron: "stoneFist",
            copper: "ironFist",
            diamond: "bronzeFist",
            coal: "stone",
            graphene: "diamond",
        }
    }

    static craftable()
    {
        var a = [];
        for (var c in Inventory.costs())
        {
            a.push(c);
        }
        return a;
    }

    static costs()
    {
        return {
            woodClub:
            {
                wood: 4
            },
            stoneClub:
            {
                stone: 4
            },
            ironClub:
            {
                iron: 4
            },
            bronzeClub:
            {
                bronze: 4
            },
            diamondClub:
            {
                diamond: 4
            },
            bronze:
            {
                copper: 1,
                iron: 1
            },
            rope:
            {
                cotton: 12
            }
        };
    }
}