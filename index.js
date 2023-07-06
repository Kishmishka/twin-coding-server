const express = require('express')
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
const app = express();
const route = require("./route");
const { User } = require('./Users');
const { URLS } = require('./URLS');
const { Colors } = require('./Colors');


app.use(cors({origin: "*"}));
app.use(route)



editorValue=''
let users = []
let cursors = []

const server = http.createServer(app);

const io = new Server(server,{
	cors:{
		origin:"*",
		methods:["GET","POST"]
	}
})

io.on(URLS.connection, (socket)=>{
	console.log("connect")
	socket.on(URLS.join,()=>{
		const newUser = new User
		users.push(newUser)
		cursors.push({
			id:newUser.id, 
			name:newUser.name,
			color:Colors[String(users.length)],
			X:0,
			Y:0
		})
		socket.join(newUser.room);
		socket.emit(URLS.auth, {
				id:newUser.id,
				name:newUser.name,
				room:newUser.room
		})
		console.log(`${newUser.name} connect`)
	})
	socket.on(URLS.clientValueСhanged,(params)=>{
		editorValue = params.data
		setTimeout(()=>{socket.broadcast.to(URLS.room).emit(URLS.serverValue,editorValue)},10)
		
	})
	socket.on(URLS.positionCursorChange,(params)=>{
		for(let cursor of cursors){
			if(cursor.id===params.id){
				cursor.X=params.X;
				cursor.Y=params.Y;
			}
		}
		// console.log(URLS.room)
		socket.broadcast.to(URLS.room).emit(URLS.serverCursors,cursors)
		
	})
	socket.on(URLS.disconnect,()=>{
		console.log(`disconnect`)
	})
})

server.listen(URLS.port, ()=>{
	console.log('server run')
	console.log(`port:${URLS.port}`)
})