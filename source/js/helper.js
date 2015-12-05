var HTMLgamelist = '<li><h2>%gamename%<span>%players%/4Players</span></h2></li>';
//class="ui-widget-content"
var placegame = function(game){
    formattedgamelist = HTMLgamelist.replace("%gamename%", game.name);
    formattedgamelist = formattedgamelist.replace("%players%", game.players);
    $(".selectable").append(formattedgamelist);
}

function placechat(msg) { // author, message, color, dt
    var chatmonitor = $('#chatmonitor');
    //console.log(msg)
    //console.log((msg.color).toString(16))
    chatmonitor.prepend('<p><span style="color:#' + (msg.color).toString(16) + '">' + msg.author + '</span> @ ' + convertTime(new Date(msg.time)) + ': ' + '<span style="color:#' + (msg.color).toString(16) + '">' + msg.msg + '</span></p>');
}

function placeplayer(player){
    var list = $('#gameroomplayerlist');

    list.append('<p>' + player.name + '</p>')
}
