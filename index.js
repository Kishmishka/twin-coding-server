const express = require('express')
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
const app = express();
const route = require("./route");
const { User } = require('./users');


app.use(cors({origin: "*"}));
app.use(route)



editorValue=''
let users = []

const server = http.createServer(app);

const io = new Server(server,{
	cors:{
		origin:"*",
		methods:["GET","POST"]
	}
})

io.on('connection', (socket)=>{
	console.log("ds")
	socket.on('join',()=>{
		const newUser = new User
		users.push(newUser)
		newUser.room = (users.length - users.length % 2) / 2 + users.length%2;
		socket.join(newUser.room);
		socket.emit('log', {
				id:newUser.id,
				name:newUser.name,
				room:newUser.room
		})
	})
	socket.on('redactorValue',(params)=>{
		editorValue = params.data
		socket.broadcast.to(1).emit('editRedactor',editorValue)
		console.log(editorValue)
	})
	socket.on('disconnect',()=>{
		console.log("dis")
	})
})

server.listen(3030, ()=>{
	console.log('server run')
})