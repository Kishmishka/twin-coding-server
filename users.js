const { Names } = require("./Names");
const { URLS } = require("./URLS");

class User {
	constructor(){
		this.id = Date.now();
		this.name = Names[Math.floor(Math.random() * 16)]
		this.room = URLS.room
	}
}
exports.User = User