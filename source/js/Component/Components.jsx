

/*var data = [
        {author: "Pete Hunt", text: "This is one msg"},
        {author: "Jordan Walke", text: "This is *another* msg"}
    ];*/

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
      //this.forceUpdate();
      this.setState({chats: msg});

    },
    componentDidMount: function(){
        console.log('chat monitor didmount')
        this.socket = communication.socket;
        this.socket.on('chat', this.onChat);
        this.socket.emit('request chat', '');

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
            <div id="chatwindow" className="chat ui-widget-content ui-draggable">
                <div id="chatmonitor" className="non-draggable">
                  <ChatList chats={this.state.chats}/>
                </div>

                
                <form className="chatForm non-draggable" onSubmit={this.handleSubmit}>
                    <input id="chatinput" className="inputchat" type="text" ref="chatmsg"
                            placeholder="Type here..."/>
                    <input id="chatsendbutton" type="submit" value="Send" />
                </form>
                <div>Count: {this.state.count}</div>
            </div>
        );

    }
});

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
  componentDidMount: function(){
        console.log('GameList didmount')
        this.socket = communication.socket;
        //this.socket.on('chat', this.onChat);
        //this.socket.emit('request chat', '');
      },
  render: function() {
    return (
        <div className="gamelist">
          <h1>hi</h1>
        </div>
      );
  }
});
window.myGameList = React.createFactory(GameList);
window.render_mygameList = function() {
  ReactDOM.render(myGameList({ foo: 'bar' }), document.getElementById('content'));
}

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



    //ReactDOM.render(

/*window.startChat = function(){
ReactDOM.render(


          //<CommentBox data={data} />,
          //<CommentBox url="/api/comments" />,
          //<CommentBox url="/api/comments" pollInterval={2000} />,
          <ChatMonitor />,
          document.getElementById('content')
      );
}
*/
