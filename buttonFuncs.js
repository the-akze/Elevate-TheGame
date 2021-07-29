var buttonStuff = {

    paused: false,

    togglePause: () => {
        buttonStuff.paused = !buttonStuff.paused;
        buttonStuff.updatePauseMenu(buttonStuff.paused);
        document.getElementById("tutorial").style.display = buttonStuff.settings.help ? "block" : "none";
    },

    setPaused: (paused) => {
        buttonStuff.paused = paused;
        buttonStuff.updatePauseMenu(buttonStuff.paused);
        buttonStuff.tutorial.update();
    },

    updatePauseMenu: (isPaused) => {
        // document.getElementById("pausemenu").style.display = isPaused ? "block" : "none";
        document.getElementById("pausemenu").style.top = isPaused ? "50%" : "-50%";
    },


    settings: {
        textures: true,
        help: true,
        dynamicTrees: true,
        dynamicWater: true,
        soundEffects: true,
        showFramerate: false
    },

    updateSettings: (updatedSettings) =>
    {
        for (var u in updatedSettings)
        {
            buttonStuff.settings[u] = updatedSettings[u];
        }
        buttonStuff.updateSettingElements();
    },
    
    updateSettingElements: () =>
    {
        for (var s in buttonStuff.settings)
        {
            var elem = document.getElementById(s + "Setting");
            if (elem)
            {
                elem.innerHTML = s + ": " + buttonStuff.settings[s];
            }
        }
        document.getElementById("tutorial").style.display = buttonStuff.settings.help ? "block" : "none";
        var fpsElement = document.getElementById("fpsText");
        if (fpsElement)
        {
            fpsElement.style.display = buttonStuff.settings.showFramerate ? "initial" : "none";
        }
    },

    tutorial: {
        page: 0,
        pages: [
            "Welcome to the game, Elevate.<br/><br/>To continue with the tutorial, click NEXT.<br/>To close the tutorial, click HIDE.",
            "Click the gear icon at the top left for settings.",
            "Use WASD or Arrow Keys to move.",
            "Use the space key to mine and break something.<br/>Use your cursor to point at something.",
            "You can see what items you have at the top left, below the settings button.<br/><br/>(It will be invisible if you haven't mined anything yet.)",
            "Use the backpack button at the top right to see how to craft items.<br/>Click on an item to craft it.",
            "When you move or mine, your stamina goes down slightly.<br/>When your stamina is low, you start losing health.",
            "You only have a limited amount of health, and you can't regain health.<br/>You can regain stamina, however.<br/>Don't run out of health, or you'll lose the game!",
            "Start with breaking down the three trees at the beginning.<br/>Go swim to the left of the water to find more trees.",
            "Remember the mountain to the right of your spawn point.<br/>You'll be coming back to it later.",
            "Once you have mined enough trees, make a wooden fist.",
            "Now, you can mine stone with your wooden fist.",
            "Keep mining stronger materials, and upgrading your fist.",
            `To beat the game, you will need:<br/>
                <ul>
                    <li>A rope.</li>
                    <li>A diamond fist.</li>
                    <li>20 coal.</li>
                </ul><br/>
            You'll find out why later.`,
            "See those orange boxes with a circle inside of them?<br/>They are made out of copper, and those are what you can rope onto.",
            "Once you have all of these, go back to the mountain.",
            "As you go up, you will reach a place you cannot jump to.<br/>Luckily, there are the copper boxes, which you can rope onto to get up there!",
            "As you keep moving right, you will reach a black wall.<br/>This is why you needed a diamond fist; to break the wall.",
            "Once you have broken the wall, keep moving right until you see a rocket.",
            "Now, the rocket can't power itself...<br/>here's where you use your 20 coal and blast off into space!",
            "That's the end of the tutorial and game."
            
        ],
        changePageBy: (amt) =>
        {
            buttonStuff.tutorial.page += amt;
            buttonStuff.tutorial.page = base.mathStuff.clamp(buttonStuff.tutorial.page, 0, buttonStuff.tutorial.pages.length-1);
            buttonStuff.tutorial.update();
        },
        update: () =>
        {
            document.getElementById("tutorialtxt").innerHTML = buttonStuff.tutorial.pages[buttonStuff.tutorial.page];
            document.getElementById("tutorial").style.display = buttonStuff.settings.help ? "block" : "none";
            document.getElementById("tutorialtitle").innerHTML = "Tutorial (" + (buttonStuff.tutorial.page + 1).toString() + "/" + (buttonStuff.tutorial.pages.length).toString() + ")"
            const e = document.activeElement;
            e.blur();
        }
    },

    inventoryUI: {
        update: () =>
        {
            if (!player)
            {
                return;
            }
            for (var i in Inventory.allMaterials())
            {
                var e = document.getElementById(Inventory.allMaterials()[i] + "item");
                if (e)
                {
                    e.style.display = "none";
                }
            }
            for (var i in player.inventory.content.materials)
            {
                var e = document.getElementById(i + "item");
                var l = document.getElementById(i + "amt");
                if (e)
                {
                    e.style.display = "flex";
                }
                if (l)
                {
                    l.innerHTML = i + ": " + player.inventory.content.materials[i];
                }
            }
        },

        crafting: {
            show: false,
            update: () =>
            {
                var e = document.getElementById("crafting");
                if (e)
                {
                    e.style.right = buttonStuff.inventoryUI.crafting.show ? "0" : "-500px";
                }
            },
            toggleShow: () =>
            {
                buttonStuff.inventoryUI.crafting.show = !buttonStuff.inventoryUI.crafting.show;
                buttonStuff.inventoryUI.crafting.update();
            }
        }
    },
}