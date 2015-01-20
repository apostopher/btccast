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
    var notifyCallback;

    return {
      start: start,
      on: registerCallback
    };

    // Implementation ---
    function registerCallback(callback){
      notifyCallback = callback;
    }

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
      aposMessageBus = castReceiverManager.getCastMessageBus(CAST_NS, cast.receiver.CastMessageBus.MessageType.STRING);
      aposMessageBus.onMessage = handleMessage;
    }

    function handleMessage(event){
      notifyCallback(event.data.message);
    }

    function init(){
      castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
      setupMessageBus();
      attachEventHandlers();
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
      init();
      castReceiverManager.start(getConfig());
    }
  }
}());