/**
 * Created by Rahul on 19/1/15.
 */

(function () {
  'use strict';
  angular
    .module('btcapp.receiver')
    .constant('CAST_NS', 'urn:x-cast:com.apostopher.cast')
    .factory('receiverService', receiverService);

  receiverService.$inject = ['$window', 'envService', 'CAST_NS'];

  /* @ngInject */
  function receiverService($window, envService, CAST_NS) {
    // closure variables
    var castReceiverManager;
    var aposMessageBus;

    return {
      init: init,
      start: start
    };

    // Implementation ---
    function attachEventHandlers(){
      castReceiverManager.onSenderDisconnected = onSenderDisconnected;
    }

    function onSenderDisconnected(event){
      if(castReceiverManager.getSenders().length === 0 &&
          event.reason === cast.receiver.system.DisconnectReason.REQUESTED_BY_SENDER) {
          $window.close();
        }

    }

    function setupMessageBus(){
      aposMessageBus = castReceiverManager.getCastMessageBus(CAST_NS);
      aposMessageBus.onMessage = handleMessage;
    }

    function handleMessage(event){

    }

    function init(){
      castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
    }

    function getConfig(){
      var appConfig = new cast.receiver.CastReceiverManager.Config();
      appConfig.statusText = 'Ticker is ready.';
      if(envService.isDev()){
        appConfig.maxInactivity = 6000;
      }
      return appConfig;
    }

    function start(){
      castReceiverManager.start(getConfig());
    }
  }
}());