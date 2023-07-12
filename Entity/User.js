const { Names } = require("../Constants/Names");
const { URLS } = require("../Constants/URLS");

class User {
	constructor(socket){
		this.id = socket
		this.name = Names[Math.floor(Math.random() * 16)]
		this.room = URLS.room
		this.cursorX = 0
		this.cursorY = 0
		this.textCursorColumn = 0
		this.textCursorRow = 0
	}
}
exports.User = User