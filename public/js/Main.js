function update(){var a=Date.now(),b=a-lastTime,c=a-startTime;time={t:c,dt:b},lastTime=a,panCenter(),visibleCheck(),assetsloaded&&(menu.update(time),game.update())}function animate(){update(),renderer.render(stage0),requestAnimationFrame(animate)}var Engine=function(a){startTime=Date.now(),width=window.innerWidth,height=window.innerHeight,dim=width<height?width:height,big_dim=width<height?height:width,stage_width=3*big_dim,stage_height=3*big_dim,scope_width=.25*width,scope_height=.25*height,console.log("width "+width+" height "+height+" stage_width "+stage_width+" stage_height "+stage_height),renderer=PIXI.autoDetectRenderer(width,1*height,{backgroundColor:LightCyan}),document.body.appendChild(renderer.view),addListeners(),stage0=new PIXI.Container,stage=new PIXI.Container,stage0.addChild(stage);var b=new PIXI.Graphics;b.lineStyle(5,16711680,1),b.drawRect(0,0,stage_width,stage_height),gameobjects=new GameObjects,animate()}(this);