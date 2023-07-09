const express = require('express')
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
const app = express();
const route = require("./route");
const { User } = require('./User');
const { URLS } = require('./URLS');
const { Colors, ColorsTextCursors } = require('./Colors');
const { Users } = require('./users');
const { TextCursor } = require('./TextCursor');
const { TextCursors } = require('./TextCursors');


app.use(cors({origin: "*"}));
app.use(route)



let editorValue=''
const textCursors = new TextCursors()
const users = new Users()
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
		
		const newTextCursor = new TextCursor(socket.id)
		newTextCursor.className = ColorsTextCursors[textCursors.TextCursors.length]
		textCursors.add(newTextCursor)

		const newUser = new User(socket.id)
		newUser.color = Colors[users.users.length]
		users.add(newUser)

		socket.join(newUser.room);
		socket.emit(URLS.auth, {
		id:newUser.id,
		name:newUser.name,
		room:newUser.room,
		editorValue:editorValue
		})
		console.log(`${newUser.id}connect`)
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
	socket.on(URLS.positionTextCursorChange,(params)=>{
		for(let textCursor of textCursors.TextCursors){
			if(textCursor.id===params.id){
				textCursor.startRow = params.row
				textCursor.startCol = params.column
				textCursor.endCol = params.column+1
				textCursor.endRow = params.row
				
			}
		}
		socket.broadcast.to(URLS.room).emit(URLS.serverTextCursors, textCursors.TextCursors)	
	})
	socket.on(URLS.disconnect,()=>{
		users.set(users.users.filter(user=>user.id!==socket.id))
		textCursors.set(textCursors.TextCursors.filter(textCursor=>textCursor.id!==socket.id))
		params={
			userss:users.users,
			textCursorss:textCursors.TextCursors
		}
		socket.broadcast.to(URLS.room).emit(URLS.clientDisconnect, params)	
		console.log(`disconnect`)
	})
})

server.listen(URLS.port, ()=>{
	console.log('server run')
	console.log(`port:${URLS.port}`)
})