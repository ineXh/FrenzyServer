var ScreenPos = {left: 0, right:0, top:0, bot:0};
var stage_scale = 1;
var getScreenPos = function(){
    ScreenPos.left = -stage.x;
    ScreenPos.right = -stage.x + width/stage.scale.x;
    ScreenPos.top = -stage.y;
    ScreenPos.bot = -stage.y + height/stage.scale.y;
}
// assume stage is parent
var onScreen = function(container){
    //if(!(container instanceof PIXI.Container)) return true;
    //if((container instanceof Path)) return true;
    if(container._class  == 'path') return true;
    setBorder(container);

    var left = container.right < ScreenPos.left - width*0.2;
    var right = container.left > ScreenPos.right + width*0.2;
    var top = container.bot < ScreenPos.top - height*0.2;
    var bot = container.top > ScreenPos.bot + height*0.2;

    //console.log("right " + right);
    //console.log("left " + left);
    //console.log("bot " + bot);
    //console.log("top " + top);
    return !( right || left || bot || top);
}
var setBorder = function(container){

    container.left = container.x;
    container.right = container.x + container.width;
    container.top = container.y;
    container.bot = container.y + container.height;
    /*for(var i = 0; i < container.children.length; i++){
        if((container.children[i] instanceof PIXI.Container)){
            setBorder(container.children[i]);
            if(container.children[i].left < container.left)
                container.left = container.children[i].left;
            if(container.children[i].right > container.right)
                container.right = container.children[i].right;
            if(container.children[i].top < container.top)
                container.top = container.children[i].top;
            if(container.children[i].bot > container.bot)
                container.bot = container.children[i].bot;
        }
    }*/
} // end setBorder
var visiblecount = 0;
var visibletime = 30;
var visibleCheck = function(){
    visiblecount++;
     if(visiblecount%visibletime == 0){
        visiblecount = 0;
        //console.log('visible check')
        getScreenPos();
        for(var i = 0; i < stage.children.length; i++){
            if(!onScreen(stage.children[i])) stage.children[i].visible = false;
            else stage.children[i].visible = true;
        }
    }
} // end visibleCheck
var panCenter = function(){
    /*if(center != undefined){
        if(center.x > (-stage.x + width/2 + scope_width)){
            stage.x = -(center.x - width/2 - scope_width);
        }
        if(center.x < (-stage.x + width/2 - scope_width)){
            stage.x = -(center.x - width/2 + scope_width);
        }
        if(center.y > (-stage.y + height/2 + scope_height)){
            stage.y = -(center.y - height/2 - scope_height);
        }
        if(center.y < (-stage.y + height/2 - scope_height)){
            stage.y = -(center.y - height/2 + scope_height);
        }
    }*/
    //if(gamestate == GameState.InPlay){
      //  pan();
    //}
} // end panCenter
var panning = false;
var pan_sx = 0;
var pan_sy = 0;
var pan = function(){
    if(!MousePos.touched) return;
    //console.log('pan ' + MousePos.multitouched)
    singletouch_borderpan();
    mutlitouch_pan();
}
var pan_end = function(){
    panning = false;
}
var mutlitouch_pan = function(){
    if(!MousePos.multitouched) return;
    //console.log('mutlitouch_pan')
    if(!panning){
        pan_sx = stage.x;
        pan_sy = stage.y;
        panning = true;    
    }
    stage.x = pan_sx + (MousePos.x - MousePos.sx);
    stage.y = pan_sy + (MousePos.y - MousePos.sy);
    stageborder();
    //stage.x -= MousePos.px - MousePos.x;
    //stage.y -= MousePos.py - MousePos.y;
}
var singletouch_borderpan = function(){
    if(MousePos.multitouched) return;
    if(MousePos.x > width - scope_width){
        stage.x -= width/100;//MousePos.px - MousePos.x;
        if(stage.x < -stage_width + width) stage.x = -stage_width + width;
    }else if(MousePos.x < scope_width){
        stage.x += width/100;//MousePos.px - MousePos.x;
        if(stage.x > 0) stage.x = 0;
    }
    if(MousePos.y > height - scope_height){
        stage.y -= height/100;//MousePos.px - MousePos.x;
        if(stage.y < -stage_height + height) stage.y = -stage_height + height;
    }else if(MousePos.y < scope_height){
        stage.y += height/100;//MousePos.px - MousePos.x;
        if(stage.y > 0) stage.y = 0;
    }
    stage_front.x = stage.x;
    stage_front.y = stage.y;
}
var stageborder = function(){
    if(stage.x < -stage_width + width*0.5) stage.x = -stage_width + width*0.5;
    if(stage.x > width*0.5) stage.x = width*0.5;
    if(stage.y < -stage_height + height*0.5) stage.y = -stage_height + height*0.5;
    if(stage.y > height*0.5) stage.y = height*0.5;
}
var panTo = function(x, y){
    stage.x = -x + width/2;
    stage.y = -y + height/2;
    stageborder();
    stage_front.x = stage.x;
    stage_front.y = stage.y;
    visiblecount = visibletime-5;
}
