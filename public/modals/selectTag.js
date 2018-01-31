angular.module('myApp').controller('ModalSelectTagCtrl', function($uibModalInstance,$http,$scope,$filter) {
	var $ctrl = this
	$ctrl.tags = $filter('customOrderBy')(Object.keys($scope.tagIndex),undefined,false)
	$ctrl.close = () => {$uibModalInstance.close()}
	$scope.$on('modal.closing', function(event, reason, closed) {
		if (closed===false){
			event.preventDefault()
			$ctrl.close()
		}
	})
	$ctrl.select = (content) => {$uibModalInstance.close(content)}
	$ctrl.classTag = (content) => {
		/*
			warning: not accurate top list, 
			there may be more values than the rate, 
			if there are more tags with the same count value 
			(as it uses numerical limit instead of sorting)
		*/
		var rate = 0.2
		var values = Object.entries($scope.tagIndex).map((e)=> e[1].size).sort((a,b) => a-b).reverse()
		var topTag = $scope.tagIndex[content].size>=values[Math.floor(rate*(values.length-1))]
		return (topTag ? 'top-tag':'')
	}
})