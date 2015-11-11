var ScreenPos = {left: 0, right:0, top:0, bot:0};
var getScreenPos = function(){
    ScreenPos.left = -stage.x;
    ScreenPos.right = -stage.x + width/stage.scale.x;
    ScreenPos.top = -stage.y;
    ScreenPos.bot = -stage.y + height/stage.scale.y;
}
// assume stage is parent
var onScreen = function(container){
    setBorder(container);

    var left = container.right < ScreenPos.left;
    var right = container.left > ScreenPos.right;
    var top = container.bot < ScreenPos.top;
    var bot = container.top > ScreenPos.bot;

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
}
var visiblecount = 0;
var visibleCheck = function(){
     if(visiblecount%50 == 0){
        visiblecount = 0;
        //console.log('visible check')
        getScreenPos();
        for(var i = 0; i < stage.children.length; i++){
            if(!onScreen(stage.children[i])) stage.children[i].visible = false;
            else stage.children[i].visible = true;
        }
    }
    visiblecount++;
}
