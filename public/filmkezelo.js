var app = angular.module('myApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap'])

app.controller('myCtrl', ($scope, $http, $uibModal, $log, $document, $anchorScroll,$filter) => {
	var getAnchor = function(anchorSelector){
		var result= anchorSelector ? 
		angular.element($document[0].querySelector(anchorSelector)) : undefined
		return result
	}
	$scope.anchor = {
		manageTags:getAnchor('#modal-manage-tags-anchor'),
		manageLocations:getAnchor('#modal-manage-locations-anchor'),
		editComment:getAnchor('#modal-edit-comment-anchor'),
		details:getAnchor('#modal-details-anchor'),
		removeWarning:getAnchor('#modal-remove-warning-anchor'),
		editEntry:getAnchor('#modal-edit-entry-anchor'),
		selectLocation:getAnchor('#modal-select-location-anchor'),
		selectTag:getAnchor('#modal-select-tag-anchor'),
	}
	$scope.modalDefaultCfg={
		animation:true,
		ariaLabelledBy: 'modal-title',
		ariaDescribedBy: 'modal-body',
		controllerAs: '$ctrl',
		scope: $scope,
	}
	$scope.markedIds= new Set()
	$scope.hlTagMode=true
	$scope.highlightEntry = (entry_id) => {
		if ($scope.filterLocation && $scope.locationIndex[$scope.filterLocation]) {
			if ($scope.hlLocMode && $scope.locationIndex[$scope.filterLocation].has(entry_id)){
				return true
			}
		} else if ($scope.flt2ndTag && $scope.tagIndex[$scope.flt2ndTag]){
			if ($scope.hlTagMode && $scope.tagIndex[$scope.flt2ndTag].has(entry_id)){
				return true
			}
		}
		return false
	}
	$scope.markEntry = (entry_id) => {
		if (! $scope.markedIds.has(entry_id)){
			$scope.markedIds.add(entry_id)
		} else {
			$scope.markedIds.delete(entry_id)
		}
	}
	$scope.markAll = () => {
		$scope.filteredEntries.map(e => e.entry_id).forEach(e => $scope.markedIds.add(e))
	}
	$scope.markNone = () => {
		$scope.markedIds.clear()
	}
	$scope.filterTitle=''
	$scope.resetFilterTitle=()=>{$scope.filterTitle=''}
	$scope.reset1stTag= () => {$scope.flt1stTag=undefined}
	$scope.reset2ndTag= () => {$scope.flt2ndTag=undefined}
	
	$scope.setPageSize=(num)=>{$scope.pageSize=num}
	$scope.setFilterPrec=(num)=>{$scope.filterPrec=num}
	$scope.setFilterSeen=(num)=>{$scope.filterSeen=num}
	$scope.setFilterLocation=(nm)=>{
		$scope.filterLocation=nm
	}
	$scope.hlLocModeChange= () => {
		$scope.hlLocMode = !$scope.hlLocMode
		if ($scope.hlLocMode&&$scope.hlTagMode){
			$scope.hlTagMode=false
			$scope.selected2ndTag=undefined
		}
	}
	$scope.hlTagModeChange= () => {
		$scope.hlTagMode = !$scope.hlTagMode
		if ($scope.hlLocMode&&$scope.hlTagMode){
			$scope.hlLocMode=false
			$scope.filterLocation=undefined
		}
	}
	$scope.moveToTop = () => {$anchorScroll()}
	$scope.maxSize=1
	$scope.entries=[]
	$scope.filteredEntries=[]
	$scope.currentPageEntries=[]
	//(entries | filter:{prec:filterPrec,seen:filterSeen}| titleSearch:filterTitle | tagSelect:tagIndex:flt1stTag:flt2ndTag:hlTagMode | locationSelect:locationIndex:filterLocation:hlLocMode)  | customOrderBy:propertyName:reverse | startFrom:(currentPage-1)*pageSize | limitTo:pageSize
	$scope.$watchGroup([ 'filterPrec',    //0
								'filterSeen',    //1
								'filterTitle',   //2
								'flt1stTag',     //3
								'flt2ndTag',     //4
								'hlTagMode',     //5
								'filterLocation',//6
								'hlLocMode',     //7
								'entriesChanged',
								],function(newVals, oldVals,scope) {
		var filteredEntries=$filter('filter')(scope.entries,{prec:newVals[0],seen:newVals[1]}).concat()
		filteredEntries=$filter('titleSearch')(filteredEntries,newVals[2])
		filteredEntries=$filter('tagSelect')(filteredEntries,scope.tagIndex,newVals[3],newVals[4],newVals[5])
		scope.filteredEntries=$filter('locationSelect')(filteredEntries,scope.locationIndex,newVals[6],newVals[7]).concat()
		scope.entriesFiltered=!scope.entriesFiltered
	})
	$scope.$watchGroup([ 'propertyName',  //0
								'reverse',       //1
								'entriesFiltered',
								],function(newVals, oldVals,scope) {
		scope.filteredEntries=$filter('customOrderBy')(scope.filteredEntries,newVals[0],newVals[1]).concat()
		scope.entriesSorted=!scope.entriesSorted
	})
	$scope.$watchGroup([
								'currentPage',   //0
								'pageSize',      //1
								'entriesSorted',
							],function(newVals, oldVals,scope) {
		var currentPageEntries=$filter('startFrom')(scope.filteredEntries,(newVals[0]-1)*newVals[1])
		scope.currentPageEntries=$filter('limitTo')(currentPageEntries,newVals[1]).concat()
	})
	
	$scope.tagIndex={}
	$scope.locationIndex={}
	$scope.toggleEntriesChanged = () => {
		$scope.entriesChanged=!$scope.entriesChanged
	}
	$http({
		method: 'GET',
		url: 'http://127.0.0.1:3000/query/entry'
	}).then(function successCallback(response) {
		response.data.forEach(function(e){
			$scope.entries.push(e)
		})
		$scope.toggleEntriesChanged()
		$scope.propertyName = 'orig'
		$scope.currentPage = 1
		$scope.pageSize = 100
	}, function errorCallback(response) {
		console.log('Error:')
		console.log(response)
	})
	$http({
		method: 'GET',
		url: 'http://127.0.0.1:3000/query/locations'
	}).then(function successCallback(response) {
		Object.entries(response.data).forEach(e => {
			$scope.locationIndex[e[0]]=new Set(e[1])
		})
	}, function errorCallback(response) {
		console.log('Error:')
		console.log(response)
	})
	$http({
		method: 'GET',
		url: 'http://127.0.0.1:3000/query/tags'
	}).then(function successCallback(response) {
		Object.entries(response.data).forEach(e => {
			$scope.tagIndex[e[0]]=new Set(e[1])
		})
	}, function errorCallback(response) {
		console.log('Error:')
		console.log(response)
	})	
	$scope.keys=[
		{name:'entry_id',label:'sorszám'},
		{name:'orig',label:'eredeti cím'},
		{name:'hun',label:'magyar cím'},
		{name:'prec',label:'precedencia'},
		{name:'rating',label:'pontozás'},
		{name:'seen',label:'megtekintések'},
		{name:'tag_cnt',label:'tag'},
		{name:'cmnt_cnt',label:'kmnt.'},
	]
	$scope.visible = {}
	$scope.keys.map(e => e.name).forEach((e)=>{
		if (!['tag_cnt','cmnt_cnt','entry_id'].includes(e)){
			$scope.visible[e]=true
		} else {
			$scope.visible[e]=false
		}
	})
	$scope.changeVisibility = (e) => {$scope.visible[e]=!$scope.visible[e]}
	var cnt=0
	
	$scope.reverse=false
	$scope.sortBy = (propertyName) => {
		var i = $scope.keys.map(e => e.name).indexOf(propertyName)
		$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false
		$scope.propertyName = propertyName
	}
	$scope.textSeen = (num) =>{
		switch (num) {
			case 1: return 'egyszer' 
			break
			case 2: return 'kétszer' 
			break
			case 3: return 'sokszor' 
			break
			case undefined: return '(nincs szűrés)' 
			break
			default: return '' 
			break
		}
	}
	$scope.classSeen = (num) => {
		switch (num) {
			case 1: return 'label label-info' 
			break
			case 2: return 'label label-info' 
			break
			case 3: return 'label label-success' 
			break
			default: return '' 
			break
		}
	}
	$scope.textPrec = (num) => {
		switch (num) {
			case 1: return 'megnézve' 
			break
			case 2: return 'legközelebb megnézendő' 
			break
			case 3: return 'később megnézendő' 
			break
			case undefined: return '(nincs szűrés)' 
			break
			default: return '' 
			break
		}
	}
	$scope.classPrec = (num) => {
		switch (num) {
			case 1: return 'label label-success' 
			break
			case 2: return 'label label-warning' 
			break
			case 3: return 'label label-info' 
			break
			default: return '' 
			break
		}
	}
	$scope.textLocation = (nm) => {
		switch (nm) {
			case undefined: return '(nincs szűrés)' 
			break
			case null: return '(nincs meg)' 
			break
			default: return nm 
			break
		}
	}
	$scope.openModalDetails= (entry) => {
		$http({
			method: 'GET',
			url: 'http://127.0.0.1:3000/query/details/'+entry.entry_id
		}).then(function successCallback(response) {
			var details = {}
			details.tags = new Set(response.data.tags)
			details.locations = new Set(response.data.locations)
			details.comments = response.data.comments
			var modalCfg = Object.assign($scope.modalDefaultCfg, {
				size: 'lg',
				appendTo: $scope.anchor.details,
				templateUrl: 'modals/details.html',
				controller: 'ModalDetailsCtrl',
				resolve: {
					details: () => details,
					entry: () => entry,
				},
			}) 
			var modalInstance = $uibModal.open(modalCfg)
			modalInstance.result.then( (selectedItem) => {}, function rejection(error) {
				//$log.info('Modal dismissed at: ' + new Date())
			})
		}, function errorCallback(response) {
			console.log('Error:')
			console.log(response)
		})
	}
	$scope.openModalRemoveWarning = (callbackSuccess) => {
		var modalCfg = Object.assign($scope.modalDefaultCfg,{
			size: 'sm',
			appendTo: $scope.anchor.removeWarning,
			templateUrl: 'modals/removeWarning.html',
			controller: 'ModalRemoveWarningCtrl',
		})
		var modalInstance = $uibModal.open(modalCfg)
		modalInstance.result.then((answer) => {
			if (answer==='yes'){
				callbackSuccess()
			}
		},function rejection(error) {
			//$log.info('Modal dismissed at: ' + new Date())
		})
	}
	$scope.newEntry= () => {
		var modalCfg = Object.assign($scope.modalDefaultCfg,{
			size: 'lg',
			appendTo: $scope.anchor.editEntry,
			templateUrl: 'modals/editEntry.html',
			controller: 'ModalNewEntryCtrl',
		})
		var modalInstance = $uibModal.open(modalCfg)
		modalInstance.result.then((answer) => {
		}, function rejection(error) {
			//$log.info('Modal dismissed at: ' + new Date())
		})
	}
	$scope.editEntry = (entry_id) => {
		var modalCfg = Object.assign($scope.modalDefaultCfg,{
			size: 'lg',
			appendTo: $scope.anchor.editEntry,
			templateUrl: 'modals/editEntry.html',
			controller: 'ModalEditEntryCtrl',
			resolve: {
				entry_id: () => entry_id,
			},
		})
		var modalInstance = $uibModal.open(modalCfg)
		modalInstance.result.then( (answer) => {
		}, function rejection(error) {
			//$log.info('Modal dismissed at: ' + new Date())
		})
	}
	$scope.removeEntry = (entry_id) => {
		$scope.openModalRemoveWarning(function successCallback(){
			$http({
				method: 'GET',
				url: 'http://127.0.0.1:3000/remove/entry/'+entry_id
			}).then(function successCallback(response) {
				if(response.data.success===true){
					var i = $scope.entries.map(e => e.entry_id).indexOf(entry_id)
					$scope.entries.splice(i,1)
					Object.keys($scope.tagIndex).forEach(key => {
						$scope.tagIndex[key].delete(entry_id)
						if ($scope.tagIndex[key].size===0){
							delete $scope.tagIndex[key]
						}
					})
					Object.keys($scope.locationIndex).forEach(key => {
						$scope.locationIndex[key].delete(entry_id)
						if ($scope.locationIndex[key].size===0){
							delete $scope.locationIndex[key]
						}
					})
					$scope.markedIds.delete(entry_id)
					$scope.toggleEntriesChanged()
				}else{
					console.log('Adatbázis hiba törlésnél')
				}
			})
		}, function rejection(error) {
			//$log.info('Modal dismissed at: ' + new Date())
		})
	}
	$scope.openModalSelectTag=(callback)=>{
		var modalCfg = Object.assign($scope.modalDefaultCfg,{
			size: 'lg',
			appendTo: $scope.anchor.selectTag,
			templateUrl: 'modals/selectTag.html',
			controller: 'ModalSelectTagCtrl',
		})
		var modalInstance = $uibModal.open(modalCfg)
		modalInstance.result.then( (answer) => {
			if (answer){
				callback(answer)
			}
		}, function rejection(error) {
			//$log.info('Modal dismissed at: ' + new Date())
		})
	}
	
	$scope.openModalSelectLocation=(callback)=>{
		var modalCfg = Object.assign($scope.modalDefaultCfg,{
			size: 'lg',
			appendTo: $scope.anchor.selectLocation,
			templateUrl: 'modals/selectLocation.html',
			controller: 'ModalSelectLocationCtrl',
		})
		var modalInstance = $uibModal.open(modalCfg)
		modalInstance.result.then( (answer) => {
			if (answer){
				callback(answer)
			}
		}, function rejection(error) {
			//$log.info('Modal dismissed at: ' + new Date())
		})
	}
	
	$scope.select1stTag = () => {
		$scope.openModalSelectTag( (answer) => {
			$scope.flt1stTag=answer
		})
	}
	
	$scope.select2ndTag = () => {
		$scope.openModalSelectTag( (answer) => {
			$scope.flt2ndTag=answer
		})
	}
	
	$scope.batchAddTag = () => {
		$scope.openModalSelectTag( (content) => {
			$http({
				method: 'POST',
				url: 'http://127.0.0.1:3000/new/tag',
				data:{
					entry_ids: [...$scope.markedIds],
					content: content,
				},
			}).then(function successCallback(response) {
				if(response.data.success===true){
					$scope.markedIds.forEach(entry_id => {
						if (! $scope.tagIndex[content]){
							$scope.tagIndex[content]=new Set()
						}
						$scope.tagIndex[content].add(entry_id)
						var i=$scope.entries.map(e => e.entry_id).indexOf(entry_id)
						$scope.entries[i].tag_cnt++
					})
				}else{
					//$scope.addAlert('Adatbázis hiba kötegelt létrehozásnál: '+JSON.stringify(response.data.errorMsg))
				}
			})
		})
	}
	
	$scope.batchRemoveTag = () => {
		$scope.openModalSelectTag( (content) => {
			$http({
				method: 'POST',
				url: 'http://127.0.0.1:3000/remove/tag',
				data:{
					entry_ids: [...$scope.markedIds],
					content: content,
				},
			}).then(function successCallback(response) {
				if(response.data.success===true){
					$scope.markedIds.forEach(entry_id => {
						$scope.tagIndex[content].delete(entry_id)
						if ($scope.tagIndex[content].size===0){
							delete $scope.tagIndex[content]
						}
						var i=$scope.entries.map(e => e.entry_id).indexOf(entry_id)
						$scope.entries[i].tag_cnt--
					})
				}else{
					//$scope.addAlert('Adatbázis hiba kötegelt törlésnél: '+JSON.stringify(response.data.errorMsg))
				}
			})
		})
	}
	
	$scope.batchAddLocation = () => {
		$scope.openModalSelectLocation( (content) => {
			$http({
				method: 'POST',
				url: 'http://127.0.0.1:3000/new/location',
				data:{
					entry_ids: [...$scope.markedIds],
					content: content,
				},
			}).then(function successCallback(response) {
				if(response.data.success===true){
					$scope.markedIds.forEach(entry_id => {
						if (! $scope.locationIndex[content]){
							$scope.locationIndex[content]=new Set()
						}
						$scope.locationIndex[content].add(entry_id)
					})
				}else{
					//$scope.addAlert('Adatbázis hiba kötegelt létrehozásnál: '+JSON.stringify(response.data.errorMsg))
				}
			})
		})
	}
	
	$scope.batchRemoveLocation = () => {
		$scope.openModalSelectLocation( (content) => {
			$http({
				method: 'POST',
				url: 'http://127.0.0.1:3000/remove/location',
				data:{
					entry_ids: [...$scope.markedIds],
					content: content,
				},
			}).then(function successCallback(response) {
				if(response.data.success===true){
					$scope.markedIds.forEach(entry_id => {
						$scope.locationIndex[content].delete(entry_id)
						if ($scope.locationIndex[content].size===0){
							delete $scope.locationIndex[content]
						}
					})
				}else{
					//$scope.addAlert('Adatbázis hiba kötegelt törlésnél: '+JSON.stringify(response.data.errorMsg))
				}
			})
		})
	}
	
})