function Stagesetup(){
    this.init();
}
Stagesetup.prototype = {
  init: function(){
    
    
  },
  reset: function(){

  },
  setup:function() {   
  stagelayout.place_stage();   
    console.log("spawn queue")
  gameobjects.particles.spawn_queue({
                x: width/2, y: height,
                text: "Stage " + stagenum,
                 duration: [1000,1000],              
                 x_end: [width/2,width/2],
                 y_end: [height/2,height/2],
               },
                 ParticleType.TEXT);
  gameobjects.particles.spawn_queue({
                x: width/2, y: height/2,
                text: "Go!",
                 lifespan_d: 5, 
                 ax: getRandomArbitrary(-1, 1)*-width*0.001,
                 ay: -height*0.001,
                 cb_dead: function(){gamestate = GameState.InPlay;},
                  },
                 ParticleType.TEXT);
    if(!assetsloaded) return;
    console.log('stagenum ' + stagenum)
    switch(stagenum){
      case 1:
      console.log('spawn chicks')
        chicks.push(new Chick(20,height/2 + 20, stage));
        chicks.push(new Chick(25,height/2 - 20, stage));
        chicks.push(new Chick(30,height/2 + 20, stage));
        chicks.forEach(function(c){
          stage.addChild(c.egg_shadow_sprite);
          stage.addChild(c.egg_sprite);
          //c.hatch(time);
          //stage.addChild(c.sprite);
        })
        //wolves.push(new Wolf())

        wolves[0].reset([width/2, width/2], [height*0.2, height*0.8], [4000, 4000])
        wolves[0].addChild(stage);
        /*//wolves.push(new Wolf(, stage));
        wolves.forEach(function(w){
          w.addChild(stage)
        })*/
      break;
      case 2:
                  
      break;
      default:
      
      break;
      }
  }, // end Stagesetup setup
  passStage : function(time){
    score += alive_ducks;
    stagenum++;
    num_burnt = 0;
    this.setup(time);
  }, // end Stagesetup passStage
  checkGameOver : function(time){
     
  }, // end Stagesetup checkGameOver
  update: function(time){
    if(gamestate != GameState.InPlay) return;
    this.checkGameOver(time);
     switch(stagenum){
      case 1:        
         
        break;
      case 2:        
         
        break;
      default:        
         
        break;
    }
  },// end Stagesetup update
}