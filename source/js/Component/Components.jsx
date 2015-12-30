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
      //console.log('get chat')
      //this.state.chats.push(msg);
      //console.log(msg)
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
        //console.log('chat monitor did mount')
        this.socket = communication.socket;
        this.socket.on('chat', this.onChat);
        //this.socket.emit('request chat', '');

        this.interval = setInterval(this.tick, 1000);

        var scrollStartPos = 0;
        $( "#chatwindow" ).draggable({ containment: "document", scroll: false, cancel: ".non-draggable" });
        $( "#chatwindow" ).resizable({
          maxHeight: 850,
          maxWidth: 850,
          minHeight: 150,//150,
          minWidth: 200});//200});//{ cancel: "#chatmonitor" }*/
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
    render: function() {
        var value = this.state.value;
        var count = this.state.count;

          return (
            <div id="chatwindow" className="windowobject chat ui-draggable">
                <div className="panel-heading"> Global Chat
                <button onClick={this.handleSubmit}>Join Game</button>
                </div>
                  <div id="chatmonitor" className="non-draggable">
                  </div>

                  <form className="chatForm non-draggable" onSubmit={this.handleSubmit}>
                      <input id="chatinput" className="inputchat" type="text" ref="chatmsg"
                              placeholder="Type here..."/>
                  </form>
            </div>
        );

    }
});
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
window.ChatList = React.createClass({
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


/**/
