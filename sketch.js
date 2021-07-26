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
        loadImage("assets/player/pi1.png")
      ],
      walking:
      [
        loadImage("assets/player/pw1.png"),
        loadImage("assets/player/pw2.png"),
        loadImage("assets/player/pw3.png"),
        loadImage("assets/player/pw4.png"),
        loadImage("assets/player/pw5.png"),
        loadImage("assets/player/pw6.png"),
      ],
      punch:
      [
        // loadImage("assets/player/swing1.png"),
        loadImage("assets/player/swing2.png"),
        loadImage("assets/player/swing3.png"),
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
        loadImage("assets/nature/cotton/cotton3.png"),
        loadImage("assets/nature/cotton/cotton4.png"),
        loadImage("assets/nature/cotton/cotton5.png"),
      ],
      sky:
      [
        // loadImage("assets/nature/sky/sky.jpg")
        loadImage("assets/nature/sky/sky.png")
      ],
      trees:
      [
        loadImage("assets/nature/trees/tree1.png"),
        loadImage("assets/nature/trees/tree2.png"),
        loadImage("assets/nature/trees/tree3.png"),
      ]
    },
    textures:
    [
      loadImage("assets/textures/graphene.png"),
      loadImage("assets/textures/grass.png"),
      loadImage("assets/textures/stone.png"),
      loadImage("assets/textures/diamond.png"),
      loadImage("assets/textures/iron.png"),
      loadImage("assets/textures/coal.png"),
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
    materialIcons:
    {
      stone: loadImage("assets/materialIcons/stone.png"),
      iron: loadImage("assets/materialIcons/iron.png"),
      coal: loadImage("assets/materialIcons/coal.png"),
      // copper: loadImage("assets/materialIcons/copper.png"),
      diamond: loadImage("assets/materialIcons/diamond.png"),
      cotton: loadImage("assets/materialIcons/cotton.png"),
      wood: loadImage("assets/materialIcons/wood.png"),
    },

    audio:
    {
      soundEffects:
      {
        woodHit: loadSound("assets/audio/soundEffects/woodHit.ogg"),
        stoneHit: loadSound("assets/audio/soundEffects/stoneHit.ogg"),
        ironHit: loadSound("assets/audio/soundEffects/ironHit.ogg"),
        copperHit: loadSound("assets/audio/soundEffects/copperHit.ogg"),
      }
    }
  };
}

function setup()
{
  buttonStuff.updateSettingElements();
  buttonStuff.tutorial.update();

  for (var i in Inventory.allMaterials())
  {
    var e = document.getElementById(Inventory.allMaterials()[i] + "icon");
    if (e)
    {
      e.style.backgroundImage = "url('assets/materialIcons/" + Inventory.allMaterials()[i] + ".png')";
    }
    var l = document.getElementById(Inventory.allMaterials()[i] + "amt");
    if (l)
    {
      l.innerHTML = Inventory.allMaterials()[i];
    }
  }

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
  layers.mineMidLand = new Ground(-6400, 700, 2500, 50, "green", base.assets.textures[1]);
  
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
  player = new Player(1000, 500, 40*1.6, 70*1.6, playerInfo, "blue", base.assets.player.idle[0]);
  // player = new Player(-5200, 400, 40*2, 70*2, playerInfo, "blue", base.assets.player.idle[0]);

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
    cottons.push(new Cotton(i, 675));
  }

  new Ropable(300, -100);
  new Ropable(-4800, 500)
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

  // var cd = base.mathStuff.clamp(darkness, 1, 10);
  // background(135/cd, 206/cd, 235/cd);

  background(base.assets.nature.sky[0]);

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

/* TODO

- IN-GAME:

  - Shorten words of tutorial.
  - Change grass image.
  - Show materials on screen.
    - Change inventory UI.
  - fps setting
  - Fix memory bug
  - Rope hook
  - person swimming animation
  - tool in hand
  - better bg
  - 

- Home page:
  - 


*/