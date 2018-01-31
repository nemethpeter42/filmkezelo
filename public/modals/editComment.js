angular.module('myApp').controller('ModalEditCommentCtrl',function($uibModalInstance,$http,comment,entry_id){
	var $ctrl = this
	$ctrl.content=comment.content
	$ctrl.type=comment.type
	$ctrl.alerts=[]
	$ctrl.addAlert = (msg) => {$ctrl.alerts.push({msg: msg})}
	$ctrl.closeAlert = (index) => {$ctrl.alerts.splice(index, 1)}
	$ctrl.save = () => {
		var commentForPosting = JSON.parse(JSON.stringify(comment))
		commentForPosting.content = $ctrl.content
		commentForPosting.type = $ctrl.type
		$http({
			method: 'POST',
			url: 'http://127.0.0.1:3000/edit/comment',
			data:{
				comment:commentForPosting,
				entry_id:entry_id,
			},
		}).then(function successCallback(response) {
			if(response.data.success===true){
				$uibModalInstance.close(commentForPosting)
			}else{
				$ctrl.addAlert('Adatbázis hiba szerkesztésnél: '+JSON.stringify(response.data.errorMsg))
			}
		})
	}
	$ctrl.close = () => {$uibModalInstance.close()}
})