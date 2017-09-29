const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

var app = express();

const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname,'../public');

var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
	console.log('new user connected');
	socket.emit('newMessage',{
			from:"admin",
			text:"welcome new user",
			createdAt:new Date().getTime()
		});
	socket.broadcast.emit('newMessage',{
			from:"admin",
			to:"new user arrived",
			createdAt:new Date().getTime()
		});
	socket.on('newMessage',(newMessage)=>{
		// io.emit('newMessage',{
		// 	from:newMessage.from,
		// 	to:newMessage.text,
		// 	createdAt:new Date().getTime()
		// });
		socket.broadcast.emit('newMessage',{
			from:newMessage.from,
			text:newMessage.text,
			createdAt:new Date().getTime()
		});
	});
	socket.on('disconnect',()=>{
		console.log('user disconnected');
	});
});

server.listen(port, ()=>{
	console.log('app is running on port ',port);	
});
