const cvs =document.getElementById("break");
const ctx=cvs.getContext("2d");
cvs.style.border="1px solid blue";
ctx.lineWidth=2;

var image = new Image();
image.src = "images/bg.jpg";
function drIMAGE(ctx,image){
    if(!image.complete){
        setTimeout(function(){
            draw(ctx,image);
        },50);
        return;
    }
    ctx.drawImage(image ,0,0,400,500);
}

const paddle_width = 100;
const paddle_margin_btm = 40;
const paddle_height = 10;
let leftArrow = false;
let rightArrow = false;
const ball_radius = 6;
let life = 3;

const paddle={
    x : cvs.width/2-paddle_width/2,
    y : cvs.height-paddle_margin_btm - paddle_height,
    width : paddle_width,
    height : paddle_height,
    dx : 5,
}

function drawPaddle()
{
    ctx.fillStyle="black";
    ctx.fillRect(paddle.x,paddle.y,paddle.width,paddle.height);
    
    ctx.strokeStyle="#ffcd05";
    ctx.strokeRect(paddle.x,paddle.y,paddle.width,paddle.height);
}

document.addEventListener("keydown", function(event){
    if(event.keyCode == 37){
        leftArrow = true;
    }else if(event.keyCode == 39){
        rightArrow = true;
    }
 });
 document.addEventListener("keyup", function(event){
    if(event.keyCode == 37){
        leftArrow = false;
    }else if(event.keyCode == 39){
        rightArrow = false;
    }
 });
 
 function movePaddle(){
     if(rightArrow && paddle.x + paddle.width < cvs.width){
         paddle.x += paddle.dx;
     }else if(leftArrow && paddle.x > 0){
         paddle.x -= paddle.dx;
     }
 }
 
const ball = {
    x : cvs.width/2,
    y : paddle.y - ball_radius,
    speed : 4,
    radius : ball_radius,
    dx : 3*(Math.random()*2-1),
    dy : -3
}

function drawBall(){
    ctx.beginPath();

    ctx.arc(ball.x,ball.y,ball.radius,0,2*Math.PI);
    ctx.fillStyle = "wheat";
    ctx.fill();
    ctx.strokeStyle = "#2e3548";
    ctx.stroke();

    ctx.closePath();
}

function moveBall(){
    ball.x+=ball.dx;
    ball.y+=ball.dy;
}

function ballWallCollision(){
    if(ball.x+ball.radius>cvs.width||ball.x-ball.radius<0){
        ball.dx=-ball.dx;
    }
    if( ball.y-ball.radius<0){
        ball.dy=-ball.dy;
    }
    if(ball.y-ball.radius>cvs.height){
        life--;
        resetBall();
    }
}

function resetBall(){
   ball.x = cvs.width/2;
   ball.y = paddle.y - ball_radius;
   ball.dx = 3*(Math.random()*2-1);
   ball.dy = -3;
}

function ballPaddleCollision()
{
    if(ball.x - ball.radius < paddle.x + paddle.width && ball.x + ball.radius> paddle.x && ball.y + ball.radius > paddle.y && ball.y -
         ball.radius < paddle.y)
    {     
          let cldPoint= ball.x- (paddle.x + paddle.width/2);
          cldPoint = cldPoint / (paddle.width/2);
          
           let angle = cldPoint*Math.PI/3;

        ball.dx=ball.speed * Math.sin(angle);
        ball.dy=-ball.speed * Math.cos(angle);
        
    }
}
function draw()
{
  drawPaddle();

  drawBall();
}

function update()
{
  movePaddle();

  moveBall();

  ballWallCollision();

  ballPaddleCollision();
}

function loop()
{
    drIMAGE(ctx,image);
   // ctx.clearRect(0, 0, 400, 500);

    draw();

    update();

    requestAnimationFrame(loop);
}
loop();