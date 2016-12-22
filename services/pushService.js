angular.module('wpa2').service("pushNotificationService", function () {

    var pushEnabled = false;
    var subscribed = false;
    var swReg = {};
    const pushServerPublicKey = 'BGo9tardRSrMHf9Uy80SjTI23IJiGK_e39EJeJLPR8CzMnEoBc5mIE7x3ADc2ZFV9DyeobA98m6ep6H1kUrtUlU';
    const appServerPublicKey = urlB64ToUint8Array(pushServerPublicKey);

    function urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
          .replace(/\-/g, '+')
          .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    //actualiza la suscripción push en el servidor
    function updateSubscriptionOnServer(subscription, callBack) {

        console.log("[updateSubscriptionOnServer] push subscription:" +  JSON.stringify(subscription));

        if (typeof callBack == 'function') callBack();

    }


    return {

        //devuelve si el navegador admite notificaciones Push
        isPushEnabled: function () {
            if ('PushManager' in window) {
                console.log('Push está soportado');
                pushEnabled = true;
                return true;
            }
            else {
                console.log('Push NO está soportado');
                pushEnabled = false;
                return false;
            }
        },

        getSwReg: function () {
            return swReg;
        },

        initialize : function(swRegistrationObject, callBack) {
            // Set the initial subscription value
            swReg = swRegistrationObject;
            swReg.GCM = swReg.GCM || {};
            swReg.pushManager.getSubscription()
            .then(function(subscription) {
                subscribed = !(subscription === null);
                if (subscribed) {
                    console.log('El usuario está suscrito a mensajes Push.');
                } else {
                    console.log('Usuario no está suscrito a mensajes Push.');
                }
                if (typeof callBack == 'function') callBack(subscribed);
                return subscribed;
            });
        },

        getUserStatus: function () {
            return subscribed;
        },

        //suscribir al usuario
        subscribeUser(callBack) {
            swReg.pushManager.subscribe({
                userVisibleOnly: true,
                //applicationServerKey: appServerPublicKey
            })
            .then(function(subscription) {
                console.log('Activada la suscripción del usuario:', subscription);

                updateSubscriptionOnServer(subscription, function () {
                    callBack(true);
                });
            })
            .catch(function(err) {
                console.log('Error al suscribir al usuario a notificaciones push: ', err);
                return null;
            });
        }
    }
})