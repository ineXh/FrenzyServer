

/*var data = [
        {author: "Pete Hunt", text: "This is one msg"},
        {author: "Jordan Walke", text: "This is *another* msg"}
    ];*/

var ChatMonitor = React.createClass({
    getInitialState: function() {
        return {value: 'Hello!', count:0, chats: []};
    },
    tick: function() {
      this.setState({count: this.state.count + 1});
    },
    mountDrag:function(){

    },
    onChat:function(){
      console.log('get chat')
    },
    componentDidMount: function(){
        this.socket = communications.socket;
        this.socket.on('chat', this.onChat);

        console.log('did mount')
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
                <p><span>asfd</span></p>
                <p><span>asfd</span></p>
                <p><span>asfd</span></p>
                <p><span>asfd</span></p>
                <p><span>asfd</span></p>
                <p><span>asfd</span></p>
                </div>
                <form className="commentForm non-draggable" onSubmit={this.handleSubmit}>
                    <input id="chatinput" className="inputchat" type="text" defaultValue="Hey!" ref="chatmsg"/>;
                    <input id="chatsendbutton" type="submit" value="Post" />
                </form>
                <div>Count: {this.state.count}</div>
            </div>
        );

    }
  });


var Chat = React.createClass({
    rawMarkup: function() {
      var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
      return { __html: rawMarkup };
    },
    render: function() {
      return (
        <div className="chat">
          <h2 className="chatAuthor">
            Bob
            //{this.props.author}
          </h2>
          //<span dangerouslySetInnerHTML={this.rawMarkup()} />
        </div>
      );
    }
  });


    /*ReactDOM.render(

//var startChat = function(){
  ReactDOM.render(


          //<CommentBox data={data} />,
          //<CommentBox url="/api/comments" />,
          //<CommentBox url="/api/comments" pollInterval={2000} />,
          <ChatMonitor />,
          document.getElementById('content')
      );

*/

