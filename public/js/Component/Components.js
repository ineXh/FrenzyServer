

/*var data = [
        {author: "Pete Hunt", text: "This is one msg"},
        {author: "Jordan Walke", text: "This is *another* msg"}
    ];*/

var ChatMonitor = React.createClass({
    getInitialState: function() {
        return {value: 'Hello!', count:0};
    },
    tick: function() {
      this.setState({count: this.state.count + 1});
    },
    mountDrag:function(){

    },
    componentDidMount: function(){
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
            console.log('inputchat')
            console.log(e)
             $( "#chatwindow.ui-draggable" ).draggable( "disable" );
             //removeListeners();
            /*var mdown = new MouseEvent("click", {
                 //screenX: e.screenX,
                //screenY: e.screenY,
                //clientX: e.clientX,
                //clientY: e.clientY,
                bubbles: true,
                view: window
            });

            e.target.dispatchEvent(mdown);*/
            var cb = document.getElementById("chatinput"); //element to click on
          cb.focus();
            //simulateMouseEvent(e, 'click');
        //    $(".inputchat")[0].dispatchEvent(mdown);

            //$(this)[0].selectionStart = $(this)[0].selectionEnd = $(this).val().length;

            //$( "#draggable" ).draggable( "disable" );

        },false);
        $(".inputchat")[0].addEventListener("touchend", function(e) {
          console.log('reenable')
          $( "#chatwindow.ui-draggable" ).draggable( "enable" );
          //addListeners();
          //$( "#draggable" ).draggable({ cancel: ".non-draggable" });
          //$( "#draggable" ).resizable();
        },false);

        //$(".chatsendbutton")[0].addEventListener("mousedown", function(e) {

            //console.log('pressed')
            //console.log(this)
            //chatmonitor.handleSubmit();
        //},false);

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
          //<CommentBox data={data} />,
          //<CommentBox url="/api/comments" />,
          //<CommentBox url="/api/comments" pollInterval={2000} />,
          <ChatMonitor />,
          document.getElementById('content')
      );
*/