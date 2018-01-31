angular.module('myApp').controller('ModalEditEntryCtrl', function($uibModalInstance,$scope,$http,entry_id) {
	var $ctrl = this
	$ctrl.alerts=[]
	$ctrl.addAlert = (msg) => {$ctrl.alerts.push({msg: msg})}
	$ctrl.closeAlert = (index) => {$ctrl.alerts.splice(index, 1)}
	$ctrl.entry=$scope.entries.filter((e)=>e.entry_id===entry_id)[0]
	// cloning object by transforming to JSON and then back
	$ctrl.entryForPosting=JSON.parse(JSON.stringify($ctrl.entry))
	$ctrl.resetStars = () => {$ctrl.stars=$ctrl.entryForPosting.rating}
	//inicializálásnál meg is hívjuk a fenti függvényt
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
	$ctrl.save = () => {
	
		if($ctrl.entryForPosting.orig===''){
			$ctrl.entryForPosting.orig=null
		}
		if($ctrl.entryForPosting.hun===''){
			$ctrl.entryForPosting.hun=null
		}
		$http({
			method: 'POST',
			url: 'http://127.0.0.1:3000/edit/entry',
			data:{entry:$ctrl.entryForPosting},
		}).then(function successCallback(response) {
			if(response.data.success===true){
				// using workaround, because simple 
				// reassignment doesn't trigger angular event,
				//	because of memory address change 
				Object.keys($ctrl.entry).forEach(key => {
					$ctrl.entry[key]=$ctrl.entryForPosting[key]
				})
				$uibModalInstance.close('')
			}else{
				$ctrl.addAlert('Adatbázis hiba: '+JSON.stringify(response.data.errorMsg))
			}
		})
	}
})