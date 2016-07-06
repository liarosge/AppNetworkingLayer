var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile('index.html');
});

io.on('connection', function(socket){
    console.log('Got a connection');
	socket.emit('connected', {connected:'Yay!'});
	
	socket.on('chat message', function(msg){
        console.log('message: ' + JSON.stringify(msg));
		socket.emit('response', 'Got your message');
    });
	
    socket.on('add user', function(msg){
        console.log('Got a user: ' + msg['username']);
        socket.emit('response', 'Logged u in');
    });
	
	socket.on('eyetracker', function(msg){
		
		switch(msg['status']) {
			case 'enable':
				console.log('Eyetracker status: ' + msg['status']);
				socket.emit('response', 'Mouse tracking enabled');
				break;
			
			case 'disable':
				console.log('Eyetracker status: ' + msg['status']);
				socket.emit('response', 'Mouse tracking disabled');
				break;
		}
	    
    });
	
	socket.on('eeg', function(msg){
		
		switch(msg['status']) {
			case 'enable':
				console.log('EEG status: ' + msg['status']);
				//we need to broadcast this !!
				socket.broadcast.emit("EEG","1");
				socket.emit('response', 'EEG enabled');
				break;
			
			case 'disable':
				console.log('EEG status: ' + msg['status']);
				socket.emit('response', 'EEG disabled');
				break;
		}
	    
    });
	
    socket.on('new message', function(msg){
        socket.emit('response', msg);
        socket.emit('new message', msg);
        socket.broadcast.emit('eyetrackerevents', msg);
		socket.broadcast.emit('command',msg);
        console.log('new message:' + msg);
    });
	
	socket.on('disconnect', function() {
      console.log('Got disconnect!');

      //var i = allClients.indexOf(socket);
      //allClients.splice(i, 1);
   });
});



http.listen(3000, function(){
    console.log('listening on *:3000');
});