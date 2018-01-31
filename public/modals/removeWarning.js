angular.module('myApp').controller('ModalRemoveWarningCtrl', function($uibModalInstance) {
	var $ctrl = this
	$ctrl.yes = () => {$uibModalInstance.close('yes')}
	$ctrl.no = () => {$uibModalInstance.close('no')}
})