window.MainInterface = React.createClass({
  componentDidMount: function(){
        console.log('main didmount')
        this.socket = communication.socket;
        //this.socket.on('chat', this.onChat);
        //this.socket.emit('request chat', '');
      },
  render: function() {
    //<GameList/>
    return (
      <div className="maininterface">
        <GameList />
        <ChatMonitor />
        </div>
      );
  }
});
window.myMainInterface = React.createFactory(MainInterface);
window.render_mymainInterface = function() {
  ReactDOM.render(myMainInterface({ foo: 'bar' }), document.getElementById('content'));
}

window.InterfaceEmpty = React.createClass({
  render: function() { return false; }
});
window.myInterfaceEmpty = React.createFactory(InterfaceEmpty);
window.render_empty = function() {
  ReactDOM.render(myInterfaceEmpty({ foo: 'bar' }), document.getElementById('content'));
}

window.GameWaitInterface = React.createClass({
  componentDidMount: function(){
        console.log('gamewait didmount')
        this.socket = communication.socket;
        //this.socket.on('chat', this.onChat);
        //this.socket.emit('request chat', '');
      },
  render: function() {
    //<GameList/>
    return (
      <div className="gamewaitinterface">
        <GameList />
        <ChatMonitor />
        </div>
      );
  }
});
window.myGameWaitInterface = React.createFactory(GameWaitInterface);
window.render_mygamewaitInterface = function() {
  ReactDOM.render(myMainInterface({ foo: 'bar' }), document.getElementById('content'));
}
