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
var lakes = [];
var trees = [];
var cottons = [];
var grapheneWall;
var rocket;

var zoom = 0.7;

var paused;

var darkness = 1;

var w;
var h;

var canv;

function preload()
{
  base.assets =
  {
    player:
    {
      idle:
      [
        loadImage("assets/player/idle.svg")
      ],
      walking:
      [
        loadImage("assets/player/walk1.svg"),
        loadImage("assets/player/walk2.svg"),
        loadImage("assets/player/walk3.svg"),
        loadImage("assets/player/walk4.svg"),
        loadImage("assets/player/walk5.svg"),
        loadImage("assets/player/walk6.svg"),
      ]
    },
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
      loadImage("assets/textures/graphene.png"),
      loadImage("assets/textures/grass.png"),
      loadImage("assets/textures/stone.png"),
      loadImage("assets/textures/diamond.png"),
      loadImage("assets/textures/iron.png"),
      loadImage("assets/textures/coal.png")
    ],
    trees:
    [
      loadImage("assets/trees/tree1.svg"),
      loadImage("assets/trees/tree2.svg"),
      loadImage("assets/trees/tree3.svg"),
      loadImage("assets/trees/tree4.svg"),
    ],
    rocket:
    [
      loadImage("assets/rocket/rocketShip.png"),
      loadImage("assets/rocket/rocketFly.png")
    ],

    audio:
    {
      soundEffects:
      {
        woodHit: loadSound("assets/audio/soundEffects/woodHit.ogg"),
        stoneHit: loadSound("assets/audio/soundEffects/stoneHit.ogg"),
        ironHit: loadSound("assets/audio/soundEffects/ironHit.ogg"),
      }
    }
  };
}

function setup()
{
  buttonStuff.updateSettingElements();

  checkToResizeCanvas();

  w = windowWidth;
  h = windowHeight;

  engine = Engine.create();
  world = engine.world;

  layers.grass = new Ground(20000, 800, 39400, 400, "green", base.assets.textures[1]);
  layers.stone = new Stone(20000, 1850, 39400, 1700);
  layers.coal = new Coal(20000, 3900, 39400, 2400);
  layers.iron = new Iron(-800, 7600, 2200, 7000);

  layers.landLeft1 = new Ground(-3400, 900, 3000, 400, "green", base.assets.textures[1]);
  layers.landLeft2 = new Ground(-8900, 900, 2000, 400, "green", base.assets.textures[1]);
  layers.stoneLeft1 = new Stone(-3400, 3100, 3000, 4000);
  layers.stoneLeft2 = new Stone(-8900, 3100, 2000, 4000);
  layers.mineMidLand = new Ground(-6400, 750, 2500, 100, "green", base.assets.textures[1]);
  
  var its = 1;
  var y = 5700;
  var offset = 1476;
  while (offset >= 1475 - 50*5)
  {
    y += 35;
    // layers["mineStone" + its] = new Stone(-6400 - offset, y, 50, 10000);
    layers["mineStone" + (its+1)] = new Stone(-6400 + offset, y, 50, 10000);
    its += 2;
    offset -= 49
  }
  offset -= 1;
  its = 1;
  while (offset >= 1475 - 50*10)
  {
    y += 35;
    // layers["mineIron" + its] = new Iron(-6400 - offset, y, 50, 10000);
    layers["mineIron" + (its+1)] = new Iron(-6400 + offset, y, 50, 10000);
    its += 2;
    offset -= 49
  }
  offset -= 1;
  its = 1;
  while (offset >= 1475 - 50*18)
  {
    y += 35;
    // layers["mineCoal" + its] = new Coal(-6400 - offset, y, 50, 10000);
    layers["mineCoal" + (its+1)] = new Coal(-6400 + offset, y, 50, 10000);
    its += 2;
    offset -= 49
  }
  offset -= 1;
  its = 1;
  while (offset > 1475 - 50*22)
  {
    y += 35;
    // layers["mineDiamond" + its] = new Diamond(-6400 - offset, y, 50, 10000);
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
  player = new Player(1000, 500, 40, 70, playerInfo, "blue", base.assets.player.idle[0]);

  //that big mountain to the right
  mountain = new Mountain("gray", 300, 5);

  //the lake to the left of spawn
  lakes.push(new WaterBody(-800, 2400, 2200, 3400, 80));

  //lake in the cave
  lakes.push(new WaterBody(-6965, 3220, 1870, 3400, 80));

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

  //Message at the beginning
  new GameMessage("WASD/Arrows to move, space to mine.\nE to view inventory and use the\ncorresponding number to craft\nsomething.\nUse your resources to get to the top of\nthe mountain and fly away in the rocket!\n\n[TIP: If your game is running slow,\ntry clicking the settings button\n in the top left and experimenting\nwith the settings.]", [200, 200, 200], [50, 50, 50], 600);
}

function draw()
{
  if (buttonStuff.paused)
  {
    return;
  }
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

  camera.zoom = zoom*height/900;
  
  player.play();
  if (rocket && rocket.hasCoal)
  {
    rocket.fly();
  }
  else
  {
    player.cameraMove(0.1);
  }

  displayAll();

  //zooming
  // base.gameStuff.doZoom(30/29, 0.7);

  checkToResizeCanvas();
  
  document.getElementById("fpsText").innerHTML = Math.round(getFrameRate()*10)/10 + "FPS";
}

function displayAll()
{
  mainMountain.display();
  mountain.display();
  for (var b in allBodyItems)
  {
    allBodyItems[b].display();
  }
  for (var t in allTrees)
  {
    allTrees[t].swayLeaves();
    allTrees[t].display();
  }
  drawSprites();
  for (var w in allWaterBodies)
  {
    allWaterBodies[w].display();
    allWaterBodies[w].dynamicWater(0.1, 0.01, 0.1);
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
    var w_ = windowWidth;
    var h_ = windowHeight;

    if (w_ > h_ * 2.2)
    {
      w_ = h_ * 2.2;
    }

    canv = createCanvas(w_, h_);

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

function screenshotInNewTab()
{
  var l = canvas.toDataURL("image/png");
  var win = window.open();
  win.document.write(`
  
  <img src='` + l + `' style="max-width:100vw; max-height: 100vh;"/>

  <style>
    * {
      font-family: Arial, Helvetica, sans-serif;
    }

    body, html {
      margin: 0;
    }

    .txt {
      position: fixed;
      right: 0;
      top: 0;
      margin: 20px;
    }
  </style>

  <h1 class="txt">
    Right click the image to save/copy.
  </h1>
  `);
}