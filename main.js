var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use("/style", express.static(__dirname + '/style'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/images", express.static(__dirname + '/images'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var players = {size: 0};

var flag = "";

io.on('connection', function(socket){
  players[socket.id] = {};

  io.to(socket.id).emit("populate", players);

  socket.on('add player', function(player, fn) {
    var pos = getPosition(players.size);
    player['position'] = {x: pos.x, y: pos.y, w: 100, h: 100};
    player['points'] = 0;
  	players[socket.id] = player;
    players.size++;
    fn(player);
    io.emit('new player', player);
  	console.log(player.name+" joined the room");
  })

  socket.on('disconnect', function(){
    console.log(players[socket.id].name+" left the room");
    io.emit("remove user", socket.id);
    delete players[socket.id];
    players.size--;
  });

  socket.on("move", function(user) {
    players[user.id].position = user.position;
    io.emit("move", user);
  })

  socket.on("flag", function(id) {
    flag = id;
    console.log(players[id].name+" has the banana");
    io.emit("flag", id);
  });

  socket.on("goal", function(id) {
    if(flag === id) {
      var rad = Math.sqrt(Math.pow(players[id].position.x-1000, 2) + Math.pow(players[id].position.y-1000, 2));
      console.log(rad);
      if(rad > 1000) {
        players[id].points += 10;
        console.log(players[id].name+" owned 10 points");
        flag = "";
        io.emit("flag", "");
      }
    }
  })
});

function getPosition(i) {
  var total_players = 8;
  var x = sanitize(Math.floor(Math.cos(i/total_players * 2*Math.PI)*1000+1000));
  var y = sanitize(Math.floor(Math.sin(i/total_players * 2*Math.PI)*1000+1000));
  console.log("x:"+x+", y:"+y)
  return {x: x, y: y};
}

function sanitize(n) {
  return n-50;
}

var port = process.env.PORT || 3000

http.listen(port, function(){
  console.log('listening on *:'+port);
});