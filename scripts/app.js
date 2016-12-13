angular.module('wpa2', ['ionic','nvd3'])

.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('app', {
          url: "/app",
          abstract: true,
          templateUrl: "templates/app.html"
      })
      .state('app.home', {
          url: "/home",
          views: {
              'appContent': {
                  templateUrl: "templates/home.html",
                  controller: "HomeController"
              }
          }
      })

    $urlRouterProvider.otherwise("/app/home");
})

.controller('AppController', function ($scope, $ionicSideMenuDelegate) {
    $scope.toggleLeft = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };
})

.controller("HomeController", function ($scope) {

    // TODO add service worker code here
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
                 .register('scripts/service-worker.js')
                 .then(function () { console.log('Service Worker Registered'); });
    }

})


.controller("LeftMenuController", function ($scope) {

    $scope.data = {
        items: []
    };

    for (var i = 0; i < 7; i++) {
        $scope.data.items.push({
            id: i,
            label: "Opción " + i
        })
    }

})

