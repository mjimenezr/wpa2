
angular.module('wpa2').controller('watsonCtrl', function ($scope,$timeout, $http, $rootScope) 
{
    //constantes de trabajo (mock)
    const WORKSPACE_ID ="195d0e47-83cf-46e9-a879-467a817691bb";		
    const URL_WATSONSVC = "https://gateway.watsonplatform.net/conversation/api/v1/workspaces/" + WORKSPACE_ID + "/message?version=2016-09-20";
    const NOMBRE_USER = "Daniel";
    const TARIFA_USER = "Vodafone One";
    const APOLOGIES = "Disculpa, no te he entendido, aún estoy aprendiendo. Por favor, repíteme lo que necesitas de otra manera.";
    const ERRORTXT = "Error al recibir la respuesta";
    const urlRegEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-]*)?\??(?:[\-\+=&;%@\.\w]*)#?(?:[\.\!\/\\\w]*))?)/g;

    //Variables privadas aquí
    var conversation_id = "";
    var finalContext;
    var initConversation = false;
    var vm = this;

    //Miembros Bindeables aquí
    /**
     * array de mensajes que se muestran en la vista
     */
    $rootScope.mensajes = [];
    /**
     * Variable bindeada con el cuadro de texto del usuario
     */
		
    $scope.sendMessage = sendMessage;
		
		
    /**
     * función que se ejecuta cuando el usuario pulsa el botón de enviar mensaje
     */
    function sendMessage(message){

        var messageUser = {
            "user" : true,
            "text" : message
        };
			
        if(!finalContext){
            var context = {
                "Nombre": NOMBRE_USER,
                "Tarifa": TARIFA_USER
            };
            finalContext = context;
        }
			
        if (message && message.length > 0) {
            if (initConversation) {
            $timeout(function(){
                $scope.mensajes.push(messageUser);

            });
            }

        }
        callWatsonAPI(message, finalContext);
    }
		
		
    //API de Watson
    function callWatsonAPI(message, context){

        var Headers = {
            "authorization": "Basic NGVhMzYzNDEtYWYyNC00ZmU2LWFkOGYtMzRhMGMwNGFhNzcwOmNZRG9qNmdET2NjSQ==",
            'Content-Type': 'application/json; charset=utf-8'
        };
                
        var conversacion = {
            context : context
        };
        if (message) conversacion.input = {
            "text": message
        };


        $http({
            method: 'POST',
            url: URL_WATSONSVC,
            headers: Headers,
            data: conversacion,
            withCredentials: true,
            crossDomain: true,
        })
        .success(
            callbackOK
        )
        .error(
            callbackKO
        );
    }
		
    function callbackOK(data){
        var text = "";
        var i=0;
        while(i<data.output.text.length && !text){
            if(data.output.text[i].length > 0){
                text = data.output.text[i];
            }
            i++;
        }
			
        if(!text || text.length == 0){
            text = APOLOGIES;
        }
			
        finalContext = data.context;
			
        text = parseMessage(text);
             console.log("Watson: " + text);
             var messageWatson = {
                "user" : false,
                "text" : text
             };

        $timeout(function(){
            $scope.mensajes.push(messageWatson);
        });
			
        initConversation=true;
    }
		
    function callbackKO(){
        var messageWatson = {
            "text" : ERRORTXT
        };
        $timeout(function(){
            $scope.mensajes.push(messageWatson);
        });
			
        initConversation=true;
    }
		
    /**
     * Parseamos el mensaje de respuesta para comprobar si viene una url y si es así
     * ponerla como enlace.
     * Si la url viene en la posición inicial, abrimos el enlace
     */
    function parseMessage(textToParse){
        var subStringTemp = "";
        var nextSubString = textToParse;
			
        if(textToParse.indexOf("http") > -1){
            if(textToParse.indexOf("http") == 0){
                var index = textToParse.indexOf(" ");
                if(index == -1){
                    index = textToParse.length;
                }
                var url = textToParse.substr(0, index);
                window.open(url,'_new'); //abre el enlace en otra pestaña, manteniendo la conversación activa
            } 
				
            while(nextSubString.indexOf("http") > -1){
                var index = nextSubString.indexOf("http");
                subStringTemp += nextSubString.substr(0, index);
                nextSubString = nextSubString.substr(index, nextSubString.length);
                index = nextSubString.indexOf(" ");
                if(index == -1){
                    index = nextSubString.length;
                }
                var url = fixUrl(nextSubString.substr(0, index));
                subStringTemp += url;
                nextSubString = nextSubString.substr(index, nextSubString.length -1);
            }
            subStringTemp += nextSubString;
        }else{
            return textToParse;
        }

        return subStringTemp;
    }
		
	
		
    function init(){
        sendMessage();
    }
		
    init();
})
