function getMouse(e,t){MousePos.px=MousePos.x,MousePos.py=MousePos.y,void 0!=t?(MousePos.x=t.clientX,MousePos.y=t.clientY):void 0!=e.clientX?(MousePos.x=e.clientX,MousePos.y=e.clientY):(MousePos.x=e.data.global.x,MousePos.y=e.data.global.y),MousePos.x_pct=MousePos.x/width,MousePos.y_pct=MousePos.y/height,MousePos.stage_x=MousePos.x-stage.x,MousePos.stage_y=MousePos.y-stage.y,MousePos.stage_x_pct=MousePos.stage_x/stage_width,MousePos.stage_y_pct=MousePos.stage_y/stage_height}function onMouseStart(e){spritetouched||(getMouse(e,void 0),MousePos.sx=MousePos.x,MousePos.sy=MousePos.y,drag(MousePos.x,MousePos.y)||(MousePos.touched=!0,void 0!=game&&game.onTouchStart()))}function onMouseMove(e){MousePos.touched&&(getMouse(e,void 0),void 0!=game&&game.onTouchMove())}function onMouseUp(e){spritetouched&&(spritetouched=!1),MousePos.touched&&(getMouse(e,void 0),MousePos.touched=!1,void 0!=game&&game.onTouchEnd())}function onTouchStart(e){spritetouched||(null!=spritetouched_cancel_cb&&(spritetouched_cancel_cb(),spritetouched_cancel_cb=null),e.preventDefault(),getMouse(e,e.changedTouches[0]),MousePos.sx=MousePos.x,MousePos.sy=MousePos.y,MousePos.touched=!0,void 0!=game&&game.onTouchStart())}function onTouchMove(e){e.preventDefault(),MousePos.touched&&(getMouse(e,e.changedTouches[0]),void 0!=game&&game.onTouchMove())}function onTouchEnd(e){spritetouched&&(spritetouched=!1),e.preventDefault(),MousePos.touched&&(getMouse(e,e.changedTouches[0]),MousePos.touched=!1,void 0!=game&&game.onTouchEnd())}function addListeners(){renderer.view.addEventListener("mousedown",onMouseStart,!0),renderer.view.addEventListener("mouseup",onMouseUp,!0),renderer.view.addEventListener("mousemove",onMouseMove,!0),renderer.view.addEventListener("touchstart",onTouchStart,!0),renderer.view.addEventListener("touchend",onTouchEnd,!0),renderer.view.addEventListener("touchmove",onTouchMove,!0),renderer.view.addEventListener("backbutton",backButtonTap,!0)}function removeListeners(){renderer.view.removeEventListener("mousedown",onMouseStart,!0),renderer.view.removeEventListener("mouseup",onMouseUp,!0),renderer.view.removeEventListener("mousemove",onMouseMove,!0),renderer.view.removeEventListener("touchstart",onTouchStart,!0),renderer.view.removeEventListener("touchend",onTouchEnd,!0),renderer.view.removeEventListener("touchmove",onTouchMove,!0),renderer.view.removeEventListener("backbutton",backButtonTap,!0)}function drag(e,t){if($("#chatwindow").length<1)return!1;var o=$("#chatwindow").position().left,n=o+1.2*$("#chatwindow").width(),r=$("#chatwindow").position().top,s=r+1.2*$("#chatwindow").height();return!(e>n||o>e||t>s||r>t)}function backButtonTap(){}function stayinBorder(e){if(temp=e.clone(),temp.sub(new PVector(stage_width/2,stage_height/2)),temp.mag()>stage_width/2){var t=Math.atan2(temp.y,temp.x);e.x=stage_width/2+stage_width/2*Math.cos(t),e.y=stage_height/2+stage_height/2*Math.sin(t)}}function findDist(e,t){return PVector.dist(e,t)}function intersectCR(e,t,o,n,r,s,a){var u=new PVector(0,0);if(u.x=Math.abs(e-n),u.y=Math.abs(t-r),u.x>s/2+o)return!1;if(u.y>a/2+o)return!1;if(u.x<=s/2)return!0;if(u.y<=a/2)return!0;var i=(u.x-s/2)*(u.x-s/2)+(u.y-a/2)*(u.y-a/2);return o*o>=i}function withinDist(e,t,o){var n=PVector.dist(e,t);return o>n?!0:!1}function checkonScreen(e){var t=-stage.x+width,o=-stage.x,n=-stage.y+height,r=-stage.y;return e.x>t?!1:e.x<o?!1:e.y<r?!1:e.y>n?!1:!0}function RGBColor(e,t,o){return 65536*e+256*t+o}function getRndColor(){return 16777215*Math.random()}function getRngColor(e,t,o,n,r,s){var a=t*Math.random()|e,u=n*Math.random()|o,i=s*Math.random()|r;return"rgb("+a+","+u+","+i+")"}function getRandomArbitrary(e,t){return Math.random()*(t-e)+e}function getRandomInt(e,t){return Math.floor(Math.random()*(t-e))+e}function getBound(e){void 0==e.anchor&&(e.anchor={x:.5,y:.5}),e.right=e.x+Math.abs(e.width)*(1-e.anchor.x),e.left=e.x-Math.abs(e.width)*e.anchor.x,e.bot=e.y+Math.abs(e.height)*(1-e.anchor.y),e.top=e.y-Math.abs(e.height)*e.anchor.y}function isIntersecting(e,t){var o=t.x-Math.abs(t.width)*t.anchor.x>=e.x+Math.abs(e.width)*(1-e.anchor.x),n=t.x+Math.abs(t.width)*(1-t.anchor.x)<=e.x-Math.abs(e.width)*e.anchor.x,r=t.y-Math.abs(t.height)*t.anchor.y>=e.y+Math.abs(e.height)*(1-e.anchor.y),s=t.y+Math.abs(t.height)*(1-t.anchor.y)<=e.y-Math.abs(e.height)*e.anchor.y;return!(o||n||r||s)}function isTouching(e,t,o){return e>o.x&&e<o.x+o.width&&t>o.y&&t<o.y+o.height?!0:!1}function map(e,t,o,n,r){var s=(e-t)/(o-t);return s*(r-n)+n}function getRandomTop(){var e=new PVector(getRandomArbitrary(.1*-stage_width,1.1*stage_width),.1*-stage_height);return e}function getRandomLeft(){var e=new PVector(.1*-stage_width,getRandomArbitrary(.1*-stage_height,1.1*stage_height));return e}function getRandomRight(){var e=new PVector(1.1*stage_width,getRandomArbitrary(.1*-stage_height,1.1*stage_height));return e}function getRandomBot(){var e=new PVector(getRandomArbitrary(.1*-stage_width,1.1*stage_width),1.1*stage_height);return e}function getRandomBorder(){switch(getRandomInt(1,5)){case 1:return getRandomTop();case 2:return getRandomLeft();case 3:return getRandomRight();case 4:return getRandomBot();default:return getRandomTop()}}function lock(e){for(;e>2*PI;)e-=2*PI;for(;0>e;)e+=2*PI;return e}function lock_x(e){return 0>e?0:e>width?width:e}function lock_y(e){return 0>e?0:e>ground?ground:e}function getNormalPoint(e,t,o){var n=PVector.sub(e,t),r=PVector.sub(o,t);r.normalize(),r.mult(n.dot(r));var s=PVector.add(t,r);return s}function isBetween(e,t,o){var n=(e.y-t.y)*(o.x-t.x)-(e.x-t.x)*(o.y-t.y);if(Math.abs(n)>1)return!1;var r=(e.x-t.x)*(o.x-t.x)+(e.y-t.y)*(o.y-t.y),s=(o.x-t.x)*(o.x-t.x)+(o.y-t.y)*(o.y-t.y);return 0>r?!1:r>s?!1:!0}function crossproduct(e,t,o){return(e.y-t.y)*(o.x-t.x)-(e.x-t.x)*(o.y-t.y)}function applyForce(e){this.accel.add(e)}function simulateMouseEvent(e,t){if(!(e.touches.length>1)){e.preventDefault();var o=e.changedTouches[0],n=document.createEvent("MouseEvents");n.initMouseEvent(t,!0,!0,window,1,o.screenX,o.screenY,o.clientX,o.clientY,!1,!1,!1,!1,0,null),e.target.dispatchEvent(n)}}function arrayContains(e,t){var o=e.indexOf(t);return 0>o?!1:!0}function print_filter(filter){var f=eval(filter);"undefined"!=typeof f.length,"undefined"!=typeof f.top&&(f=f.top(1/0)),"undefined"!=typeof f.dimension&&(f=f.dimension(function(e){return""}).top(1/0)),console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n	").replace(/}\,/g,"},\n	").replace("]","\n]"))}function getRandomInt(e,t){return Math.floor(Math.random()*(t-e))+e}function sortByKey(e,t){return e.sort(function(e,o){var n=e[t],r=o[t];return r>n?1:n>r?-1:0})}function sortByKeySmall(e,t){return e.sort(function(e,o){var n=e[t],r=o[t];return r>n?-1:n>r?1:0})}function search_array(e,t,o){for(i=0;i<e.length;i++)if(e[i][t]===o)return i;return-1}var MousePos={x:0,y:0,x_pct:0,y_pct:0,px:0,py:0,sx:0,sy:0,stage_x:0,stage_y:0,stage_x_pct:0,stage_y_pct:0,clicked:!1,touched:!1},convertTime=function(e){return t=""+(e.getHours()<10?"0"+e.getHours():e.getHours())+":"+(e.getMinutes()<10?"0"+e.getMinutes():e.getMinutes()),t};