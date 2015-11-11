var Engine = (function(global) {

	startTime = Date.now();
	width 	= window.innerWidth;
	height 	= window.innerHeight;

	dim = (width < height) ? width : height;
	big_dim = (width < height) ? height : width;
    stage_width = dim*2;
    stage_height = dim*2;
	scope_width = width*0.25;
	scope_height = height*0.25;

    console.log('width ' + width + ' height ' + height + ' stage_width ' + stage_width + ' stage_height ' + stage_height)
	document.addEventListener("mousedown", onMouseStart, true);
    document.addEventListener("mouseup", onMouseUp, true);
    document.addEventListener("mousemove", onMouseMove, true);
	document.addEventListener("touchstart", onTouchStart, true);
	document.addEventListener("touchend", onTouchEnd, true);
	document.addEventListener("touchmove", onTouchMove, true);
	document.addEventListener("backbutton", backButtonTap, true);

	renderer = PIXI.autoDetectRenderer(width, height*1.0 ,{backgroundColor : LightCyan});
	// view is canvas
	document.body.appendChild(renderer.view);

    stage0 = new PIXI.Container();
    stage = new PIXI.Container();
    //stage.pivot = {x: width/2, y: height/2};


	stage0.addChild(stage)

    var border_box = new PIXI.Graphics();
    border_box.lineStyle(5, 0xFF0000, 1);
    border_box.drawRect(0, 0, stage_width, stage_height);
    //stage.addChild(border_box);

    var x_count = 10;
    var y_count = 10;
    for(var i = 0; i < y_count; i++){
        for(var j = 0; j < x_count; j++){
            var container = new PIXI.Container();
            var grid = new PIXI.Graphics();
            grid.lineStyle(2, 0x0000FF, 1);
            container.x = j*stage_width/x_count;
            container.y = i*stage_height/y_count;
            grid.drawRect(0, 0, stage_width/x_count, stage_height/y_count);
            var text = new PIXI.Text(i + ", " + j, {font: '32px Arial', fill: 'black'})
            text.x = 0;
            text.y = 0;
            container.addChild(text);
            container.addChild(grid);
            stage.addChild(container);
        }
    }

    gameobjects = new GameObjects();

	animate();
})(this);


function update(){
	 var now = Date.now(),
         dt  = (now - lastTime),
         t   = (now - startTime);
    time = {t:t, dt: dt};
    lastTime = now;


    panCenter();
    visibleCheck();

    if(assetsloaded){
    	//characters.update();
        game.update();
    }
}

function animate() {
	update();
    renderer.render(stage0);
	requestAnimationFrame( animate );
}
