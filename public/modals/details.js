angular.module('myApp').controller('ModalDetailsCtrl', function($uibModalInstance,$uibModal,$scope,$http,$filter,entry,details) {
	var $ctrl = this
	$ctrl.details = details
	$ctrl.sortedComments = $filter('customOrderBy')(details.comments,'created_at',false)
	$ctrl.refreshDetails = () => {
		$ctrl.sortedTags = $filter('customOrderBy')([...details.tags],undefined,false)
		$ctrl.sortedLocations = $filter('customOrderBy')([...details.locations],undefined,false)
	}
	$ctrl.refreshDetails()
	$ctrl.entry = entry
	$ctrl.close = () => {$uibModalInstance.close('')}
	$ctrl.manageTags = () => {
		var modalCfg = Object.assign($scope.modalDefaultCfg,{
			size: 'lg',
			appendTo: $scope.anchor.manageTags,
			templateUrl: 'modals/manageTags.html',
			controller: 'ModalManageTagsCtrl',
			resolve: {
				activeTags: () => details.tags,
				entry_id: () => entry.entry_id,
				cnt: () => entry.tag_cnt,
			},
		})
		var modalInstance = $uibModal.open(modalCfg)
		modalInstance.result.then( (num) => {
			if (num){
				$ctrl.entry.tag_cnt+=num
				$ctrl.refreshDetails()
			}
		}, function rejection(error) {
			//$log.info('Modal dismissed at: ' + new Date())
		})
	}
	$ctrl.manageLocations = () => {
		var modalCfg = Object.assign($scope.modalDefaultCfg,{
			size: 'lg',
			appendTo: $scope.anchor.manageLocations,
			templateUrl: 'modals/manageLocations.html',
			controller: 'ModalManageLocationsCtrl',
			resolve: {
				activeLocations:() => details.locations,
				entry_id: () => entry.entry_id,
			},
		})
		var modalInstance = $uibModal.open(modalCfg)
		modalInstance.result.then( (answer) => {
			$ctrl.refreshDetails()
		}, function rejection(error) {
			//$log.info('Modal dismissed at: ' + new Date())
		})
	}
	$ctrl.removeComment = (created_at) => {
		$scope.openModalRemoveWarning(function successCallback(){
			$http({
				method: 'POST',
				url: 'http://127.0.0.1:3000/remove/comment/',
				data:{
					entry_id: entry.entry_id,
					created_at: created_at,
				},
			}).then(function successCallback(response) {
				if(response.data.success===true){
					var pos = $ctrl.details.comments.map(e => e.created_at).indexOf(created_at)
					$ctrl.details.comments.splice(pos,1)
					$ctrl.entry.cmnt_cnt--
				}else{
					console.log('Adatbázis hiba törlésnél')
				}
			})
		}, function rejection(error) {
			//$log.info('Modal dismissed at: ' + new Date())
		})
	}
	
	$ctrl.newComment = () => {
		var modalCfg = Object.assign($scope.modalDefaultCfg,{
			appendTo: $scope.anchor.editComment,
			templateUrl: 'modals/editComment.html',
			controller: 'ModalNewCommentCtrl',
			resolve: {
				entry_id: () => entry.entry_id,
			},
		})
		var modalInstance = $uibModal.open(modalCfg)
		modalInstance.result.then((answer) => {
			if (answer){
				$ctrl.details.comments.push(answer)
				$ctrl.entry.comment_cnt++
			}
		}, function rejection(error) {
			//$log.info('Modal dismissed at: ' + new Date())
		})
	}
	$ctrl.editComment = (comment) => {
		var modalCfg = Object.assign($scope.modalDefaultCfg,{
			appendTo: $scope.anchor.editComment,
			templateUrl: 'modals/editComment.html',
			controller: 'ModalEditCommentCtrl',
			resolve: {
				entry_id: () => entry.entry_id,
				comment: () => comment,
			},
		})
		var modalInstance = $uibModal.open(modalCfg)
		modalInstance.result.then((answer) => {
			if (answer){
				var pos = $ctrl.details.comments.map(e => e.created_at).indexOf(answer.created_at)
				$ctrl.details.comments.splice(pos,1,answer)
				$ctrl.entry.comment_cnt++
			}
		}, function rejection(error) {
			//$log.info('Modal dismissed at: ' + new Date())
		})
	}
})