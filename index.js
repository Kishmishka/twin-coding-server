const express = require('express')
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
const app = express();
const { User } = require('./Entity/User');
const { URLS } = require('./Constants/URLS');
const { Colors, ColorsTextCursors } = require('./Constants/Colors');
const { Collection } = require('./Entity/Collection');
const { TextCursor } = require('./Entity/TextCursor');
const { State } = require('./Entity/State');

app.use(cors({origin: "*"}));

const editorValue = new State() 
const languageValue = new State('java') 
const textCursors = new Collection()
const users = new Collection()
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
		newTextCursor.className = ColorsTextCursors[textCursors.values.length]
		textCursors.add(newTextCursor)

		const newUser = new User(socket.id)
		newUser.color = Colors[users.values.length]
		users.add(newUser)

		socket.join(newUser.room);
		socket.emit(URLS.auth, {
		id:newUser.id,
		name:newUser.name,
		room:newUser.room,
		color:newUser.color,
		editorValue:editorValue.get(),
		language:languageValue.get(),
		})
		console.log(`${newUser.id} connect`)
		console.log(`${newUser.name} connect`)
	})

	socket.on(URLS.clientValueСhanged,(params)=>{
		editorValue.set(params.data)
		setTimeout(()=>{socket.broadcast.to(URLS.room).emit(URLS.serverValue,editorValue.get())},10)
	})

	socket.on(URLS.languageChange,(language)=>{
		languageValue.set(language)
		socket.broadcast.to(URLS.room).emit(URLS.serverLanguage,languageValue.get())
	})

	socket.on(URLS.positionCursorChange,(params)=>{
		for(let user of users.values){
			if(user.id===params.id){
				user.cursorX=params.X;
				user.cursorY=params.Y;
			}
		}
		socket.broadcast.to(URLS.room).emit(URLS.serverCursors, users.values)	
	})

	socket.on(URLS.positionTextCursorChange,(params)=>{
		for(let textCursor of textCursors.values){
			if(textCursor.id===params.id){
				textCursor.startRow = params.row
				textCursor.startCol = params.column
				textCursor.endCol = params.column+1
				textCursor.endRow = params.row
				
			}
		}
		socket.broadcast.to(URLS.room).emit(URLS.serverTextCursors, textCursors.values)	
	})
	
	socket.on(URLS.disconnect,()=>{
		users.set(users.values.filter(user=>user.id!==socket.id))
		textCursors.set(textCursors.values.filter(textCursor=>textCursor.id!==socket.id))
		params={
			users:users.values,
			textCursors:textCursors.values
		}
		socket.broadcast.to(URLS.room).emit(URLS.clientDisconnect, params)	
		console.log(`disconnect`)
	})
})

server.listen(URLS.port, ()=>{
	console.log('server run')
	console.log(`port:${URLS.port}`)
})