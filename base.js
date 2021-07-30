var allBodyItems = [];

var allGrounds = [];

var allGrass = [];

var allMtnParts = [];

var allTrees = [];

var allWaterBodies = [];

var allMinable = [];

var allCotton = [];

var allRopable = [];

var allNotifications = [];

var allSigns = [];

var focusedSignMsg = "";

var mainMountain = null;

var voidY = 3000;

var base = {};
base.mathStuff = {};
base.renderStuff = {};
base.gameStuff = {};
base.assets = {};
base.htmlStuff = {};

base.renderStuff.displayBody = (body, color) =>
{
    push();
    noStroke();
    fill(color);
    beginShape();
    for (var i in body.vertices)
    {
        vertex(body.vertices[i].x, body.vertices[i].y);
    }
    endShape(CLOSE);
    pop();
}

base.renderStuff.progressBar = (x1, y1, x2, y2, barColor, bgColor, value, txt, textColor, shakeBelow, shakeMagnitude) =>
{
    push();
    noStroke();
    rectMode(CORNERS);
    fill(bgColor);

    var offset = {x: 0, y: 0};
    if (shakeBelow)
    {
        if (value < shakeBelow)
        {
            var mag = shakeMagnitude ? shakeMagnitude : 5;
            offset = base.mathStuff.normalize(random(-1, 1), random(-1, 1), mag);
        }
    }

    rect(x1 + offset.x, y1 + offset.y, x2 + offset.x, y2 + offset.y);
    fill(barColor);
    rect(x1 + offset.x, y1 + offset.y, lerp(x1 + offset.x, x2 + offset.x, value), y2 + offset.y);

    if (txt)
    {
        fill(textColor);
        textAlign(CENTER);
        textSize(12);
        text(txt, (x1 + offset.x + x2 + offset.x)/2, (y1 + offset.y + y2 + offset.y)/2 + 4);
    }

    pop();
}

base.mathStuff.clamp = (value, min, max) =>
{
    return ((value > max) ? (max) : ((value < min) ? (min) : (value)));
}

base.mathStuff.normalize = (x, y, newMagnitude) =>
{
    var magnitude = Math.sqrt((x*x) + (y*y));
    return {x: newMagnitude * x/magnitude, y: newMagnitude * y/magnitude};
}

base.mathStuff.angleToVector = (angle) =>
{
    return {
        x: -Math.sin(angle),
        y: -Math.cos(angle)
    };
}

base.mathStuff.toDirection = (x) =>
{
    return ((x > 0) ? 1 : ((x < 0) ? -1 : 0));
}

base.mathStuff.magnitude = (x, y) =>
{
    return Math.sqrt((x*x) + (y*y));
}

base.gameStuff.doZoom = (increase, defaultZoom) =>
{
    if (keyDown("o"))
    {
        zoom *= 1/increase;
    }
    if (keyDown("p"))
    {
        zoom *= increase;
    }
    if (keyDown("l"))
    {
        zoom = defaultZoom;
    }
}

base.htmlStuff.quickDuplicateElement = (element, removeId) =>
{
    var e = element.cloneNode(true);
    element.parentElement.appendChild(e);
}