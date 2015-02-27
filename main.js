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

var players = {};

io.on('connection', function(socket){
  players[socket.id] = {};

  socket.on('add player', function(player) {
    io.to(socket.id).emit("populate", players);
  	players[socket.id] = player;
    console.log(JSON.stringify(players));
    io.emit('new player', player);
  	console.log(player.name+" joined the room");
  })

  socket.on('disconnect', function(){
    console.log(players[socket.id].name+" left the room");
    io.emmit("remove user", socket.id);
    delete players[socket.id]
  });

  socket.on("move", function(user) {
    players[user.id].position = user.position;
    io.emit("move", user);
  })
});

var port = process.env.PORT || 3000

http.listen(port, function(){
  console.log('listening on *:'+port);
});