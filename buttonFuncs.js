var buttonStuff = {

    paused: false,

    togglePause: () => {
        buttonStuff.paused = !buttonStuff.paused;
        buttonStuff.updatePauseMenu(buttonStuff.paused);
    },

    setPaused: (paused) => {
        buttonStuff.paused = paused;
        buttonStuff.updatePauseMenu(buttonStuff.paused);
    },

    updatePauseMenu: (isPaused) => {
        // document.getElementById("pausemenu").style.display = isPaused ? "block" : "none";
        document.getElementById("pausemenu").style.top = isPaused ? "50%" : "-50%";
    },


    settings: {
        textures: true,
        // help: false,
        dynamicTrees: true,
        dynamicWater: true,
    },

    updateSettings(updatedSettings)
    {
        for (var u in updatedSettings)
        {
            buttonStuff.settings[u] = updatedSettings[u];
        }
        this.updateSettingElements();
    },

    updateSettingElements()
    {
        for (var s in buttonStuff.settings)
        {
            var elem = document.getElementById(s + "Setting");
            if (elem)
            {
                elem.innerHTML = s + ": " + buttonStuff.settings[s];
            }
        }
    }

}