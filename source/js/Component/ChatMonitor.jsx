window.ChatMonitor = React.createClass({
    getInitialState: function() {
        return {value: 'Hello!', count:0, chats: [],
        showMonitor: true, showMinimize: true,
        ChatRoom: ''};
    },
    tick: function() {
      //this.setState({count: this.state.count + 1});
    },
    mountDrag:function(){

    },
    onChat:function(msg){


      //console.log('get chat')
      //this.state.chats.push(msg);
      //console.log(msg)
      var mon = document.getElementById("chatmonitor");
      if(Object.prototype.toString.call( msg ) === '[object Array]'){
        msg.forEach(function(m){
          if(ChatRoom == 'Global') globalChats.push(m);
          else gameChats.push(m);
        })

        /*console.log(mon)
        console.log(mon.scrollTop)
        console.log(mon.scrollHeight)
        mon.scrollTop = mon.scrollHeight*2;
        console.log(mon.scrollTop)
        console.log(mon.scrollHeight)*/
      }else{
        if(ChatRoom == 'Global')  globalChats.push(msg);
        else gameChats.push(msg);
        /*console.log('' + (mon.scrollTop / mon.scrollHeight))
        // Scroll to Bottom
        if(mon.scrollTop / mon.scrollHeight > 0.7){
          console.log('scroll')
          mon.scrollTop = mon.scrollHeight;
        }*/
      }
      if(ChatRoom == 'Global')  this.setState({chats: globalChats});
      else this.setState({chats: gameChats})
      // Scroll to Bottom
      if(mon != null) mon.scrollTop = mon.scrollHeight;




      //this.setState({chats: msg.games});
      //Object.prototype.toString.call( a ) === '[object Array]'
      //if(msg.length > 1){
      /*if(Object.prototype.toString.call( msg ) === '[object Array]'){
        msg.forEach(function(m){
          placechat(m)
        })
      }else{
        placechat(msg)
      }*/
      //msg.forEach(function(m){

      //})
      //placechat(msg[0])
      //this.forceUpdate();
      //this.setState({chats: msg});

    },
    componentDidMount: function(){
        //console.log('chat monitor did mount')
        this.socket = communication.socket;
        this.socket.on('chat', this.onChat);
        //this.socket.emit('request chat', '');

        this.touchprocess();
        this.setState({ChatRoom: ChatRoom + ' Chat Room'});

        if(gamestate != GameState.InPlay) this.setState({showMinimize: false});
        if(ChatRoom == 'Global'){
          this.setState({chats: globalChats}, function(){
            var mon = document.getElementById("chatmonitor");
            mon.scrollTop = mon.scrollHeight;
          });
        }else{
          this.setState({chats: gameChats}, function(){
            var mon = document.getElementById("chatmonitor");
            mon.scrollTop = mon.scrollHeight;
          });
        }
    },
    touchprocess:function(){
      var scrollStartPos = 0;
        $( "#chatwindow" ).draggable({ containment: "document", scroll: false, cancel: ".non-draggable" });
        $( "#chatwindow" ).resizable({
          maxHeight: 1000,
          maxWidth: 1000,
          minHeight: 50,//150,
          minWidth: 50,
          cancel: ".non-resizeable"});//200});//{ cancel: "#chatmonitor" }*/
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

        var cb = document.getElementById("chatinput");
        cb.focus();
    },
    componentWillUnmount: function(){
      //console.log('chat monitor will unmount')
      this.socket.removeListener('chat', this.onChat);
    },
    handleChange: function(event) {
        //console.log(event)
        this.setState({value: event.target.value});
    },
    handleSubmit: function(e) {
        //console.log('handleSubmit')
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
    minimize:function(e){
      e.preventDefault();
      var win = document.getElementById("chatwindow");
      win.style.width = "8%"
      win.style.height = "8%"
      //console.log('minimize')
      this.setState({showMonitor: false});
    },
    restore: function(e){
      e.preventDefault();

      this.setState({showMonitor: true}, function(){
        this.shrink(e);
        var cb = document.getElementById("chatinput");
        cb.focus();
      });
    },
    expand:function(e){
      e.preventDefault();
      var win = document.getElementById("chatwindow");
      win.style.left = "5%"
      win.style.top = "5%"
      win.style.width = "90%"
      win.style.height = "90%"
      var mon = document.getElementById("chatmonitor");
      mon.style.height = "80%"
    },
    shrink:function(e){
      e.preventDefault();
      var win = document.getElementById("chatwindow");
      win.style.left = "15%"
      win.style.top = "70%"
      win.style.width = "40%"
      win.style.height = "20%"
      var mon = document.getElementById("chatmonitor");
      mon.style.height = "50%"
    },
    drag:function(e){
      e.preventDefault();
      console.log('dragging')
    },
    render: function() {
        var value = this.state.value;
        var count = this.state.count;

        var chatNodes = this.state.chats.map(function(chat, index){
        return (
            <ChatListItem
              time  = {chat.time}
              msg   = {chat.msg}
              author= {chat.author}
              color = {chat.color}
              key   = {index}>
            </ChatListItem>
          );
        });

          return (
            this.state.showMonitor ? (
            <div id="chatwindow" className="windowobject chat ui-draggable">
                <div className="panel-heading"> {this.state.ChatRoom}

                {this.state.showMinimize ? (
                [<input id="minimizebutton" key = "1" onClick={this.minimize} type="image" src="assets/minimize.png" width="24" height="24"></input>,
                <input id="expandbutton" key = "2" onClick={this.expand} type="image" src="assets/expand.png" width="24" height="24"></input>,
                <input id="expandbutton" key = "3" onClick={this.shrink} type="image" src="assets/expand.png" width="24" height="24"></input>]
                ) : null}



                </div>
                  <div id="chatmonitor" className="non-draggable">
                  {chatNodes}
                  </div>

                  <form className="chatForm non-draggable" onSubmit={this.handleSubmit}>
                      <input id="chatinput" className="inputchat" type="text" ref="chatmsg"
                              placeholder="Type here..."/>
                  </form>
            </div>
            ) : (
            <div id="chatbutton" className = "non-resizeable">
            <input onClick={this.restore}
            type="image" src="assets/chat2.png" width="72" height="72"></input>
            </div>
            )

        );

    }
});

var ChatListItem = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

  render: function() {
    //var state = getGameState(this.props.state);//'GameRoom';
    //console.log(this.props)
    var color = '#' + this.props.color.toString(16);
    var time = convertTime(new Date(this.props.time));
    var divStyle = {
    color: color
    };
    return (
      <p><span style={divStyle}>{this.props.author}</span> @ {time}: <span style={divStyle}>{this.props.msg}</span></p>
    );
  }
});
/**/
/*<p><span style="color:#' + (msg.color).toString(16) + '">' + msg.author + '</span> @ ' + convertTime(new Date(msg.time)) + ': ' + '<span style="color:#' + (msg.color).toString(16) + '">' + msg.msg + '</span></p>'*/

/*
<input id="chatbutton" onClick={this.minimize} type="image" src="assets/chat2_lo.png" width="24" height="24"></input>


<form onSubmit={this.minimize}></form>
<button onClick={this.handleSubmit}>Join Game</button>
                <input type="image" src="assets/minimize_lo.png" alt="Submit" width="48" height="48">
/*<div id="chatwindow" className="windowobject chat ui-draggable">
                <div className="panel-heading"> Global Chat
                <button onClick={this.handleSubmit}>Join Game</button>
                </div>
                <div id="chatmonitor" className="non-draggable">
                </div>


                <form className="chatForm non-draggable" onSubmit={this.handleSubmit}>
                    <input id="chatinput" className="inputchat" type="text" ref="chatmsg"
                            placeholder="Type here..."/>
                </form>
            </div>*/
//<ChatList chats={this.state.chats}/>

window.myChatMonitor = React.createFactory(ChatMonitor);
window.render_myChatMonitor = function() {
  ReactDOM.render(myChatMonitor({ foo: 'bar' }), document.getElementById('content'));
}
/*window.ChatList = React.createClass({
  render: function () {
    var Chats = (<div>Loading chats...</div>);
    //console.log(this.props)
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


/**/
