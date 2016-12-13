angular.module('wpa2', ['ionic'])

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

.controller("HomeController", function ($scope, $rootScope, pushNotificationService) {

    if ('serviceWorker' in navigator && pushNotificationService.isPushEnabled() ) {
        navigator.serviceWorker
                 .register('scripts/service-worker.js')
                 .then(function (swReg) {
                     console.log('Service Worker Registrado', swReg);
                     window.swRegistration = swReg;
                     pushNotificationService.initialize(swReg, function(){
                         $rootScope.$emit("pushInitialized");
                     });
                 })
                 .catch(function (error) {
                        console.error('Service Worker Error', error);
                 });

        }

})


.controller("LeftMenuController", function ($scope, $rootScope, pushNotificationService) {

    $scope.data = {
        items: []
    };

    for (var i = 0; i < 5; i++) {
        $scope.data.items.push({
            id: i,
            label: "Opción " + i
        })
    }

    $scope.btnLiterals = {
        disabled: "Mensajes Push no soportados",
        subscribe: "Suscribirse a avisos Push",
        showMessages: "Ver avisos",
        unsubscribe: "Dejar de recibir avisos"
    }

    $scope.isPushEnabled = pushNotificationService.isPushEnabled();
    $scope.isSubscribed = pushNotificationService.getUserStatus();

    $rootScope.$on("pushInitialized", function () {
        $scope.isSubscribed = pushNotificationService.getUserStatus();
    })

    $scope.subscribeUser = function () {
        pushNotificationService.subscribeUser(function (result) {
                setTimeout(function () {
                    $scope.isSubscribed = true;
                    $rootScope.$apply();
                }, 200);
        });
    }

    $scope.unSubscribeUser = function () {
        console.log("El usuario ha pulsado el botón de NO suscribirse a Push");
    }

    $scope.goPushNotifications = function () {
        console.log("El usuario ha pulsado el botón de Ver Avisos");
    }

})

