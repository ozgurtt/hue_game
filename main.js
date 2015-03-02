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

var flag = "";

io.on('connection', function(socket){
  players[socket.id] = {};

  io.to(socket.id).emit("populate", players);

  socket.on('add player', function(player) {
    
  	players[socket.id] = player;
    console.log(JSON.stringify(players));
    io.emit('new player', player);
  	console.log(player.name+" joined the room");
  })

  socket.on('disconnect', function(){
    console.log(players[socket.id].name+" left the room");
    io.emit("remove user", socket.id);
    delete players[socket.id];
  });

  socket.on("move", function(user) {
    players[user.id].position = user.position;
    io.emit("move", user);
  })

  socket.on("flag", function(id) {
    flag = id;
    console.log(players[id].name+" has the flag");
    io.emit("flag", id);
  });
});

var port = process.env.PORT || 3000

http.listen(port, function(){
  console.log('listening on *:'+port);
});