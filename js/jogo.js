Crafty.init(Crafty.DOM.window.width, Crafty.DOM.window.height, "field");
var worldBkg = Crafty.e("2D, DOM, Image")
worldBkg.attr({  w:2000, h:2000, x: 0, y: 0  });
worldBkg.image("/images/tile.jpg", "repeat");

Crafty.e("2D, DOM, arena, Collision")
.attr({x: 0, y: 0, w: 2000, h: 2000})
.collision(new Crafty.circle(1000, 1000, 1000));


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

Crafty.sprite(100, 80, "images/player_banana.png", {
	player_banana_black: [0,0],
	player_banana_blue: [0,1],
	player_banana_green: [0,2],
	player_banana_orange: [0,3],
	player_banana_pink: [0,4],
	player_banana_yellow: [0,5],
	player_banana_red: [0,6]
});

var players = {};
var flag = "";
var me, socket, name, color, banana;

createBanana();

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
	socket.emit("add player", me, function(player) {
		me = player;
		addPlayer(me);

		var playerRef = players[me.id].crafty;
		players[me.id].crafty.fourway(4)
		.addComponent("player")
		.bind("Move", function(pos) {
			me.position = {x: pos._x, y: pos._y, h: pos._h, w: pos._w};
			socket.emit("move", {"id": me.id, "position": me.position});
	  })
	  .onHit("banana", function(obj) {
	  	banana.destroy();
	  	socket.emit("flag", me.id);
	  })
	  .onHit("arena", function() {}, function() {
	  	if(flag === me.id)
	  		socket.emit("goal", me.id);
	  });

	  Crafty.viewport.clampToEntities = false;
	  Crafty.viewport.follow(playerRef, 0, 0);

	  $("body").keypress(function(e) {
			if(event.keyCode === 32) {
				var hit = players[me.id].crafty.hit("player_banana");
				if(hit) {
					socket.emit("flag", me.id);
				}
			}
		});
	});
}

function createBanana() {
	banana = Crafty.e("2D, DOM, Image, banana")
	.attr({w: 128, h: 128, x: 936, y: 936})
	.image("/images/banana.png");
}

function addPlayer(player) {
	players[player.id] = new Player(player);
	players[player.id].draw();
	if(player.id !== socket.id) {
		players[player.id].crafty.addComponent("npc");
	}
}

socket.on("new player", function(user) {
	if(user.id !== socket.id)
		addPlayer(user);
});

socket.on("populate", function (users) {
	for(var id in users) {
		if(id !== socket.id && id !== "size")
			addPlayer(users[id]);
	}
});

socket.on("flag", function(id) {
	if(flag !== "")
		players[flag].setBanana(false);
  flag = id;
  if(id === "") {
  	createBanana();
  } else {
  	if(id === socket.id) {
  		console.log("You have the banana!!!");
	  } else {
	  	console.log(players[id].config.name+" has the banana");
	  }
	  players[id].setBanana();
	}
});

socket.on("move", function (user) {
	if(user.id !== socket.id) {
		players[user.id].crafty.attr(user.position);
	}
});

socket.on("remove user", function(id) {
	players[id].crafty.destroy();
	delete players[id];
});