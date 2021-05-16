var allBodyItems = [];

var allGrounds = [];

var allMtnParts = [];

var allTrees = [];

var allWaterBodies = [];

var allMinable = [];

var allCotton = [];

var allRopable = [];

var allNotifications = [];

var mainMountain = null;

var voidY = 3000;

var base = {};
base.mathStuff = {};
base.renderStuff = {};
base.gameStuff = {};
base.assets = {};

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

base.renderStuff.progressBar = (x1, y1, x2, y2, barColor, bgColor, value) =>
{
    push();
    noStroke();
    rectMode(CORNERS);
    fill(bgColor);
    rect(x1, y1, x2, y2);
    fill(barColor);
    rect(x1, y1, lerp(x1, x2, value), y2);
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