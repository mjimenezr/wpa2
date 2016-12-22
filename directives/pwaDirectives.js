angular.module('wpa2')

.directive("leftMenu", function () {
    return {
        restrict: "E",
        templateUrl: "templates/sidemenu.html",
        controller: "LeftMenuController"
    }
})

.directive("pwaDashboard", function () {
    return {
        restrict: "E",
        templateUrl: "templates/dashboard.html",
        controller: "DashboardController"
    }
})

.directive("messageBoard", function () {
    return {
        restrict: "E",
        templateUrl: "templates/pushmsg.html",
        controller: "pushMessagesCtrl"
    }
})
.directive("watsonChat", function () {
    return {
        restrict: "E",
        templateUrl: "templates/watson.html",
        controller: "watsonCtrl"
    }
})
