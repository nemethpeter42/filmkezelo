angular.module('myApp').controller('ModalNewCommentCtrl', function($uibModalInstance,$http,entry_id){
	var $ctrl = this
	$ctrl.content=''
	$ctrl.type='info'
	$ctrl.alerts=[]
	$ctrl.addAlert = (msg) => {$ctrl.alerts.push({msg: msg})}
	$ctrl.closeAlert = (index) => {$ctrl.alerts.splice(index, 1)}
	$ctrl.save = () => {
		$http({
			method: 'POST',
			url: 'http://127.0.0.1:3000/new/comment',
			data:{
				entry_id:entry_id,
				content:$ctrl.content,
				type:$ctrl.type,
			},
		}).then(function successCallback(response) {
			if(response.data.success===true){
				$uibModalInstance.close({
					content: $ctrl.content,
					created_at: response.data.created_at,
					type:$ctrl.type,
				})
			}else{
				$ctrl.addAlert('Adatbázis hiba létrehozásnál: '+JSON.stringify(response.data.errorMsg))
			}
		})
	}
	$ctrl.close = () => {$uibModalInstance.close()}
})