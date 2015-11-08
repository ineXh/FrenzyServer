var Engine = (function(global) {

	startTime = Date.now();
	width 	= window.innerWidth;
	height 	= window.innerHeight;
	stage_width = width*2;
	stage_height = height*2;
	dim = (width < height) ? width : height;
	big_dim = (width < height) ? height : width;
	scope_width = width*0.25;
	scope_height = height*0.25;

    console.log('width ' + width + ' height ' + height + ' stage_width ' + stage_width + ' stage_height ' + stage_height)
	document.addEventListener("mousedown", onMouseStart, true);
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
    stage.addChild(border_box);

    var grid = new PIXI.Graphics();
    grid.lineStyle(2, 0x0000FF, 1);
    for(var i = 0; i < 10; i++){
        for(var j = 0; j < 10; j++){
            grid.drawRect(j*stage_width/10, i*stage_height/10, stage_width/10, stage_height/10);
            var text = new PIXI.Text(i + ", " + j, {font: '32px Arial', fill: 'black'})
            text.x = j*stage_width/10;
            text.y = i*stage_height/10;
            stage.addChild(text);
        }
    }
    stage.addChild(grid);


    gameobjects = new GameObjects();
    game = new Game();



	animate();
})(this);

function update(){
	 var now = Date.now(),
         dt  = (now - lastTime),
         t   = (now - startTime);
    time = {t:t, dt: dt};
    lastTime = now;

    if(assetsloaded){
    	characters.update();
    }
}

function animate() {
	update();
    renderer.render(stage0);
	requestAnimationFrame( animate );
}
