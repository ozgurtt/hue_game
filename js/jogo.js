Crafty.init(1920,1080, document.getElementById("field"));

Crafty.sprite(64, "images/player.png", {
	player_black: [0,0],
	player_blue: [0,1],
	player_green: [0,2],
	player_orange: [0,3],
	player_pink: [0,4],
	player_yellow: [0,5],
	player_red: [0,6],
	player_white: [0,7]
});

var players = [];
var me, socket, name, color;

socket = io();

$("#start").click(function (e) {
	e.preventDefault();
	name = $("#nickname").val();
	color = $('input[name=color]:checked', '#login').val();
	if(nickname != "" && color != null && socket.connected) {
		connect();
		$("#login").remove();
	}
});

function connect() {
	me = {"id": socket.id, "name": name, "color": color};
	addPlayer(me);
	socket.emit("add player", me);
	players[me.id].crafty.fourway(4)
	players[me.id].crafty.bind("Move", function(pos) {
		me.position = {x: pos._x, y: pos._y, h: pos._h, w: pos._w};
		socket.emit("move", {"id": me.id, "position": me.position});
  });
}

function addPlayer(player) {
	players[player.id] = new Player(player);
	players[player.id].draw();
}

socket.on("new player", function(user) {
	if(user.id !== me.id)
		addPlayer(user);
});

socket.on("populate", function (users) {
	for(var id in users) {
		addPlayer(users[id]);
	}
})

socket.on("move", function (user) {
	if(user.id !== me.id) {
		players[user.id].crafty.attr(user.position);
	}
})