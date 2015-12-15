// ///////////////////////////
// Main Multiplayer Interface
// ///////////////////////////
window.MainInterface = React.createClass({
  componentDidMount: function(){
        //console.log('main didmount')
      },
  render: function() {
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

// //////////////////
// GameRoom Interface
// //////////////////
window.GameRoomInterface = React.createClass({
  componentDidMount: function(){
    //console.log('gameroom didmount')
    this.socket = communication.socket;
  },
  handleSubmitStart:function(e){
    e.preventDefault();
    startGame();
  },
   handleSubmitBack:function(e){
    e.preventDefault();
    leaveGame();
  },
  render: function() {
    return (
      <div className="gameroominterface">
        <ChatMonitor />
        <GamePlayerList username={username}/>
        <button id="gamestartbutton" onClick={this.handleSubmitStart}>Start Game</button>
        <button id="gamebackbutton" onClick={this.handleSubmitBack}>Back</button>
      </div>
      );
  }
});
window.myGameRoomInterface = React.createFactory(GameRoomInterface);
window.render_mygameroomInterface = function() {
  ReactDOM.render(myGameRoomInterface({ foo: 'bar' }), document.getElementById('content'));
}
// //////////////////
// InGame Interface
// //////////////////
window.InGameInterface = React.createClass({
  componentDidMount: function(){
    //console.log('InGame didmount')
    this.socket = communication.socket;
  },
  handleSubmitStart:function(e){
    e.preventDefault();
    startGame();
  },
   handleSubmitBack:function(e){
    e.preventDefault();
    leaveGame();
  },
  render: function() {
    return (
      <div className="ingameinterface">
        <ChatMonitor />
      </div>
      );
  }
});
window.myInGameInterface = React.createFactory(InGameInterface);
window.render_myingameInterface = function() {
  ReactDOM.render(myInGameInterface({ foo: 'bar' }), document.getElementById('content'));
}

// //////////////////
// Empty Interface
// //////////////////
window.InterfaceEmpty = React.createClass({
  render: function() { return false; }
});
window.myInterfaceEmpty = React.createFactory(InterfaceEmpty);
window.render_empty = function() {
  ReactDOM.render(myInterfaceEmpty({ foo: 'bar' }), document.getElementById('content'));
}
