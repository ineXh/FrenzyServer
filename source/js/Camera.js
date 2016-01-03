var ScreenPos = {left: 0, right:0, top:0, bot:0, cen_x: 0, cen_y: 0};
var stage_scale = 1;
var getScreenPos = function(){
    ScreenPos.left = -stage.x /stage.scale.x;
    ScreenPos.right = (-stage.x + width) /stage.scale.x;
    ScreenPos.top = -stage.y/stage.scale.y;
    ScreenPos.bot = (-stage.y + height) /stage.scale.y;
    ScreenPos.cen_x = (ScreenPos.left + ScreenPos.right) / 2
    ScreenPos.cen_y = (ScreenPos.top + ScreenPos.bot) / 2
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
    stage.x = pan_sx + (MousePos.x - MousePos.sx)*stage.scale.x;
    stage.y = pan_sy + (MousePos.y - MousePos.sy)*stage.scale.y;
    stageborder();
    stage_front.x = stage.x;
    stage_front.y = stage.y;
    //stage.x -= MousePos.px - MousePos.x;
    //stage.y -= MousePos.py - MousePos.y;
}
var singletouch_borderpan = function(){
    if(MousePos.multitouched) return;
    if(MousePos.raw_x > width - scope_width){
        stage.x -= width/100 / stage_scale;//MousePos.px - MousePos.x;        
    }else if(MousePos.raw_x < scope_width){
        stage.x += width/100 / stage_scale;//MousePos.px - MousePos.x;
    }
    if(MousePos.raw_y > height - scope_height){
        stage.y -= height/100;//MousePos.px - MousePos.x;
    }else if(MousePos.raw_y < scope_height){
        stage.y += height/100;//MousePos.px - MousePos.x;
    }
    stageborder();
    stage_front.x = stage.x;
    stage_front.y = stage.y;
}
var zooming = false;
var start_stage_scale = 1;
var zoom_cen = new PVector(0,0);
var zoom_start_dist = 0;
var zoom = function(event){
    if(!MousePos.multitouched) return;
    if(!zooming){
        start_stage_scale = stage_scale;
        zoom_get_center(event);
        zooming = true;
    }
    console.log(event.changedTouches)
    if(event.changedTouches.length <= 1) return;
    var p0 = new PVector(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
    var p1 = new PVector(event.changedTouches[1].clientX, event.changedTouches[1].clientY);
    var dist = findDist(p0, p1);
    console.log('dist ' + dist)
    setscale((dist / zoom_start_dist) * start_stage_scale)
}
var zoom_end = function(){
    zooming = false;
}
var zoom_get_center = function(event){
    if(event.changedTouches.length <= 1) return;
    var p0 = new PVector(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
    var p1 = new PVector(event.changedTouches[1].clientX, event.changedTouches[1].clientY);
    zoom_cen.x = p0.x + (p1.x - p0.x)/2;
    zoom_cen.y = p0.y + (p1.y - p0.y)/2;
    zoom_start_dist = findDist(p0, p1);
    console.log('zoom_start_dist ' + zoom_start_dist)
}
var stageborder = function(){
    if(stage.x < -stage.width + width*0.5) stage.x = -stage.width + width*0.5;
    if(stage.x > width*0.5) stage.x = width*0.5;
    if(stage.y < -stage.height + height*0.5) stage.y = -stage.height + height*0.5;
    if(stage.y > height*0.5) stage.y = height*0.5;
}
var panTo = function(x, y){ // in game position
    //console.log('panto ' + x + ' , ' + y)
    stage.x = -(x - width/2 / stage.scale.x) * stage.scale.x;
    stage.y = -(y - height/2 / stage.scale.y) * stage.scale.y;
    stageborder();
    stage_front.x = stage.x;
    stage_front.y = stage.y;
    visiblecount = visibletime-5;
}
var setscale = function(scale){
    if(isNaN(scale) || scale == Infinity) return;
    stage_scale = scale;
    stage.scale.set(stage_scale);
    stage_front.scale.set(stage_scale);
    panTo(ScreenPos.cen_x, ScreenPos.cen_y);
}