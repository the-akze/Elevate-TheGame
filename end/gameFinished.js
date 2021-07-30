var rocketImg;

var w;
var h;

var canv;

var won = true;


function setup()
{
  var e = document.getElementById("endtxt");
  if (e)
  {
    if (location.search.indexOf('lose') != -1)
    {
      e.innerHTML = "You lost...";
      won = false;
      document.title = "Elevate - You lost"
    }
    else
    {
      e.innerHTML = "You won!";
      document.title = "Elevate - You beat the game!";
    }
  }
  canv = createCanvas(windowWidth,windowHeight);

  w = windowWidth;
  h = windowHeight;
  
  rocketImg = loadImage("rocket.png");
}

function draw()
{
  
  if (won)
  {
    background(20, 20, 30);

    imageMode(CENTER);

    push();
    translate(800, 450);
    rotate(60);

    var offset = Math.sin(frameCount/30) * 100;
    image(rocketImg, 0 + offset, 100 + offset, 1000, 1000);
    pop();
  }
  else
  {
    background("skyblue");
    background(10, 0, 10, 0.8*255);
  }
//[35, 186, 113], [10, 161, 88]
    // fill(59, 84, 184);
    // stroke(34, 49, 107);
    // strokeWeight(5);
    // textSize(50);
    // text("You won!", 1000, 700);
    // strokeWeight(3);
    // textSize(30);
    // text("Click \n\"Play the game again\"\nto play again...", 1000, 750);

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
