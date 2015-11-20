function Characters(){this.pool=new CharacterPool,this.init()}function Character(){this.SteerClosestTarget=1,this.SteerTargets=[],this.searchClosestTime=0,this.searchClosestTotalTime=2e3,this.closestTarget_idx=-1,this.accel=new PVector(0,0),this.vel=new PVector(0,0),this.pos=new PVector(0,0),this.maxspeed=width/200,this.Dead=!1}function Cow(){this.create()}function HealthBar(a){this.init(a)}Characters.prototype={init:function(){this.characters=this.pool.initList()},getLength:function(){return this.characters.length},update:function(){for(var a=0;a<this.characters.length;a++)if(void 0!=this.characters[a])for(var b=this.characters[a].length-1;b>=0;b--){var c=this.characters[a][b];if(c.update(),c.isDead()){this.clean(c);var d=this.characters[c.type].indexOf(a);if(d>-1){this.characters[c.type][d];this.characters[c.type].splice(d,1)}this.characters.splice(a,1)}}},spawn:function(a){var b=this.pool.borrowCharacter(a.type);return null!=b?(b.init(a),b):void 0},clean_all:function(){for(var a=this.characters.length-1;a>=0;a--){var b=this.characters[a];this.clean(b);var c=this.getCharacterlist(b.type).indexOf(a);if(c>-1){var d=this.getCharacterlist(b.type)[c];this.getCharacterlist(b.type).splice(c,1),this.decrementCharacterlists(d)}this.characters.splice(a,1)}},clean:function(a){a.clean(),this.pool.returnCharacter(a.type,a)},getCharacterlist:function(a){return this.characterlist[a]}},Character.prototype=Object.create(Ball.prototype),Character.prototype.constructor=Ball,Character.prototype.applyBehaviors=function(a){var b=this.steer(a);this.applyForce(b)},Character.prototype.addTarget=function(a,b){for(var c=0;c<a.length;c++)if(a[c]==b)return;a.push(b)},Character.prototype.removeTarget=function(a,b){for(var c=0;c<a.length;c++)if(a[c]==b)return void a.splice(c,1)},Character.prototype.findClosestTarget=function(a,b){if(null==this.targets)return-1;this.minDist_idx=-1,minDist=width;for(var c=0;c<a.length;c++){if(void 0!=a[c].target)var d=a[c].target;else var d=a[c];var e=findDist(b,d);e<minDist&&(void 0!=d.steer_distance?e<d.steer_distance&&(minDist=e,this.minDist_idx=c):(minDist=e,this.minDist_idx=c))}return this.minDist_idx},Character.prototype.steer=function(a){if(null==this.SteerTargets)return new PVector(0,0);if(this.SteerTargets.length<1)return new PVector(0,0);if(a.t-this.searchClosestTime>this.searchClosestTotalTime){for(var b=[],c=this.SteerTargets.length-1;c>=0;c--){var d=this.SteerTargets[c].target;d.isDead()?this.SteerTargets.splice(c,1):b.push(d.pos)}this.closestTarget_idx=this.findClosestTarget(b,this.pos),this.closestTarget_idx=this.SteerTargets.length-1-this.closestTarget_idx,this.searchClosestTime=a.t}var e=new PVector(0,0);if(-1!=this.closestTarget_idx&&void 0!=this.SteerTargets[this.closestTarget_idx]){if(withinDist(this.pos,this.SteerTargets[this.closestTarget_idx].target.pos,this.width+this.SteerTargets[this.closestTarget_idx].width))return e;e=this.seek(this.SteerTargets[this.closestTarget_idx].target.pos)}return e},Character.prototype.seek=function(a){var b=PVector.sub(a,this.pos);return b.normalize(),b.mult(this.maxspeed/2),b},Character.prototype.isDead=function(){return this.Dead},Cow.prototype=Object.create(Character.prototype),Cow.prototype.constructor=Character,Cow.prototype.create=function(){this.animationtype=AnimationType.Walk_Front,this.front_walk_frame=0,this.front_attack_frame=8,this.back_walk_frame=14,this.back_attack_frame=22,this.pos=new PVector(0,0),this.vel=new PVector(0,0),this.accel=new PVector(0,0),this.sprite=new PIXI.extras.MovieClip(cow_front_frames),this.sprite.animationSpeed=.1,this.sprite.play(),this.r=.05*big_dim,this.scale=this.r/this.sprite.width,this.sprite.scale.set(this.scale),this.sprite.anchor.x=.5,this.sprite.anchor.y=.5,this.maxspeed=2*big_dim/1e3,this.type=CharacterType.Cow,this.seekOpponent_count=0,this.seekOpponent_time=0,this.attack_count=0,this.attack_time=10,this.attacking=!1,this.Dead=!1,this.border=!0,this.maxhp=5,this.hp=this.maxhp,this.healthbar=new HealthBar(this)},Cow.prototype.init=function(a){this.team=a.team,this.sprite.tint=a.color,this.pos.x=a.x,this.pos.y=a.y,stage.addChild(this.sprite),stage.addChild(this.healthbar.bar)},Cow.prototype.animationdisplay=function(){switch(this.animationtype){case AnimationType.Walk_Front:this.sprite.currentFrame>=this.front_attack_frame-1&&this.sprite.gotoAndPlay(this.front_walk_frame);break;case AnimationType.Attack_Front:this.sprite.currentFrame>=this.back_walk_frame-1&&(this.attacking=!1,this.animationtype=AnimationType.Walk_Front,null!=this.opponent&&(this.opponent.hp-=1,this.opponent.healthbar.set(this.opponent.hp)))}},Cow.prototype.clean=function(){this.sprite.stop(),stage.removeChild(this.sprite),stage.removeChild(this.healthbar.bar)},Cow.prototype.attack=function(){this.attacking||(this.animationtype!=AnimationType.Attack_Front&&this.sprite.gotoAndPlay(this.front_attack_frame),this.animationtype=AnimationType.Attack_Front,this.attacking=!0)},Cow.prototype.update=function(a){if(null==a||this.attacking||(applyForce.call(this,a.follow(this)),this.accel.mag()>width/10&&(this.animationtype=AnimationType.Walk_Front)),null!=this.opponent&&this.accel.mag()<width/1e3&&!this.attacking){if(this.seekOpponent_count++,this.seekOpponent_count<this.seekOpponent_time)return;this.seekOpponent_count=0,this.opponent_dist=findDist(this.pos,this.opponent.pos),(this.opponent_dist>=dim/2||this.opponent.isDead())&&(this.opponent=null,void 0==this.opponent_dist),this.opponent_dist>=1.5*this.r?(null!=this.opponent&&applyForce.call(this,this.seek(this.opponent.pos)),this.animationtype=AnimationType.Walk_Front):this.attack()}this.attacking||(this.vel=this.accel,this.vel.limit(this.maxspeed),this.pos.add(this.vel),this.accel.mult(0),this.border&&this.stayinBorder()),null!=this.opponent&&(this.opponent.pos.x>this.pos.x?this.sprite.scale.x=-Math.abs(this.sprite.scale.x):this.sprite.scale.x=Math.abs(this.sprite.scale.x)),this.sprite.position.x=this.pos.x,this.sprite.position.y=this.pos.y,this.healthbar.update(),this.animationdisplay(),this.hp<=0&&(this.Dead=!0)},HealthBar.prototype={init:function(a){this.character=a,this.pos=this.character.pos,this.r=this.character.r,this.maxhp=this.character.maxhp,this.hp=this.maxhp,this.bar=new PIXI.Container,this.innerbar=new PIXI.Graphics,this.innerbar.beginFill(0),this.innerbar.drawRoundedRect(0,0,.6*this.r,this.r/12,this.r/24),this.innerbar.endFill(),this.bar.addChild(this.innerbar),this.outbar=new PIXI.Graphics,this.outbar.beginFill(16724736),this.outbar.drawRoundedRect(0,0,.6*this.r,this.r/12,this.r/24),this.outbar.endFill(),this.bar.addChild(this.outbar),this.bar.outer=this.outbar},set:function(a){var b=a/this.maxhp;0>=a&&(this.character.Dead=!0,b=0),this.outbar.scale.x=b},update:function(){this.bar.x=this.pos.x-this.r/4,this.bar.y=this.pos.y-3*this.r/8}};