var allBodyItems = [];

var allGrounds = [];

var allMtnParts = [];

var allTrees = [];

var voidY = 3000;

function displayBody(body, color)
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

function displayVertices(vertices, color)
{
    push();
    noStroke();
    fill(color);
    beginShape();
    for (var v in vertices)
    {
        vertex(vertices[v].x, vertices[v].y);
    }
    endShape(CLOSE);
    pop();
}

function clamp(value, min, max)
{
    return ((value > max) ? (max) : ((value < min) ? (min) : (value)));
}

//commented because unused

// function moveTowards(from, to, step)
// {
//     if (from + step < from)
//     {
//         if (from + step < to)
//         {
//             return to;
//         }
//     }
//     if (from + step > from)
//     {
//         if (from + step > to)
//         {
//             return to;
//         }
//     }
//     return from + step;
// }

function normalize(x, y)
{
    var magnitude = Math.sqrt((x*x) + (y*y));
    return {x: x/magnitude, y: y/magnitude};
}

function angleToVector(angle)
{
    return {
        x: -Math.sin(angle),
        y: -Math.cos(angle)
    };
}