function average(list) {
	var average = 0;
	for (var i = 0; i < list.reviews.length; i++) {
		average += list.reviews[i].rating;
	}
	return average/list.reviews.length;
}

function test() {
	return "This is a test";
}

module.exports = {
	test: test,
	average: average
}
