const cvs =document.getElementById("break");
const ctx=cvs.getContext("2d");
cvs.style.border="1px solid blue";
ctx.lineWidth=3;

const paddle_width = 100;
const paddle_margin_btm = 50;
const paddle_height = 20;
let left_arrow = false;
let right_arrow = false;
const paddle={
    x : cvs.width/2-paddle_width/2,
    y : cvs.height-paddle_margin_btm-paddle_height,
    width : paddle_width,
    height : paddle_height,
    dx : 5,
}
function drawPaddle()
{
    ctx.fillstyle="black";
    ctx.fillRect(paddle.x,paddle.y,paddle.width,paddle.height);
    
    ctx.strokeStyle="#ffcd05";
    ctx.strokeRect(paddle.x,paddle.y,paddle.width,paddle.height);
}

document.addEventListener("keydown", function(event){
    if(event.keycode == 37){
        left_arrow=true;
    }
    else if(event.keycode == 39){
        right_arrow=true;
    }
});
document.addEventListener("keyup", function(event){
    if(event.keycode == 37){
        left_arrow=false;
    }
    else if(event.keycode == 39){
        right_arrow=false;
    }
});

function move_paddle(){
    if(right_arrow){
        paddle.x += paddle.dx;
    }
    else if(left_arrow){
        paddle.x -= paddle.dx;
    }
}
function draw()
{
  drawPaddle();
}

function update()
{
  move_paddle();
}

function loop()
{
    ctx.clearRect(0, 0, 400, 500);

   draw();

    update();

    requestAnimationFrame(loop);
}
loop();