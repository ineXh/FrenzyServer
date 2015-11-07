var Engine = (function(global) {

	startTime = Date.now();
	width 	= window.innerWidth;
	height 	= window.innerHeight;
	stage_width = width*1;
	stage_height = height*1;
	dim = (width < height) ? width : height;
	big_dim = (width < height) ? height : width;
	scope_width = width*0.25;
	scope_height = height*0.25;

	document.addEventListener("mousedown", onMouseStart, true);
	document.addEventListener("touchstart", onTouchStart, true);
	document.addEventListener("touchend", onTouchEnd, true);
	document.addEventListener("touchmove", onTouchMove, true);
	document.addEventListener("backbutton", backButtonTap, true);

	renderer = PIXI.autoDetectRenderer(width, height*1.0 ,{backgroundColor : LightCyan});
	// view is canvas
	document.body.appendChild(renderer.view);
	stage = new PIXI.Container();
	stage0 = new PIXI.Container();
	stage0.addChild(stage)

    communication = new Communications();
    gameobjects = new GameObjects();


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
