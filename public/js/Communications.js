function Communications(){
	this.init();
}
Communications.prototype = {
	init: function(){
		this.socket = io.connect('http://10.224.63.243:90/');
		this.socket.on('chat', function(msg){
			console.log('chat')
			this.emit('chat', 'hey')
		});
	},
	update: function(time){

	},
}; // end Communications
