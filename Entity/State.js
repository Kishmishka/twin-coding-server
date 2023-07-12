class State{
	value=''
	constructor(startValue){
		this.value = startValue
	}
	
	set(newValue){
		this.value=newValue
	}
	get(){
		return this.value
	}
}
exports.State = State