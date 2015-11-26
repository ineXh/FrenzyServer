var HTMLgamelist = '<li><h2>%gamename%<span>%players%/4Players</span></h2></li>';

var placegame = function(name, players){
    formattedgamelist = HTMLgamelist.replace("%gamename%", name);
    formattedgamelist = formattedgamelist.replace("%players%", players);
    $("#gamelist").append(formattedgamelist);
}

function placechat(author, message, color, dt) {
    var chatmonitor = $('#chatmonitor');
    chatmonitor.prepend('<p><span "style="color:' + color + '"></span><span style="color:' + color + '">' + author + '</span> @ ' + convertTime(dt)
         + ': ' + message + '</p>');
}
