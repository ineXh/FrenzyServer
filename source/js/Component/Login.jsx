window.loginWindow = React.createClass({
  handleSubmit: function(e) {
        //console.log('handleSubmit')
          e.preventDefault();
          var nameinput = this.refs.nameinput.value.trim();
          if (!nameinput) return;
          sendName(nameinput);
          //this.refs.nameinput.value = '';
          return;
  },
  componentDidMount: function(){
    var cb = document.getElementById("nameinput");
    cb.focus();
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
