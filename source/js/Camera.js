var ScreenPos = {left: 0, right:0, top:0, bot:0, cen_x: 0, cen_y: 0, target_x: 0, target_y: 0};
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
var pan_target = new PVector(0, 0);
var pan_pError = new PVector(0,0);
var zoom_pan_pError = new PVector(0,0);
var pan = function(event){
    if(!MousePos.touched) return;
    //console.log('pan ' + MousePos.multitouched)
    singletouch_borderpan();
    mutlitouch_pan(event);
}
var pan_end = function(){
    panning = false;
}
var mutlitouch_pan = function(event){
    if(!MousePos.multitouched) return;
    if(event == undefined) return;
    //console.log(event.changedTouches)
    if(event.changedTouches.length < 2) return;
    //console.log('mutlitouch_pan')
    if(!panning){
        pan_sx = stage.x;
        pan_sy = stage.y;   
        panning = true;     
    }
    pan_target.x = pan_sx + (MousePos.x - MousePos.sx)*stage.scale.x;
    pan_target.y = pan_sy + (MousePos.y - MousePos.sy)*stage.scale.y;
    var e_x = (pan_target.x - stage.x);
    //e_x = map(e_x, -width, width, -width/1, width/1)
    var e_y = (pan_target.y - stage.y);

    /*if(Math.abs(e_x) > width/100 || Math.abs(e_y) > height/100){
        panning = true;
    }else{
        panning = false;
        return;
    }*/
    //e_y = map(e_y, -height, height, -height/1, height/1)
    //if(Math.abs(e_y) > 100) debugger;
    if(!sameSign(e_x, pan_pError.x) && Math.abs(pan_pError.x > 10)) e_x = 0
    if(!sameSign(e_y, pan_pError.y) && Math.abs(pan_pError.y > 10)) e_y = 0
    //console.log("error: (" + e_x + ", (" + e_y + ")");
    //if(Math.abs(e_x) < 50) stage.x += e_x * 1;
    //if(Math.abs(e_y) < 50) stage.y += e_y * 1; 
    //if(Math.abs(e_x) < 5) stage.x = pan_target.x;
    //else stage.x += e_x;
    //if(Math.abs(e_y) < 5) stage.y = pan_target.y;
    //else stage.y += e_y;
    stage.x += e_x;
    stage.y += e_y;
    pan_pError.x = e_x;
    pan_pError.y = e_y;

    stageborder();
    stage_front.x = stage.x;
    stage_front.y = stage.y;
    visiblecount = visibletime-2;
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
var zoom_container;
var zoom_center_graphics;
var zoom_center_target_graphics;
var zoom_debug_setup = function(){
    zoom_container = new PIXI.Container();
    zoom_center_graphics = new PIXI.Graphics();
    zoom_center_graphics.beginFill(0xFF0000);
    zoom_center_graphics.drawCircle(0, 0, 10);
    zoom_center_graphics.endFill();
    zoom_container.addChild(zoom_center_graphics);

    zoom_center_target_graphics = new PIXI.Graphics();
    zoom_center_target_graphics.beginFill(0x00FF00);
    zoom_center_target_graphics.drawCircle(0, 0, 8);
    zoom_center_target_graphics.endFill();
    zoom_container.addChild(zoom_center_target_graphics);

    stage0.addChild(zoom_container);
}
var zooming = false;
var start_stage_scale = 1;
var zoom_cen;// = new PVector(0,0);
var zoom_cen_target;// = new PVector(0,0);
var zoom_dist = 0;
var zoom_dist_target = 0;
var zoom = function(event){
    if(!MousePos.multitouched) return;
    if(event == undefined) return;
    //console.log(event.changedTouches)
    if(event.changedTouches.length < 2) return;

    if(!zooming){
        start_stage_scale = stage_scale;
        zoom_cen = zoom_get_center(event);
        if(zoom_cen != undefined && zoom_center_graphics != undefined){
            zoom_center_graphics.x = zoom_cen.x;
            zoom_center_graphics.y = zoom_cen.y;    
        }
        
        zoom_dist = zoom_get_dist(event);
        zooming = true;
    }
    //console.log(event.changedTouches)  
    zoom_cen_target = zoom_get_center(event);
    if(zoom_cen_target != undefined && zoom_center_target_graphics != undefined){
        zoom_center_target_graphics.x = zoom_cen_target.x;
        zoom_center_target_graphics.y = zoom_cen_target.y;    
    }    
    zoom_cen.x = zoom_cen_target.x;
    zoom_cen.y = zoom_cen_target.y;

    zoom_dist_target = zoom_get_dist(event);
    if(setscale(start_stage_scale * zoom_dist_target / zoom_dist)){
        zoom_get_new_screen_center();
    }
    
    
    //setscale((dist / zoom_start_dist) * start_stage_scale)
}
var zoom_end = function(){
    zooming = false;
}
var zoom_get_new_screen_center = function(){
    //if(panning) return;
    // ScreenPos.target_x // ScreenPos.target_y
    var x = (ScreenPos.cen_x - zoom_cen.x + zoom_cen.x*stage.scale.x) / stage.scale.x;
    var y = (ScreenPos.cen_y - zoom_cen.y + zoom_cen.y*stage.scale.y) / stage.scale.y;
    var target_x = -(x - width/2 / stage.scale.x) * stage.scale.x;
    var target_y = -(y - height/2 / stage.scale.y) * stage.scale.y;

    console.log('new screen center ' + x + ' , ' + y)
    panTo(x, y);
    /*var e_x = (target_x - stage.x);
    var e_y = (target_y - stage.y);    
    if(!sameSign(e_x, zoom_pan_pError.x) && Math.abs(zoom_pan_pError.x > 10)) e_x = 0
    if(!sameSign(e_y, zoom_pan_pError.y) && Math.abs(zoom_pan_pError.y > 10)) e_y = 0    
    if(Math.abs(e_x) > width/50) stage.x += e_x*0.05;
    if(Math.abs(e_y) > height/50) stage.y += e_y*0.05;
    console.log("error: (" + e_x + ", (" + e_y + ")");
    zoom_pan_pError.x = e_x;
    zoom_pan_pError.y = e_y;*/
}
var zoom_get_center = function(event){
    if(event.changedTouches.length <= 1) return;
    var p0 = new PVector(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
    var p1 = new PVector(event.changedTouches[1].clientX, event.changedTouches[1].clientY);
    var center = new PVector(0, 0);
    center.x = p0.x + (p1.x - p0.x)/2;
    center.y = p0.y + (p1.y - p0.y)/2;
    return center;
    //zoom_start_dist = findDist(p0, p1);
    //console.log('zoom_start_dist ' + zoom_start_dist)
}
var zoom_get_dist = function(event){
    if(event.changedTouches.length <= 1) return;
    var p0 = new PVector(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
    var p1 = new PVector(event.changedTouches[1].clientX, event.changedTouches[1].clientY);
    var dist = findDist(p0, p1);
    //console.log('dist ' + dist)
    return dist;
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
    var scaling = false;
    if(isNaN(scale) || scale == Infinity) return;
    if(scale/stage_scale >= 1.2){
      scale = 1.2*stage_scale; 
      scaling = true;
    } 
    if(scale/stage_scale <= 0.8){
      scale = 0.8*stage_scale;
      scaling = true;  
    } 
    if(scale <= 0.2) scale = 0.3;
    if(scale >= 4){
      scale = 4;
      scaling = false;  
    } 
    stage_scale = scale;
    stage.scale.set(stage_scale);
    stage_front.scale.set(stage_scale);
    return scaling;
    //panTo(ScreenPos.cen_x, ScreenPos.cen_y);
}
