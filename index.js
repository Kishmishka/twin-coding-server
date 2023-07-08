const express = require('express')
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
const app = express();
const route = require("./route");
const { User } = require('./User');
const { URLS } = require('./URLS');
const { Colors } = require('./Colors');
const { Users } = require('./users');


app.use(cors({origin: "*"}));
app.use(route)



let editorValue=''
const users=new Users()
const server = http.createServer(app);

const io = new Server(server,{
	cors:{
		origin:"*",
		methods:["GET","POST"]
	}
})

io.on(URLS.connection, (socket)=>{
	console.log("connection established")
	socket.on(URLS.join,()=>{
		const newUser = new User(socket.id)
		newUser.color=Colors[users.users.length],
		users.add(newUser)
		socket.join(newUser.room);
		socket.emit(URLS.auth, {
		id:newUser.id,
		name:newUser.name,
		room:newUser.room,
		editorValue:editorValue
		})
		console.log(`${newUser.id} connect`)
	})
	socket.on(URLS.clientValueСhanged,(params)=>{
		editorValue = params.data
		setTimeout(()=>{socket.broadcast.to(URLS.room).emit(URLS.serverValue,editorValue)},10)
	})
	socket.on(URLS.positionCursorChange,(params)=>{
		for(let user of users.users){
			if(user.id===params.id){
				user.cursorX=params.X;
				user.cursorY=params.Y;
			}
		}
		socket.broadcast.to(URLS.room).emit(URLS.serverCursors, users.users)	
	})
	socket.on(URLS.disconnect,()=>{
		users.set(users.users.filter(user=>user.id!=socket.id))
		socket.broadcast.to(URLS.room).emit(URLS.clientDisconnect, users.users)	
		console.log(`${newUser.id} disconnect`)
	})
})

server.listen(URLS.port, ()=>{
	console.log('server run')
	console.log(`port:${URLS.port}`)
})