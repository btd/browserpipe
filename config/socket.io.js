var io = require('socket.io');

module.exports = function (server) {

	io.listen(server);
	io.sockets.on('connection', function (socket) {
		console.log("connnect");
		socket.on('disconnect', function (socket) {
			console.log("disconnect");
		});
		socket.emit("pong",{txt:"Connected to server"});
		socket.on('ping', function (data) {
			console.log(data.txt);
			socket.emit("pong",{txt:"Pong (from server)"});
		});
	});
	
}
