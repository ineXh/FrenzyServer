var HTMLgamelist = '<li class="ui-widget-content"><h2>%gamename%<span>%players%/4Players</span></h2></li>';

var placegame = function(name, players){
    formattedgamelist = HTMLgamelist.replace("%gamename%", name);
    formattedgamelist = formattedgamelist.replace("%players%", players);
    $(".selectable").append(formattedgamelist);
}

function placechat(msg) { // author, message, color, dt
    var chatmonitor = $('#chatmonitor');
    //chatmonitor.prepend('<p><span "style="color:' + msg.color + '"></span><span style="color:' + msg.color + '">' + msg.author + '</span> @ ' + convertTime(new Date(msg.time))
//         + ': ' + msg.msg + '</p>');
	//if(msg.color == undefined) debugger;
    chatmonitor.prepend('<p><span style="color:#' + (msg.color).toString(16) + '">' + msg.author + '</span> @ ' + convertTime(new Date(msg.time))
         + ': ' + msg.msg + '</p>');
}
