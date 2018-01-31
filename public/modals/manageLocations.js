angular.module('myApp').controller('ModalManageLocationsCtrl', function($uibModalInstance,$http,$scope,$filter,activeLocations,entry_id) {
	var $ctrl = this
	$ctrl.locations=[]
	$ctrl.refreshLocations = () => {
		$ctrl.locations = $filter('customOrderBy')(Object.keys($scope.locationIndex),undefined,false)
	}
	$ctrl.refreshLocations()
	$ctrl.activeLocations=activeLocations
	$ctrl.alerts=[]
	$ctrl.addAlert = (msg) => {$ctrl.alerts.push({msg: msg})}
	$ctrl.closeAlert = (index) => {$ctrl.alerts.splice(index, 1)}
	$ctrl.inputField=''
	$ctrl.close = () => {$uibModalInstance.close()}
	$scope.$on('modal.closing', function(event, reason, closed) {
		if (closed===false){
			event.preventDefault()
			$ctrl.close()
		}
	})
	var removeLocation = (content) => {
		$scope.openModalRemoveWarning(function successCallback(){
			$http({
				method: 'POST',
				url: 'http://127.0.0.1:3000/remove/location',
				data:{
					entry_ids:[entry_id],
					content:content,
				},
			}).then(function successCallback(response) {
				if(response.data.success===true){
					/*
						assignment didn't work for removing
					*/
					$ctrl.activeLocations.delete(content)
					$scope.locationIndex[content].delete(entry_id)
					if ($scope.locationIndex[content].size===0){
						delete $scope.locationIndex[content]
					}
					$ctrl.refreshLocations()
				}else{
					console.log('Adatbázis hiba törlésnél')
				}
			})
		}, function rejection(error) {
			//console.log('Modal dismissed at: ' + new Date())
		})
	}
	var addLocation = (content) => {
		$http({
			method: 'POST',
			url: 'http://127.0.0.1:3000/new/location',
			data:{
				entry_ids:[entry_id],
				content:content,
			},
		}).then(function successCallback(response) {
			if(response.data.success===true){
				$ctrl.activeLocations.add(content)
				if (! $scope.locationIndex[content]) {
					$scope.locationIndex[content]=new Set()
				}
				$scope.locationIndex[content].add(entry_id)
				$ctrl.refreshLocations()
			}else{
				$ctrl.addAlert('Adatbázis hiba létrehozásnál: '+JSON.stringify(response.data.errorMsg))
			}
		})
	}
	$ctrl.classLocation = (content) => {
		if ($ctrl.activeLocations.has(content)){
			return 'btn-info'
		} else {
			return 'btn-default'
		}
	}
	$ctrl.createOrRemove = (content) => {activeLocations.has(content) ? removeLocation(content) : addLocation(content)}
})