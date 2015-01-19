/**
 * Created by Rahul on 19/1/15.
 */

(function () {
  'use strict';
  angular
    .module('btcapp.common', []);
}());
/**
 * Created by Rahul on 18/1/15.
 */

(function () {
  'use strict';
  angular
    .module('btcapp.core', [
      'ui.router'
    ]);
}());
/**
 * Created by Rahul on 19/1/15.
 */

(function () {
  'use strict';
  angular
    .module('btcapp.pusher', []);
}());
/**
 * Created by Rahul on 19/1/15.
 */

(function () {
  'use strict';
  angular
    .module('btcapp.home', []);
}());
/**
 * Created by Rahul on 19/1/15.
 */

(function () {
  'use strict';
  angular
    .module('btcapp.receiver', []);
}());
/**
 * Created by Rahul on 18/1/15.
 */

(function () {
  'use strict';
  angular
    .module('btcapp', [
      'btcapp.core',
      'btcapp.common',
      'btcapp.home',
      'btcapp.receiver',
      'btcapp.pusher'
    ]);
}());
/**
 * Created by Rahul on 19/1/15.
 */

(function () {
  'use strict';
  angular
    .module('btcapp.common')
    .factory('envService', envService);

  envService.$inject = ['$location'];

  /* @ngInject */
  function envService($location) {
    return {
      isProd: isProd,
      isDev: isDev
    };

    //Implementation ---
    function isDev(){
      return $location.host() === 'localhost';
    }
    function isProd(){
      return !isDev();
    }
  }
}());
/**
 * Created by Rahul on 18/1/15.
 */

(function () {
  'use strict';
  angular
    .module('btcapp')
    /* @ngInject */
    .config(["$stateProvider", "$urlRouterProvider", "$compileProvider", function ($stateProvider, $urlRouterProvider, $compileProvider) {
      $compileProvider.debugInfoEnabled(false);
      $urlRouterProvider.otherwise('home');

      $stateProvider
        .state('home', {
          url: '/home',
          cache: false,
          controller: 'HomeCtrl as home',
          templateUrl: 'app/home/home.html'
        });

    }]);
}());
/**
 * Created by Rahul on 19/1/15.
 */

(function () {
  'use strict';
  angular
    .module('btcapp')
    /* @ngInject */
    .run(function(){

    });
}());
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
/**
 * Created by Rahul on 19/1/15.
 */

(function () {
  'use strict';
  angular
    .module('btcapp.home')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['$scope', 'pusherService'];

  /* @ngInject */
  function HomeCtrl($scope, pusherService) {
    var vm = this;
    pusherService.on(handleMessage);

    return vm;

    //Implementation ---
    function handleMessage(price){
      $scope.$apply(function() {
        vm.price = price;
      });
    }
  }
}());
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