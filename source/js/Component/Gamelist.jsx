var GameListItem = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

  render: function() {
    var state = getGameState(this.props.state);//'GameRoom';
    return (
      <li><h2>{this.props.gamename}</h2><h4>{state} - {this.props.players}/4Players</h4></li>
    );
  }
});
//<span>{this.props.players}/4Players</span></h2></li>

window.GameList = React.createClass({
  getInitialState: function() {
        return {games: [], index: 0};
    },
  onGameList:function(msg){
      //console.log('componentx get game list')
      //console.log(msg)
      //this.setState({games: msg});
      /*msg.games.forEach(function(g){
        placegame(g);
      });*/
      this.setState({games: msg.games});
      //this.state.game = msg;

    },
  componentDidMount: function(){
        //console.log('GameList didmount')
        this.socket = communication.socket;
        this.socket.on('game list', this.onGameList);
        //setTimeout(function(){communication.socket.emit('request game list');}, 500);
        //this.socket.emit('request chat', '');
        var list = this;
        $( ".selectable" ).selectable({
          /*selected: function( event, ui ) {
            console.log('selected')
          }*/
          stop: function() {
            //console.log('selectable stop')

            //var result = $( "#select-result" ).empty();
            $( ".ui-selected", this ).each(function() {
              var index = $( "#selectable li" ).index( this );
              if(index == -1) return;
              //console.log('index ' + index)
              //console.log(list)
              list.setState({index: index});
              return;
              //result.append( " #" + ( index + 1 ) );
            });
          }
        });
      },
      componentWillUnmount: function(){
      //console.log('GameList will unmount')
      this.socket.removeListener('game list', this.onGameList);
    },
  getIndex: function(){
    //console.log('selectable stop')
     var list = this;
     $( ".ui-selected", this ).each(function() {
        var index = $( "#selectable li" ).index( this );
        console.log('index ' + index)
        console.log(list)
        list.setState({index: index});
        return;
        //result.append( " #" + ( index + 1 ) );
      });
  },
  handleSubmit: function(e) {
    e.preventDefault();
    //console.log('index ' + this.state.index)
    joinGame(this.state.index)
    //console.log('handle Submit');
    return;
  },
  render: function() {
    //console.log(this.state)
    //{game.state}

    var gameNodes = this.state.games.map(function(game, index){
    return (
        <GameListItem gamename={game.name} players={game.players} state={game.state} key={index}>
        </GameListItem>
      );
    });
    return (
      <div id="gamelist" className="windowobject">
      <div className="panel-heading"> Active Games
      <button onClick={this.handleSubmit}>Join Game</button>
      </div>
      <ol id="selectable" className="tabBodyOptions selectable">
        {gameNodes}
      </ol>

      </div>
    );
  }
});
/*return (
      <div id="gamelist" className=" windowobject">
        <ol id="selectable" className="tabBodyOptions selectable"></ol>
        <button onClick={this.handleSubmit}>Join Game</button>
      </div>
      );*/

window.myGameList = React.createFactory(GameList);
window.render_mygameList = function() {
  ReactDOM.render(myGameList({ foo: 'bar' }), document.getElementById('content'));
}
