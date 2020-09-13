const cvs =document.getElementById("break");
const ctx=cvs.getContext("2d");
cvs.style.border="1px solid blue";
ctx.lineWidth=2;
let LEVEL = 1;

var image = new Image();
if(LEVEL ==1){image.src = "images/bg2.jpg";}
else if(LEVEL==2){image.src = "images/bg3.jpg";}
else if(LEVEL==3){image.src = "images/bg1.jpg";}
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
const paddle_y = cvs.height-paddle_margin_btm - paddle_height;
let start = false;
let score = 0;
const MAX_LEVEL = 3;
let GAME_OVER = false;


const paddle={
    x : cvs.width/2-paddle_width/2,
    y : cvs.height-paddle_margin_btm - paddle_height,
    width : paddle_width,
    height : paddle_height,
    dx : 5,
    dy : 4,
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
        start = true;
    }else if(event.keyCode == 39){
        rightArrow = true;
        start = true;
    }
    else{
        start = false;
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
    start = false;
   ball.x = cvs.width/2;
   ball.y = paddle.y - ball_radius;
   ball.dx = 3*(Math.random()*2-1);
   ball.dy = -3;
   paddle.x = cvs.width/2-paddle_width/2;
   paddle.y = cvs.height-paddle_margin_btm - paddle_height;
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

        paddle.y+=paddle.dy;
        
    }
    else{
        paddle.y=paddle_y;
    }
}

const brick = {
    row : 5,
    column : 4,
    gap : 15,
    width : 60,
    height : 18,
    leftMargin : 18,
    topMargin : 30,
    fillColor : "rgb(219, 121, 55)",
    strokeColor : "purple",
} 

let bricks = [];

function createBricks(){
    for(let r=0;r<brick.row;r++)
    {
        bricks[r]=[];
        for(let c=0;c<brick.column;c++)
        {
            bricks[r][c]={
                x :brick.leftMargin + r*(brick.width+brick.gap),
                y :brick.topMargin+c*(brick.height+brick.gap),
                status : true,
        }   }
    }
}
createBricks();

function drawBricks()
{
    for(let r=0;r<brick.row;r++)
    {
        for(let c=0;c<brick.column;c++)
        {
            if(bricks[r][c].status)
            {
                ctx.fillStyle=brick.fillColor;
                ctx.fillRect(bricks[r][c].x,bricks[r][c].y,brick.width,brick.height);

                ctx.strokeStyle=brick.strokeColor;
                ctx.strokeRect(bricks[r][c].x,bricks[r][c].y,brick.width,brick.height);

            }    
        }
    }
}
function ballBrickCollision()
{
    for(let r=0;r<brick.row;r++)
    {
        for(let c=0;c<brick.column;c++)
        {
            let b=bricks[r][c];
            if(b.status)
            if(ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height)
            {     
            
                ball.dx=-ball.dx;
                ball.dy=-ball.dy;
                b.status=false;
                score += 5; 
            }  
        }
    }
}


function draw()
{
  drawPaddle();

  drawBall();
  drawBricks();
}

function gameOver(){
    if(life <= 0){
        showYouLose();
        GAME_OVER = true;
    }
}

function levelUp(){
    let isLevelDone = true;
    
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            isLevelDone = isLevelDone && ! bricks[r][c].status;
        }
    }
    
    if(isLevelDone){
        
        if(LEVEL >= MAX_LEVEL){
            showYouWin();
            GAME_OVER = true;
            return;
        }
        brick.column++;
        createBricks();
        ball.speed += 2;
        resetBall();
        LEVEL++;
    }
}

function update()
{
  movePaddle();

  if(start){

  moveBall();}

  ballWallCollision();

  ballPaddleCollision();
  ballBrickCollision();

  levelUp();
  gameOver();
  
}

function loop()
{
    drIMAGE(ctx,image);

    draw();

    update();

    document.getElementById("score").innerHTML=score;

    if(!GAME_OVER){requestAnimationFrame(loop);}
}
loop();

const gameover = document.getElementById("gameover");
const restart = document.getElementById("restart");


restart.addEventListener("click", function(){
    location.reload(); 
})

function showYouWin(){
    gameover.style.display = "block";
}

// SHOW YOU LOSE
function showYouLose(){
    gameover.style.display = "block";
}

