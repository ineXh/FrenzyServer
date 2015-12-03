window.ChatMonitor = React.createClass({
    getInitialState: function() {
        return {value: 'Hello!', count:0, chats: []};
    },
    tick: function() {
      //this.setState({count: this.state.count + 1});
    },
    mountDrag:function(){

    },
    onChat:function(msg){
      console.log('get chat')
      //this.state.chats.push(msg);
      console.log(msg)
      //Object.prototype.toString.call( a ) === '[object Array]'
      //if(msg.length > 1){
      if(Object.prototype.toString.call( msg ) === '[object Array]'){
        msg.forEach(function(m){
          placechat(m)
        })
      }else{
        placechat(msg)
      }
      //msg.forEach(function(m){

      //})
      //placechat(msg[0])
      //this.forceUpdate();
      //this.setState({chats: msg});

    },
    componentDidMount: function(){
        console.log('chat monitor didmount')
        this.socket = communication.socket;
        this.socket.on('chat', this.onChat);
        //this.socket.emit('request chat', '');

        this.interval = setInterval(this.tick, 1000);

        var scrollStartPos = 0;
        $( "#chatwindow" ).draggable({ containment: "document", scroll: false, cancel: ".non-draggable" });
        $( "#chatwindow" ).resizable({
          maxHeight: 850,
          maxWidth: 850,
          minHeight: 150,
          minWidth: 200});//{ cancel: "#chatmonitor" }
        $( "#chatmonitor" )[0].addEventListener("touchstart", function(event) {scrollStartPos=this.scrollTop+event.touches[0].pageY*1.5;
            event.preventDefault();
        },false);

        $( "#chatmonitor" )[0].addEventListener("touchmove", function(event) {
            this.scrollTop=scrollStartPos-event.touches[0].pageY*1.5;
            event.preventDefault();
        },false);

        $(".inputchat")[0].addEventListener("touchstart", function(e) {
             $( "#chatwindow.ui-draggable" ).draggable( "disable" );
            var cb = document.getElementById("chatinput"); //element to click on
          cb.focus();
        },false);

        $(".inputchat")[0].addEventListener("touchend", function(e) {
          $( "#chatwindow.ui-draggable" ).draggable( "enable" );

        },false);
    },
    handleChange: function(event) {
        console.log(event)
        this.setState({value: event.target.value});
    },
    handleSubmit: function(e) {
        console.log('handleSubmit')
          e.preventDefault();
          var chatmsg = this.refs.chatmsg.value.trim();
          if (!chatmsg) return;

          sendChat(chatmsg);
          // TODO: send request to the server
          /*this.props.onCommentSubmit({author: author, text: text});
          this.refs.author.value = '';
          this.refs.text.value = '';*/
          this.refs.chatmsg.value = '';
          return;
    },
    render: function() {
        var value = this.state.value;
        var count = this.state.count;

          return (
            <div id="chatwindow" className="windowobject chat ui-draggable">
                <div id="chatmonitor" className="non-draggable">

                </div>


                <form className="chatForm non-draggable" onSubmit={this.handleSubmit}>
                    <input id="chatinput" className="inputchat" type="text" ref="chatmsg"
                            placeholder="Type here..."/>
                </form>
                <div>Count: {this.state.count}</div>
            </div>
        );

    }
});
//<ChatList chats={this.state.chats}/>

window.myChatMonitor = React.createFactory(ChatMonitor);
window.render_myChatMonitor = function() {
  ReactDOM.render(myChatMonitor({ foo: 'bar' }), document.getElementById('content'));
}
window.ChatList = React.createClass({
  render: function () {
    var Chats = (<div>Loading chats...</div>);
    console.log(this.props)
    if (this.props.chats) {
      Chats = this.props.chats.map(function (chat) {

        return (<Chat key={chat.id} chat={chat} />);
      });
    }
    return (
      <div className="chatList">
        {Chats}
      </div>
    );
  }
});

window.Chat = React.createClass({
    rawMarkup: function() {
      var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
      return { __html: rawMarkup };
    },
    getStyles:function(){
      //console.log( {this.props.chat.color})
      return {color:'Red'};
      /*return Object.assign(
        {},
        item.props.complete && styles.complete,
        item.props.due && styles.due,
        item.props.due && this.props.dueStyles
      );*/
    },
    render: function() {
      //var color = {this.props.chat.color};
      //console.log(color)
      return (
        <div className="chat">
          <p><span style={this.getStyles()}>{this.props.chat.author}: {this.props.chat.msg}</span></p>
        </div>
      );
    }
  });



window.loginWindow = React.createClass({
  handleSubmit: function(e) {
        console.log('handleSubmit')
          e.preventDefault();
          var nameinput = this.refs.nameinput.value.trim();
          if (!nameinput) return;
          sendName(nameinput);
          //this.refs.nameinput.value = '';
          return;
  },
  render: function() {
    return (
        <div className="loginwindow">
          <h1>Enter Your Nickname:</h1>
          <form className="nameForm non-draggable" onSubmit={this.handleSubmit}>
                    <input id="nameinput" className="namechat" type="text" ref="nameinput" maxLength="14"/>
                </form>
        </div>
      );
  }
});
window.myloginWindow = React.createFactory(loginWindow);
window.render_myloginWindow = function() {
  ReactDOM.render(myloginWindow({ foo: 'bar' }), document.getElementById('content'));
}

window.GameList = React.createClass({
  getInitialState: function() {
        return {games: [], index: 0};
    },
  onGameList:function(msg){
      //console.log('componentx get game list')
      //this.state.chats.push(msg);
      //console.log(msg)
      //this.forceUpdate();
      //this.setState({games: msg});
      msg.games.forEach(function(g){
        placegame(g, 1);
      });

    },
  componentDidMount: function(){
        console.log('GameList didmount')
        this.socket = communication.socket;
        this.socket.on('game list', this.onGameList);
        //this.socket.emit('request chat', '');
        var list = this;
        $( ".selectable" ).selectable({
          /*selected: function( event, ui ) {
            console.log('selected')
          }*/
          stop: function() {
            console.log('selectable stop')

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
  getIndex: function(){
    console.log('selectable stop')
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
    return (
      <div id="gamelist" className=" windowobject">
        <ol id="selectable" className="tabBodyOptions selectable"></ol>
        <form onSubmit={this.handleSubmit} className="MyForm">
          <button type="submit">Join Game</button>
        </form>
      </div>
      );
  }
});
/*<div id="dashboardBody" className="gamelist">
       <span>"You've selected:"</span> <span id="select-result">none</span>
        <ol id="gamelist" className="tabBodyOptions selectable">
        </ol>
    </div>*/
window.myGameList = React.createFactory(GameList);
window.render_mygameList = function() {
  ReactDOM.render(myGameList({ foo: 'bar' }), document.getElementById('content'));
}



window.GamePlayerList = React.createClass({
  getInitialState: function() {
        return {players: [], team: "4",
                showteam0: true, showteam1: true,
                showteam2: true, showteam3: true};
    },
  onGamePlayerList:function(msg){
    console.log(msg)     
      /*msg.players.forEach(function(p){
        //placegame(g, 1);
      });*/
    },
  componentDidMount: function(){
        console.log('GamePlayerList didmount')
        this.socket = communication.socket;
        this.socket.on('game player list', this.onGameList);
        //this.socket.emit('request chat', '');
        var list = this;
        
      },   
  handleChange:function(event){
    this.setState({team: event.target.value});
  }, 
  render: function() {
    return (
      <div id="gameplayerlist" className="windowobject">
        <ol id="selectable" className="tabBodyOptions selectable">
          <li><h2>{this.props.username}</h2>
            <select name="playerteam" id="gameroom_playerteam" 
              value={ this.state.team} onChange={this.handleChange}>
              { this.state.showteam0 ? <option value="0">Team 0</option> : null }
              { this.state.showteam1 ? <option value="1">Team 1</option> : null }
              { this.state.showteam2 ? <option value="2">Team 2</option> : null }
              { this.state.showteam3 ? <option value="3">Team 3</option> : null }
              <option value="4">Observer</option>
            </select>
          </li>          
        </ol>        
      </div>
      );
  }
}); // end GamePlayerList

/**/