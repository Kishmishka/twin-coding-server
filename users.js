class User {
	names = [
		'Бодрая лань',
		'Веселый крокодил',
		'Безудержная панда',
		'Бодрая лань',
		 'Веселый крокодил',
		'Безудержная панда',
		 'Неуловимая чарепаха',
		 'Скрытный слон',
		'Заинтересованный ёж',
		'Сухопутная рыба',
		 'Приземленная чайка',
		 'Элегантный утконос',
		'Реактивный лангустин',
		'Рентабельная белка',
		 'Маржинальная коала',
		'Виртуозная капибара'
	]
	room = 5
	constructor(){
		
		this.id = Date.now();
		this.name = this.names[Math.floor(Math.random() * 12)]
	}
}
exports.User = User