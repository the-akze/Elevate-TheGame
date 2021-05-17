if (document.location.host == "ayy-akshat.github.io")
{
  if (document.referrer != "https://ayy-akshat.github.io/Elevate-TheGame/")
  {
    window.location.replace("..");
  }
}

var rocketImg, youWonImg;

var w;
var h;

var canv;

function setup()
{
  canv = createCanvas(windowWidth,windowHeight);

  w = windowWidth;
  h = windowHeight;
  
  rocketImg = loadImage("rocket.png");
  youWonImg = loadImage("youWon.png");
}

function draw()
{
    background(20, 20, 30);

    imageMode(CENTER);

    push();
    translate(800, 450);
    rotate(60);

    var offset = Math.sin(frameCount/30) * 100;
    image(rocketImg, 0 + offset, 100 + offset, 1000, 1000);
    pop();
//[35, 186, 113], [10, 161, 88]
    fill(59, 84, 184);
    stroke(34, 49, 107);
    strokeWeight(5);
    textSize(50);
    text("You won!", 1000, 700);
    strokeWeight(3);
    textSize(30);
    text("Go back to the game to play again...", 1000, 750);

    camera.zoom = height/900;

    checkToResizeCanvas();
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
