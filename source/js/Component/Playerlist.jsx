var GamePlayerListItem = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

  render: function() {
    return (
      <li><h2>{this.props.name} - Team {this.props.team}</h2></li>
    );
  }
});

window.GamePlayerList = React.createClass({
  getInitialState: function() {
        return {players: [], team: myteam,
                showteam0: true, showteam1: true,
                showteam2: true, showteam3: true};
    },
  onGamePlayerList:function(msg){
    console.log('onGamePlayerList')
    console.log(msg)
    this.setState({players: msg.players,
                  showteam0: true, showteam1: true,
                  showteam2: true, showteam3: true});
    var list = this;
    msg.players.forEach(function(p){
      if(p.team == Team.Team0) list.state.showteam0 = false;
      if(p.team == Team.Team1) list.state.showteam1 = false;
      if(p.team == Team.Team2) list.state.showteam2 = false;
      if(p.team == Team.Team3) list.state.showteam3 = false;
    });

  },
  componentDidMount: function(){
        console.log('GamePlayerList didmount')
        this.socket = communication.socket;
        this.socket.on('game player list', this.onGamePlayerList);
        //this.socket.emit('request chat', '');
        //var list = this;

    },
  handleChange:function(event){
    this.setState({team: event.target.value});
    console.log(event.target.value)
    this.socket.emit('GameRoom Change Team', event.target.value);
  },
  render: function() {
    var playerNodes = this.state.players.map(function(player, index){
    return (
        <GamePlayerListItem name={player.name} team={player.team} key={index}>
        </GamePlayerListItem>
      );
    });
    return (
      <div id="gameplayerlist" className="windowobject">
        <ol id="gameroomplayerlist" className="tabBodyOptions selectable">
          <li><h2>Select your Team:</h2>
            <select name="playerteam" id="gameroom_playerteam"
              value={ this.state.team} onChange={this.handleChange}>
              { this.state.showteam0 ? <option value="0">Team 0</option> : null }
              { this.state.showteam1 ? <option value="1">Team 1</option> : null }
              { this.state.showteam2 ? <option value="2">Team 2</option> : null }
              { this.state.showteam3 ? <option value="3">Team 3</option> : null }
              <option value="4">Observer</option>
            </select>
          </li>
          {playerNodes}
        </ol>
      </div>
      );
  }
}); // end GamePlayerList
