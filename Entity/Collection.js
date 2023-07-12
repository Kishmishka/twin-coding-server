class Collection{
	values =[];
	add(value){
		this.values.push(value)
	}
	set(newValues){
		this.values = newValues
	}
}
exports.Collection = Collection