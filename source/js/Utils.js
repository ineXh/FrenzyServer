var MousePos = {x: 0, y:0, x_pct: 0, y_pct: 0, px: 0, py: 0, sx: 0, sy: 0,
				stage_x: 0, stage_y: 0, stage_x_pct:0, stage_y_pct:0, clicked: false, touched: false};
function getMouse(event, touchobj){
	//console.log(touchobj)
	MousePos.px = MousePos.x;
	MousePos.py = MousePos.y;
	if(touchobj != undefined){
		MousePos.x = touchobj.clientX;
		MousePos.y = touchobj.clientY;
		//console.log(touchobj)


	}else if(event.clientX != undefined) {
		//console.log(event)
		MousePos.x = event.clientX;//data.global.x;
        MousePos.y = event.clientY;//data.global.y;
        //console.log(MousePos);
	}else{
		//console.log(event)
		MousePos.x = event.data.global.x;
		MousePos.y = event.data.global.y;
	}
	MousePos.x_pct = MousePos.x / width;
	MousePos.y_pct = MousePos.y / height;
	MousePos.stage_x = MousePos.x - stage.x;
	MousePos.stage_y = MousePos.y - stage.y;
	MousePos.stage_x_pct = MousePos.stage_x / stage_width;
	MousePos.stage_y_pct = MousePos.stage_y / stage_height;

}
function onMouseStart(event){
	//console.log("mouse start")
	getMouse(event, undefined);
	MousePos.sx = MousePos.x;
	MousePos.sy = MousePos.y;
	//document.addEventListener("mousemove", onMouseMove, false);
    if(drag(MousePos.x, MousePos.y)){
        return;
    }
	MousePos.touched = true;

    if(game != undefined) game.onTouchStart();

}
function onMouseMove(event){
    if(!MousePos.touched) return;
    //console.log("onMouseMove")
	getMouse(event, undefined);

    if(game != undefined) game.onTouchMove();
}
function onMouseUp(event){
    if(!MousePos.touched) return;
    //console.log("mouse up")
	getMouse(event, undefined);

    MousePos.touched = false;

    if(game != undefined) game.onTouchEnd();
}
function onTouchStart(event){

    //$( "#draggable" ).position()
	//console.log(event.changedTouches[0]);
    event.preventDefault();
	getMouse(event, event.changedTouches[0]);
	MousePos.sx = MousePos.x;
	MousePos.sy = MousePos.y;
	//console.log(MousePos);
	/*if(drag(MousePos.x, MousePos.y)){
        return;
    }*/
    MousePos.touched = true;
    //console.log('touched')
    if(game != undefined) game.onTouchStart();

    /*var input = {   x: MousePos.stage_x_pct*stage_width,
                    y: MousePos.stage_y_pct*stage_height,
                    type: CharacterType.Hut, team: this.team, color: this.color};
	var character = characters.spawn(input);
	if(character != null) characters.characters[input.type].push(character);*/

    //characters.spawn({x: MousePos.stage_x_pct*stage_width, y:MousePos.stage_y_pct*stage_height}, CharacterType.Hut);
	/*characters.spawn({x: MousePos.stage_x_pct*stage_width, y:MousePos.stage_y_pct*stage_height}, CharacterType.Cow);
	communication.socket.emit('spawn', {x: MousePos.stage_x_pct, y:MousePos.stage_y_pct});*/
} // end onTouchStart
function onTouchMove(event){
    event.preventDefault();
    if(!MousePos.touched) return;
    //console.log('onTouchMove ' + MousePos.touched)
	getMouse(event, event.changedTouches[0]);
    //stage.x -= MousePos.px - MousePos.x;
    //stage.y -= MousePos.py - MousePos.y;

    if(game != undefined) game.onTouchMove();
} // end onTouchMove
function onTouchEnd(event){
    event.preventDefault();
    if(!MousePos.touched) return;
	//console.log('onTouchEnd')
	//getMouse(event);
	getMouse(event, event.changedTouches[0]);
	MousePos.touched = false;

    if(game != undefined) game.onTouchEnd();
	//path.addPoint(MousePos.x, MousePos.y);
	//path.drawPath();
}
function addListeners(){
    renderer.view.addEventListener("mousedown", onMouseStart, true);
    renderer.view.addEventListener("mouseup", onMouseUp, true);
    renderer.view.addEventListener("mousemove", onMouseMove, true);
    renderer.view.addEventListener("touchstart", onTouchStart, true);
    renderer.view.addEventListener("touchend", onTouchEnd, true);
    renderer.view.addEventListener("touchmove", onTouchMove, true);
    renderer.view.addEventListener("backbutton", backButtonTap, true);
}
function removeListeners(){
    renderer.view.removeEventListener("mousedown", onMouseStart, true);
    renderer.view.removeEventListener("mouseup", onMouseUp, true);
    renderer.view.removeEventListener("mousemove", onMouseMove, true);
    renderer.view.removeEventListener("touchstart", onTouchStart, true);
    renderer.view.removeEventListener("touchend", onTouchEnd, true);
    renderer.view.removeEventListener("touchmove", onTouchMove, true);
    renderer.view.removeEventListener("backbutton", backButtonTap, true);
}
function drag(x,y){
    if($( "#chatwindow" ).length < 1) return false;
    var left = $( "#chatwindow" ).position().left;
    var right = left + $( "#chatwindow" ).width()*1.2;
    var top = $( "#chatwindow" ).position().top;
    var bot = top + $( "#chatwindow" ).height()*1.2;
    //console.log(( x > right || x < left || y > bot || y < top))
    return !( x > right || x < left || y > bot || y < top);
}


function backButtonTap(){

}

function stayinBorder(pos){
	temp = pos.clone();
	temp.sub(new PVector(stage_width/2, stage_height/2));
	if(temp.mag() > stage_width/2){
		var ang = Math.atan2(temp.y, temp.x);
		pos.x = stage_width/2 + stage_width/2*Math.cos(ang);
		pos.y = stage_height/2 + stage_height/2*Math.sin(ang);
	}
}
function findDist(a, b) {
  return PVector.dist(a, b);
} // end findDist
function intersectCR(cx,cy,cr,rx,ry,rw,rh){
	var circleDistance = new PVector(0,0);
	circleDistance.x = Math.abs(cx-rx);
	circleDistance.y = Math.abs(cy-ry);
	if(circleDistance.x > (rw/2 + cr)) return false;
	if(circleDistance.y > (rh/2 + cr)) return false;
	if(circleDistance.x <= (rw/2)) return true;
	if(circleDistance.y <= (rh/2)) return true;

	var cornerDistance_sq = (circleDistance.x - rw/2)*(circleDistance.x - rw/2) + (circleDistance.y - rh/2)*(circleDistance.y - rh/2);
	return (cornerDistance_sq <= (cr*cr));
} // end intersectCR
function withinDist(pos, other, r){
	var d = PVector.dist(pos, other);
	//console.log(r)
	if(d < r) return true;
	return false;
} // end withinDist
function checkonScreen(pos){
	var right = -stage.x + width;
	var left = -stage.x;
	var bot = -stage.y + height;
	var top = -stage.y;

	if(pos.x > right) return false;
	if(pos.x < left) return false;
	if(pos.y < top) return false;
	if(pos.y > bot) return false;
	return true;
} // end checkonScreen
function RGBColor(r,g,b){
	return (r * 65536 + g * 256 + b);
}
function getRndColor() {
    /*var r = 255*Math.random()|0,
        g = 255*Math.random()|0,
        b = 255*Math.random()|0;
    return (r * 65536 + g * 256 + b)//'rgb(' + r + ',' + g + ',' + b + ')';*/
    return Math.random() * 0xFFFFFF;
}
function getRngColor(r1,r2,g1,g2,b1,b2) {
    var r = r2*Math.random()|r1,
        g = g2*Math.random()|g1,
        b = b2*Math.random()|b1;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}
// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function getBound(r){
	if(r.anchor == undefined){
		r.anchor = {x: 0.5, y: 0.5};
	}
	//console.log(r)
	r.right = (r.x + Math.abs(r.width)*(1-r.anchor.x));
	//console.log(r.right)
	r.left = (r.x - Math.abs(r.width)*(r.anchor.x));
	r.bot = (r.y + Math.abs(r.height)*(1-r.anchor.y));
	r.top = (r.y - Math.abs(r.height)*(r.anchor.y));
}
// for sprite
function isIntersecting(r1, r2) {
	// object 2 is Right of object 1?
	var right 	= (r2.x - Math.abs(r2.width)*(r2.anchor.x)) >= (r1.x + Math.abs(r1.width)*(1-r1.anchor.x));
	var left 	= (r2.x + Math.abs(r2.width)*(1-r2.anchor.x)) <= (r1.x - Math.abs(r1.width)*(r1.anchor.x));
	var bot 	= (r2.y - Math.abs(r2.height)*(r2.anchor.y)) >= (r1.y + Math.abs(r1.height)*(1-r1.anchor.y));
	var top 	= (r2.y + Math.abs(r2.height)*(1-r2.anchor.y)) <= (r1.y - Math.abs(r1.height)*(r1.anchor.y));
	//console.log("right " + right);
	//console.log("left " + left);
	//console.log("bot " + bot);
	//console.log("top " + top);
return !( right || left || bot || top);
}
function isTouching(x,y, r2){
    if(x > r2.x && x < r2.x + r2.width && y > r2.y && y < r2.y + r2.height) return true;
    return false;
}


function map(x, x_min, x_max, x_min_new, x_max_new){
	var pct = (x - x_min) / (x_max - x_min);
	return (pct * (x_max_new-x_min_new) + x_min_new);
}
function getRandomTop(){
	var pos = new PVector(getRandomArbitrary(-stage_width*0.1, stage_width*1.1), -stage_height*0.1)
	return pos;
}
function getRandomLeft(){
	var pos = new PVector(-stage_width*0.1, getRandomArbitrary(-stage_height*0.1, stage_height*1.1))
	return pos;
}
function getRandomRight(){
	var pos = new PVector(stage_width*1.1, getRandomArbitrary(-stage_height*0.1, stage_height*1.1))
	return pos;
}
function getRandomBot(){
	var pos = new PVector(getRandomArbitrary(-stage_width*0.1, stage_width*1.1), stage_height*1.1)
	return pos;
}
function getRandomBorder(){
	switch(getRandomInt(1, 5)){
		case 1:
			return getRandomTop();
			break;
		case 2:
			return getRandomLeft();
			break;
		case 3:
			return getRandomRight();
			break;
		case 4:
			return getRandomBot();
			break;
		default:
			return getRandomTop();
			break;
	}
}
function lock(theta){
	while(theta > 2*PI) theta -= 2*PI;
	while(theta < 0) theta += 2*PI;
	return theta;
}
function lock_x(pos){
	return (pos < 0) ? 0 : 	(pos > width)? width : pos;
}
function lock_y(pos){
	return (pos < 0) ? 0 : 	(pos > ground)? ground : pos;
}
// A function to get the normal point from a point (p) to a line segment (a-b)
// This function could be optimized to make fewer new Vector objects
function getNormalPoint(p, a, b){
	// Vector from a to p
  var ap = PVector.sub(p, a);
  // Vector from a to b
  var ab = PVector.sub(b, a);
  ab.normalize(); // Normalize the line
  // Project vector "diff" onto line by using the dot product
  ab.mult(ap.dot(ab));
  var normalPoint = PVector.add(a, ab);
  return normalPoint;
}
// note: crossproduct - 0 on the line, +1 on one side, -1 on other side
function isBetween(p, a, b){
  var crossproduct = (p.y - a.y) * (b.x - a.x) - (p.x - a.x) * (b.y - a.y);
  if (Math.abs(crossproduct) > 1) return false;
  var dotproduct = (p.x - a.x) *(b.x - a.x) + (p.y - a.y) * (b.y - a.y);
  var squaredlengthba = (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
  if (dotproduct < 0) return false;
  if ( dotproduct > squaredlengthba) return false;
  return true;
} // end isBetween
function crossproduct(p, a, b){
	return ((p.y - a.y) * (b.x - a.x) - (p.x - a.x) * (b.y - a.y));
}

function applyForce(force) {
    // We could add mass here if we want A = F / M
    //console.log(this);
    //console.log("this.accel: ");
    //console.log(this.accel);
    this.accel.add(force);
  }

function simulateMouseEvent (event, simulatedType) {
        //console.log(event)
    // Ignore multi-touch events
    if (event.touches.length > 1) {
      return;
    }

    event.preventDefault();

    var touch = event.changedTouches[0],
        simulatedEvent = document.createEvent('MouseEvents');

    // Initialize the simulated mouse event using the touch event's coordinates
    simulatedEvent.initMouseEvent(
      simulatedType,    // type
      true,             // bubbles
      true,             // cancelable
      window,           // view
      1,                // detail
      touch.screenX,    // screenX
      touch.screenY,    // screenY
      touch.clientX,    // clientX
      touch.clientY,    // clientY
      false,            // ctrlKey
      false,            // altKey
      false,            // shiftKey
      false,            // metaKey
      0,                // button
      null              // relatedTarget
    );

    // Dispatch the simulated event to the target element
    event.target.dispatchEvent(simulatedEvent);
  }
