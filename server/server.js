const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
var {generateMessage} = require('./utils/message');
var {generateLocationMessage} = require('./utils/message');
var app = express();

const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname,'/../public');

var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
	console.log('new user connected');
	socket.emit('newMessage',generateMessage("admin","welcome new user"));
	// socket.broadcast.emit('newMessage',generateMessage("admin","new user arrived"));
	socket.broadcast.emit('newMessage',generateMessage("admin","new user arrived"));
	socket.on('newMessage',(newMessage, callback)=>{
		// io.emit('newMessage',generateMessage(newMessage.from,newMessage.text));
		if(newMessage.from == 'yousif'){
			callback('permission denied');
		}else{
			callback('send successfully');
			// socket.broadcast.emit('newMessage',generateMessage(newMessage.from,newMessage.text));
			io.emit('newMessage',generateMessage(newMessage.from,newMessage.text));
		}
	});
	socket.on('newLocationMessage',(newMessage)=>{
		// socket.broadcast.emit('newLocationMessage',generateLocationMessage('admin',newMessage.latitude,newMessage.longitude));
		io.emit('newLocationMessage',generateLocationMessage('User',newMessage.latitude,newMessage.longitude));
	});
	socket.on('disconnect',()=>{
		console.log('user disconnected');
	});
});

server.listen(port, ()=>{
	console.log('app is running on port ',port);	
});
