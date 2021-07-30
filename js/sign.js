class Sign
{
    constructor(x, y, message)
    {
        allSigns.push(this);
        this.x = x;
        this.y = y;
        this.message = message;
        this.sprite = createSprite(x, y-50, 100, 100); // just a hitbox for detecting if you are near a sign
        this.sprite.visible = false;
    }

    display()
    {
        push();
        translate(this.x, this.y);
        imageMode(CENTER);
        image(base.assets.sign[0], 0, -50, 100, 100);
        pop();
    }

    static setSign(message)
    {
        var signElement = document.getElementById("signcontainer");
        if (signElement)
        {
            signElement.style.display = "block";
        }
        var m = document.getElementById("signMessage");
        if (m)
        {
            m.innerHTML = message;
        }
    }

    static hideSign()
    {
        var signElement = document.getElementById("signcontainer");
        if (signElement)
        {
            signElement.style.display = "none";
        }
    }
}