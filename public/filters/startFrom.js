angular.module('myApp').filter('startFrom', () => {
	return (input, start) => {
		start = +start //parse to int
		return input.slice(start)
	}
})