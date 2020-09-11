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