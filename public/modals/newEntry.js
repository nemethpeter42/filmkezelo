angular.module('myApp').controller('ModalNewEntryCtrl', function($uibModalInstance,$scope,$http) {
	var $ctrl = this
	$ctrl.alerts=[]
	$ctrl.addAlert = (msg) => {$ctrl.alerts.push({msg: msg})}
	$ctrl.closeAlert = (index) => {$ctrl.alerts.splice(index, 1)}
	$ctrl.entryForPosting={orig:'',hun:'',prec:null,rating:null,seen:null}
	$ctrl.resetStars = () => {$ctrl.stars=$ctrl.entryForPosting.rating}
	//resetting the stars right at initialization
	$ctrl.resetStars()
	$ctrl.markStars = (i) => {$ctrl.stars=i}
	$ctrl.setStars = (i) => {
		$ctrl.entryForPosting.rating=i
		$ctrl.resetStars()
	}
	$ctrl.classStars = (i) => {
		if ($ctrl.stars!==null && $ctrl.stars>=i){
			return 'stars-marked'
		}
		return 'stars'
	}
	$ctrl.cancel = () => {$uibModalInstance.close('')}
	$ctrl.save = (id) => {
		// cloning object by transforming to JSON and then back
		if($ctrl.entryForPosting.orig===''){
			$ctrl.entryForPosting.orig=null
		}
		if($ctrl.entryForPosting.hun===''){
			$ctrl.entryForPosting.hun=null
		}
		$http({
			method: 'POST',
			url: 'http://127.0.0.1:3000/new/entry',
			data:{entry:$ctrl.entryForPosting},
		}).then(function successCallback(response) {
			if(response.data.success===true){
				$ctrl.entryForPosting.entry_id=response.data.entry_id
				$ctrl.entryForPosting.tag_cnt=0
				$ctrl.entryForPosting.cmnt_cnt=0
				$scope.entries.push($ctrl.entryForPosting)
				$scope.toggleEntriesChanged()
				$uibModalInstance.close('')
			}else{
				$ctrl.addAlert('Adatbázis hiba létrehozásnál: '+JSON.stringify(response.data.errorMsg))
			}
		})
	}
})