const
Engine = Matter.Engine,
World = Matter.World,
Bodies = Matter.Bodies,
Events = Matter.Events;

var engine, world;

var player;
var ground;
var mountain;

const defaultZoom = 0.8;
var zoom = 0.5;
var lerpZoom = zoom;

function setup()
{
  createCanvas(windowWidth,windowHeight);

  engine = Engine.create();
  world = engine.world;

  ground = new Ground(800, 800, 1600, 200, "green");
  var playerInfo = 
  {
    moveSpeed: 5,
    jumpStrength: -50
  }
  player = new Player(800, 500, 40, 70, playerInfo, "blue");
  // mountain = new Mountain(7000, 835, "gray");
  mountain = new Mountain("gray", 300, 5);

  // camera.zoom = 0.02;
}

function draw()
{
  Engine.update(engine);

  background("skyblue");
  
  lerpZoom = lerp(lerpZoom, zoom, 0.2);

  camera.zoom = lerpZoom*height/900;
  
  player.play();
  player.cameraMove(0.1);

  for (var b in allBodyItems)
  {
    allBodyItems[b].display();
  }

  mountain.display();

  if (keyDown("k"))
  {
    mountain.generateMountain();
  }

  if (keyDown("o"))
  {
    zoom *= 29/30;
  }
  if (keyDown("p"))
  {
    zoom *= 30/29;
  }
  if (keyDown("l"))
  {
    zoom = defaultZoom;
  }

  drawSprites();

  push();
  fill("maroon");
  textSize(50);
  textAlign(CENTER);
  text("This game is a work in progress...\nMore will be added soon.", camera.x, camera.y - 200);
  
  textSize(30);
  text("WASD or arrow keys to move, O and P to zoom, L to reset zoom.", camera.x, camera.y + 200);
  pop();
}