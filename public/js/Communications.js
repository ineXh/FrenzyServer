function Communications(){
	this.init();
}
Communications.prototype = {
	init: function(){
		this.socket = io.connect('http://localhost:80/');
		//this.socket = io.connect('http://104.197.217.162:80/');
		this.socket.on('chat', onChat);
		this.socket.on('spawn', onSpawn);

	},
	update: function(time){

	},
}; // end Communications

function onChat(msg){
	console.log(msg)
}
function onSpawn(msg){
	characters.spawn({x: msg.x*stage_width, y: msg.y*stage_height}, CharacterType.Cow);
}
