var GamePlayerListItem = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

  render: function() {
    //var team = //getTeam(parseInt(this.props.team));
    //console.log(this.props)
    //if(this.props.team == undefined) return ();
    //console.log(this.props.team)
    //console.log(team)
    //console.log(getTeamColor(this.props.team))
    var color = '#' + getTeamColor(this.props.team).toString(16);//'#FF0000';
    var divStyle = {
      color: color
    };
    return (
      <li><h2>Team <span style={divStyle}>{this.props.team}</span> - {this.props.name}</h2></li>
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
    //console.log('onGamePlayerList')
    console.log(msg)

    var showteam0 = true;
    var showteam1 = true;
    var showteam2 = true;
    var showteam3 = true;

    msg.players.forEach(function(p){
      if(p.team == Team0 && p.id != playerid) showteam0 = false;
      if(p.team == Team1 && p.id != playerid) showteam1 = false;
      if(p.team == Team2 && p.id != playerid) showteam2 = false;
      if(p.team == Team3 && p.id != playerid) showteam3 = false;
    });
    this.setState({players: msg.players,
                  showteam0: showteam0, showteam1: showteam1,
                  showteam2: showteam2, showteam3: showteam3});

  },
  componentDidMount: function(){
        //console.log('GamePlayerList didmount')
        this.socket = communication.socket;
        this.socket.on('game player list', this.onGamePlayerList);
        console.log('myteam ' + myteam)
        //this.socket.emit('request chat', '');
        //var list = this;

  },
  componentWillUnmount: function(){
    game.players = this.state.players.slice();
    this.socket.removeListener('game player list', this.onGamePlayerList);
  },
  handleChange:function(event){
    this.setState({team: event.target.value});
    //console.log(event.target.value)
    this.socket.emit('GameRoom Change Team', event.target.value);
  },
  handleAddComputer: function(e){
    e.preventDefault();
    this.socket.emit('GameRoom Add Computer');
  },
  handleRemoveComputer: function(e){
    e.preventDefault();
    this.socket.emit('GameRoom Remove Computer');
  },
  render: function() {

    var playerNodes = this.state.players.map(function(player, index){
    return (
        <GamePlayerListItem name={player.name} team={index} key={index}>
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

          <button id="addComputerbutton"  onClick={this.handleRemoveComputer}>Remove Computer</button>
          <button id="addComputerbutton"  onClick={this.handleAddComputer}>Add Computer</button>


          {playerNodes}
        </ol>
      </div>
      );
  }
}); // end GamePlayerList
// player.team
