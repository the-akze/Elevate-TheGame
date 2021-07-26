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
        soundEffects: true
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
    },

    tutorial: {
        page: 0,
        pages: [
            "Welcome to the game, Elevate. To continue with the tutorial, click the NEXT button. To close the tutorial, disable help in the settings. To access the settings, click the gear icon at the top right.",
            "Use WASD or Arrow Keys to move.",
            "Use the space key to mine. Point your cursor in the direction of a minable object and hold down space to mine it.",
            "Use the E key or the backpack button at the top right to view your inventory to see what materials you have, as well as how to craft various tools.",
            "Start with breaking down the three trees at the beginning.",
            "You need 5 wood to make a wooden club. Go swim across the lake to find more land and trees.",
            
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
}