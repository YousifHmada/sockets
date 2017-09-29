const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

var app = express();

const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname,'../public');
const publicStaticPath = path.join(__dirname,'../static');

var server = http.createServer(app);
var io = socketIO(server);

app.use('/',express.static(publicPath));
app.use('/static', express.static(publicStaticPath));

io.on('connection',(socket)=>{
	console.log('new user connected');
	socket.on('newMessage',(newMessage)=>{
		io.emit('newMessage',{
			from:newMessage.from,
			to:newMessage.to,
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
