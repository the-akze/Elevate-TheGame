const
Engine = Matter.Engine,
World = Matter.World,
Bodies = Matter.Bodies,
Events = Matter.Events;

var engine, world;

var player;
var ground;
var mountain;

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
  mountain = new Mountain(0, 0, "gray");

  // camera.zoom = 5;
}

function draw()
{
  Engine.update(engine);

  background("skyblue");

  // camera.zoom = height/900;
  camera.zoom = 0.5;;
  
  player.play();
  player.cameraMove(0.1);

  for (var b in allBodyItems)
  {
    allBodyItems[b].display();
  }

  mountain.display();

  if (keyDown("k"))
  {
    mountain.generateVertices();
  }

  drawSprites();

  push();
  fill("maroon");
  textSize(50);
  textAlign(CENTER);
  text("This game is a work in progress...\nMore will be added soon.", camera.x, camera.y - 200);
  pop();
}