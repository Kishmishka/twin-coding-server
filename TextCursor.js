class TextCursor {
	constructor(id){
		//this.name = Names[Math.floor(Math.random() * 16)]
		this.startRow = 0
		this.startCol = 0
		this.endRow = 0
		this.endCol = 0
		this.className = 'TextCursor_red'
		this.type='div'
		this.id = id
	}
}
exports.TextCursor = TextCursor