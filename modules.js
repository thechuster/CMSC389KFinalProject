function average(list) {
	var average = 0;
	for (var i = 0; i < list.length; i++) {
		average += list[i];
	}
	return average/list.length;
}

function square(n) {
	return n*n;
}

module.exports = {
	factorial: factorial,
	square: square,
}
