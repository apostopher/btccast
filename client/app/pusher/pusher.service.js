/**
 * Created by Rahul on 19/1/15.
 */

(function () {
  'use strict';
  angular
    .module('btcapp.pusher')
    .constant('PUSHER_KEY', 'de504dc5763aeef9ff52')
    .constant('CHANNEL', 'live_trades')
    .factory('pusherService', pusherService);

  pusherService.$inject = ['PUSHER_KEY', 'CHANNEL'];

  /* @ngInject */
  function pusherService(PUSHER_KEY, CHANNEL) {
    var notify = function(){};
    var pusher;
    var trades_channel;
    setup();

    return {
      on: registerCallback
    };

    //Implementation ---
    function setup(){
      pusher = new Pusher(PUSHER_KEY);
      trades_channel = pusher.subscribe(CHANNEL);
      trades_channel.bind('trade', onMessage);
    }

    function onMessage(data){
      notify(data.price);
    }
    function registerCallback(callback){
      notify = callback;
    }
  }
}());