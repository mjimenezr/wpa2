angular.module('wpa2').controller("pushMessagesCtrl", function ($scope, pushNotificationService) {


    $scope.pushMessagesObj = pushNotificationService.getSwReg();

    console.log("GCM = " + JSON.stringify($scope.pushMessagesObj.GCM));



})