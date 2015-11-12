

/*var data = [
        {author: "Pete Hunt", text: "This is one msg"},
        {author: "Jordan Walke", text: "This is *another* msg"}
    ];*/

var ChatMonitor = React.createClass({
    getInitialState: function() {
        return {value: 'Hello!'};
    },
    componentDidMount: function(){
        console.log('did mount')
        var chatmonitor = this;
        console.log(chatmonitor)
        var scrollStartPos = 0;
        $( "#draggable" ).draggable({ cancel: ".non-draggable" });
        /*$( "#draggable" ).resizable();//{ cancel: "#chatmonitor" }
        $( "#chatmonitor" )[0].addEventListener("touchstart", function(event) {scrollStartPos=this.scrollTop+event.touches[0].pageY*1.5;
            event.preventDefault();
        },false);

        $( "#chatmonitor" )[0].addEventListener("touchmove", function(event) {
            this.scrollTop=scrollStartPos-event.touches[0].pageY*1.5;
            event.preventDefault();
        },false);
    */
        $(".inputchat")[0].addEventListener("touchstart", function(e) {
            console.log('inputchat')
            console.log(e)
            /*var mdown = new MouseEvent("click", {
                 screenX: e.screenX,
                screenY: e.screenY,
                clientX: e.clientX,
                clientY: e.clientY,
                view: window
            });
            $(".inputchat")[0].dispatchEvent(mdown);*/

            //$(this)[0].selectionStart = $(this)[0].selectionEnd = $(this).val().length;

            //$( "#draggable" ).draggable( "disable" );

        },false);
        $(".inputchatsubmit")[0].addEventListener("mousedown", function(e) {

            //console.log('pressed')
            //console.log(this)
            //chatmonitor.handleSubmit();
        },false);

        /*$( "#draggable input" )[0].addEventListener("touchstart", function(event) {
                console.log('select')
                $( "#draggable input" )[0].select();
        },false);*/

        //$( "#chatmonitor" ).draggable();//{ cancel: "#chatmonitor" }

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
          // TODO: send request to the server
          /*this.props.onCommentSubmit({author: author, text: text});
          this.refs.author.value = '';
          this.refs.text.value = '';*/
          this.refs.chatmsg.value = '';
          return;
    },
    render: function() {
        var value = this.state.value;
          return (
            <div id="draggable" className="ui-widget-content ui-draggable">
                <div id="chatmonitor" className="non-draggable">
                <p><span>asfd</span></p>
                <p><span>asfd</span></p>
                <p><span>asfd</span></p>
                <p><span>asfd</span></p>
                <p><span>asfd</span></p>
                <p><span>asfd</span></p>
                </div>
                <form className="commentForm non-draggable" onSubmit={this.handleSubmit}>
                    <input className="inputchat" type="text" defaultValue="Hey!" ref="chatmsg"/>;
                    <input className="inputchatsubmit" type="submit" value="Post" />
                </form>
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
            {this.props.author}
          </h2>
          <span dangerouslySetInnerHTML={this.rawMarkup()} />
        </div>
      );
    }
  });

    ReactDOM.render(
          //<CommentBox data={data} />,
          //<CommentBox url="/api/comments" />,
          //<CommentBox url="/api/comments" pollInterval={2000} />,
          <ChatMonitor />,
          document.getElementById('content')
      );


