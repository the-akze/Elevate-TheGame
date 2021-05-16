const
Engine = Matter.Engine,
World = Matter.World,
Bodies = Matter.Bodies,
Events = Matter.Events,
Constraint = Matter.Constraint;

var engine, world;

var player;
var layers = {};
var mountain;
var lake;
var trees = [];
var cottons = [];
var grapheneWall;
var rocket;

const defaultZoom = 0.6;
var zoom = defaultZoom;
var lerpZoom = zoom;

var paused;

var darkness = 1;

var w;
var h;

var canv;

function preload()
{
  base.assets =
  {
    // player:
    // {

    // },
    // svgs:
    // [

    // ],
    tools:
    [
        loadImage("assets/tools/woodClub.png"),
        loadImage("assets/tools/stoneClub.png"),
        loadImage("assets/tools/ironClub.png"),
        loadImage("assets/tools/bronzeClub.png"),
        loadImage("assets/tools/diamondClub.png")
    ],
    nature:
    {
      cotton:
      [
        loadImage("assets/nature/cotton/cotton1.png"),
        loadImage("assets/nature/cotton/cotton2.png"),
        loadImage("assets/nature/cotton/cotton3.png")
      ]
    },
    textures:
    [
      loadImage("assets/textures/graphene.png")
    ],
    rocket:
    [
      loadImage("assets/rocket/rocketShip.png"),
      loadImage("assets/rocket/rocketFly.png")
    ]
  };
}

function setup()
{
  canv = createCanvas(windowWidth,windowHeight);

  w = windowWidth;
  h = windowHeight;

  engine = Engine.create();
  world = engine.world;

  layers.grass = new Ground(20000, 800, 39400, 400, "green");
  layers.stone = new Stone(20000, 1600, 39400, 1200);
  layers.coal = new Coal(20000, 2800, 39400, 1200);
  layers.stoneLow = new Stone(20000, 7200, 39400, 7600);
  layers.iron = new Iron(-800, 7600, 2200, 7000);

  layers.landLeft1 = new Ground(-3400, 900, 3000, 400, "green");
  layers.landLeft2 = new Ground(-8900, 900, 2000, 400, "green");
  layers.stoneLeft1 = new Stone(-3400, 6100, 3000, 10000);
  layers.stoneLeft2 = new Stone(-8900, 6100, 2000, 10000);
  layers.mineMidLand = new Ground(-6400, 750, 2500, 100, "green");
  
  var its = 1;
  var y = 5700;
  var offset = 1476;
  while (offset >= 1475 - 50*10)
  {
    y += 35;
    layers["mineStone" + its] = new Stone(-6400 - offset, y, 50, 10000);
    layers["mineStone" + (its+1)] = new Stone(-6400 + offset, y, 50, 10000);
    its += 2;
    offset -= 49
  }
  offset -= 1;
  its = 1;
  while (offset >= 1475 - 50*16)
  {
    y += 35;
    layers["mineIron" + its] = new Iron(-6400 - offset, y, 50, 10000);
    layers["mineIron" + (its+1)] = new Iron(-6400 + offset, y, 50, 10000);
    its += 2;
    offset -= 49
  }
  offset -= 1;
  its = 1;
  while (offset >= 1475 - 50*24)
  {
    y += 35;
    layers["mineCoal" + its] = new Coal(-6400 - offset, y, 50, 10000);
    layers["mineCoal" + (its+1)] = new Coal(-6400 + offset, y, 50, 10000);
    its += 2;
    offset -= 49
  }
  offset -= 1;
  its = 1;
  while (offset > 0)
  {
    y += 35;
    layers["mineDiamond" + its] = new Diamond(-6400 - offset, y, 50, 10000);
    layers["mineDiamond" + (its+1)] = new Diamond(-6400 + offset, y, 50, 10000);
    its += 2;
    offset -= 49
  }

  var playerInfo = 
  {
    moveSpeed: 5,
    jumpStrength: -50
  }
  //the one and only player character
  player = new Player(1000, 500, 40, 70, playerInfo, "blue");

  //that big mountain to the right
  mountain = new Mountain("gray", 300, 5);

  //the lake to the left of spawn
  lake = new WaterBody(-800, 2400, 2200, 3400, 80);

  trees.push(new Tree(500, 600, 50, random(400, 700)));
  trees.push(new Tree(1200, 600, 50, random(400, 700)));
  trees.push(new Tree(1600, 600, 50, random(400, 700)));

  for (var i = -2000; i >= -4800; i -= random(300, 600))
  {
    trees.push(new Tree(i, 700, 50, random(350, 600)));
  }

  for (var i = -5200; i >= -7500; i -= random(20, 40))
  {
    cottons.push(new Cotton(i, 700));
  }

  new Ropable(300, -100);
  new Ropable(-4800, 500)

  new GameMessage("WASD/Arrows to move, space to mine.\nE to view inventory and use the\ncorresponding number to craft\nsomething.\nUse your resources to get to the top of\nthe mountain and fly away in the rocket!", [200, 200, 200], [50, 50, 50], 300);
}

function draw()
{
  if (frameCount < 10)
  {
    player.cameraMove(1);
  }
  if (!paused)
  {
    Engine.update(engine);
  }

  var cd = base.mathStuff.clamp(darkness, 1, 10);
  background(135/cd, 206/cd, 235/cd);

  zoom = base.mathStuff.clamp(zoom, 0.4, 1);
  lerpZoom = lerp(lerpZoom, zoom, 0.2);

  camera.zoom = lerpZoom*height/900;
  
  player.play();
  if (rocket)
  {
    if (!rocket.hasCoal)
    {
      player.cameraMove(0.1);
    }
    else
    {
      rocket.fly();
    }
  }
  else
  {
    player.cameraMove(0.1);
  }

  displayAll();

  //zooming
  base.gameStuff.doZoom(30/29, defaultZoom);

  checkToResizeCanvas();
}

function displayAll()
{
  for (var b in allBodyItems)
  {
    allBodyItems[b].display();
  }
  mainMountain.display();
  mountain.display();
  drawSprites();
  for (var w in allWaterBodies)
  {
    allWaterBodies[w].display();
    allWaterBodies[w].dynamicWater(0.1, 0.01, 0.1);
  }
  for (var t in allTrees)
  {
    allTrees[t].swayLeaves();
  }
  for (var m = 0; m < allMinable.length; m++)
  {
    if (allMinable[m].broken)
    {
      delete allMinable[m];
      allMinable.splice(m, 1);
      m--;
    }
  }
  for (var c = 0; c < allCotton.length; c++)
  {
    if (allCotton[c].broken)
    {
      delete allCotton[c];
      allCotton.splice(c, 1);
      c--;
    }
  }
  player.drawStats();
  player.displayMinableMiningHealth();
  for (var n = 0; n < allNotifications.length; n++)
  {
    allNotifications[n].display();
    if (allNotifications[n].lifetime <= 0)
    {
      delete(allNotifications[n]);
      allNotifications.splice(n, 1);
      n--;
    }
  }
  player.showInventory();
}

function checkToResizeCanvas()
{
  if (windowWidth != w || windowHeight != h)
  {
    createCanvas(windowWidth, windowHeight);
    w = windowWidth;
    h = windowHeight;
  }
}

function debugging()
{
  var d = false;
  if (keyDown("h"))
  {
    camera.x += 10 / zoom;
    d = true;
  }
  if (keyDown("f"))
  {
    camera.x -= 10 / zoom;
    d = true;
  }
  if (keyDown("t"))
  {
    camera.y -= 10 / zoom;
    d = true;
  }
  if (keyDown("g"))
  {
    camera.y += 10 / zoom;
    d = true;
  }
  if (keyDown("x"))
  {
    d = true;
  }
  return d;
}