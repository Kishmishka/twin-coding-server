class TextCursor {
	constructor(id){
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