angular.module('myApp').controller('ModalManageTagsCtrl',function($uibModalInstance,$http,$scope,$filter,activeTags,entry_id){
	var $ctrl = this
	$ctrl.tags=[]
	$ctrl.refreshTags = () => {
		$ctrl.tags = $filter('customOrderBy')(Object.keys($scope.tagIndex),undefined,false)
	}
	$ctrl.refreshTags()
	$ctrl.cnt=0
	$ctrl.activeTags=activeTags
	$ctrl.alerts=[]
	$ctrl.addAlert = (msg) => {$ctrl.alerts.push({msg: msg})}
	$ctrl.closeAlert = (index) => {$ctrl.alerts.splice(index, 1)}
	$ctrl.inputField=''
	$ctrl.close = () => {$uibModalInstance.close($ctrl.cnt)}
	$scope.$on('modal.closing', function(event, reason, closed) {
		if (closed===false){
			event.preventDefault()
			$ctrl.close()
		}
	});
	var removeTag = (content) => {
		$scope.openModalRemoveWarning(function successCallback(){
			$http({
				method: 'POST',
				url: 'http://127.0.0.1:3000/remove/tag/',
				data: {	
					entry_ids: [entry_id],
					content: content
				},
			}).then(function successCallback(response) {
				if(response.data.success===true){
					/*
						assignment didn't work for removing
					*/
					$ctrl.activeTags.delete(content)
					$scope.tagIndex[content].delete(entry_id)
					if ($scope.tagIndex[content].size===0){
						delete $scope.tagIndex[content]
					}
					$ctrl.refreshTags()
					$ctrl.cnt--
				}else{
					console.log('Adatbázis hiba törlésnél')
				}
			})
		}, function rejection(error) {
			//console.log('Modal dismissed at: ' + new Date())
		})
	}
	var addTag = (content) => {
		$http({
			method: 'POST',
			url: 'http://127.0.0.1:3000/new/tag',
			data:{
				entry_ids:[entry_id],
				content:content,
			},
		}).then(function successCallback(response) {
			if(response.data.success===true){
				$ctrl.activeTags.add(content)
				if (! $scope.tagIndex[content]){
					$scope.tagIndex[content]=new Set()
				}
				$scope.tagIndex[content].add(entry_id)
				$ctrl.refreshTags()
				$ctrl.cnt++
			}else{
				$ctrl.addAlert('Adatbázis hiba létrehozásnál: '+JSON.stringify(response.data.errorMsg))
			}
		})
	}
	
	$ctrl.createOrRemove = (content) => {activeTags.has(content) ? removeTag(content) : addTag(content)}
	
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
		if ($ctrl.activeTags.has(content)){
			return (topTag ? 'top-tag':'')+' btn-info'
		}else{
			return (topTag ? 'top-tag':'')+' btn-default'
		}
	}
})