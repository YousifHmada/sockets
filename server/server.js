const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
var {isRealString} = require('./utils/validations');
var {generateMessage} = require('./utils/message');
var {generateLocationMessage} = require('./utils/message');
var {Users} = require('./utils/users');
var app = express();

const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname,'/../public');

var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));
var users = new Users();

io.on('connection',(socket)=>{
	console.log('new user connected');
	socket.on('join',(params,callback)=>{
		if(!isRealString(params.room) || !isRealString(params.name)){
			callback("you should enter a valid data");
		}else{
			socket.join(params.room);
			users.removeUser(socket.id);
			users.addUser(socket.id, params.name, params.room);
			io.to(params.room).emit('updateUserList', users.getUserList(params.room));
			socket.emit('newMessage',generateMessage("Admin", "welcome " + params.name));
			// socket.broadcast.emit('newMessage',generateMessage("admin","new user arrived"));
			socket.broadcast.to(params.room).emit('newMessage',generateMessage("Admin", params.name + " joined the room"));	
			callback();
		}
	});
	socket.on('newMessage',(newMessage, callback)=>{
		// io.emit('newMessage',generateMessage(newMessage.from,newMessage.text));
		if(newMessage.from == 'yousif'){
			callback('permission denied');
		}else{
			callback('send successfully');
			var user = users.getUser(socket.id);
			// socket.broadcast.emit('newMessage',generateMessage(newMessage.from,newMessage.text));
			io.to(user.room).emit('newMessage',generateMessage(user.name,newMessage.text));
		}
	});
	socket.on('newLocationMessage',(newMessage)=>{
		// socket.broadcast.emit('newLocationMessage',generateLocationMessage('admin',newMessage.latitude,newMessage.longitude));
		var user = users.getUser(socket.id);
		io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name, newMessage.latitude,newMessage.longitude));
	});
	socket.on('disconnect',()=>{
		var user = users.removeUser(socket.id);
		if(user){
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			socket.broadcast.to(user.room).emit('newMessage',generateMessage("Admin", user.name + " left the room"));		
		}
		console.log('user disconnected');
	});
});

server.listen(port, ()=>{
	console.log('app is running on port ',port);	
});
