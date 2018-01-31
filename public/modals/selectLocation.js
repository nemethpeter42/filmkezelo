angular.module('myApp').controller('ModalSelectLocationCtrl', function($uibModalInstance,$http,$scope,$filter) {
	var $ctrl = this
	$ctrl.locations = $filter('customOrderBy')(Object.keys($scope.locationIndex),undefined,false)
	$ctrl.close = () => {$uibModalInstance.close()}
	$scope.$on('modal.closing', function(event, reason, closed) {
		if (closed===false){
			event.preventDefault()
			$ctrl.close()
		}
	})
	$ctrl.select = (content) => {$uibModalInstance.close(content)}
})