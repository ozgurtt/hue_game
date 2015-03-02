window.Player = function(playerObject) {

	this.config = playerObject;
	this.hasFlag = false;

	this.draw = function() {
		var field = $("#field")
		// field.append("<canvas id='"+player.id+"' class='player' height='64' width='64'></canvas>");

	 //  var canvas = document.getElementById(player.id);
	 //  var context = canvas.getContext('2d');
	 //  var centerX = canvas.width / 2;
	 //  var centerY = canvas.height / 2;
	 //  var radius = 30;
	 //  var eyeRadius = 5;
	 //  var eyeXOffset = 12;
	 //  var eyeYOffset = 25;
	  
	 //  // draw the yellow circle
	 //  context.beginPath();
	 //  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	 //  context.fillStyle = player.color;
	 //  context.fill();
	 //  context.lineWidth = 2;
	 //  context.strokeStyle = 'black';
	 //  if(player.color == "#000") {
	 //  	context.strokeStyle = 'white';
	 //  }
	 //  context.stroke();
	    
	 //  // draw the eyes
	 //  context.beginPath();
	 //  var eyeX = centerX - eyeXOffset;
	 //  var eyeY = centerY - eyeXOffset;
	 //  context.arc(eyeX, eyeY, eyeRadius, 0, 2 * Math.PI, false);
	 //  var eyeX = centerX + eyeXOffset;
	 //  context.arc(eyeX, eyeY, eyeRadius, 0, 2 * Math.PI, false);
	 //  context.fillStyle = 'black';
	 //  context.fill();
	  
	 //  // draw the mouth
	 //  context.beginPath();
	 //  context.arc(centerX, centerY, 20, 0, Math.PI, false);
	 //  context.stroke();

	 if(typeof(this.config.position) === "undefined") {
	 	var pos = getPosition(random(0,7));
	 	this.config['position'] = {x: pos.x, y: pos.y, w: 100, h: 100};
	 	console.debug(this.config['position']);
	 }

    this["crafty"] = Crafty.e('2D, DOM, player_'+this.config.color+', Fourway, Collision, Model')
	  .attr(this.config.position)
	  .collision()
	  .attr({playerId: this.config.id});

	  //this.config["position"] = this.crafty.attr();
	}

}

function random(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function getPosition(i) {
	var total_players = 8;
	var x = sanitize(Math.floor(Math.cos(i/total_players * 2*Math.PI)*1000+1000));
	var y = sanitize(Math.floor(Math.sin(i/total_players * 2*Math.PI)*1000+1000));
	return {x: x, y: y};
}

function sanitize(n) {
	if(n > 100) {
		return n-100;
	} else {
		return n;
	}
}