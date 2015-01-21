/**
 * Created by Rahul on 19/1/15.
 */

(function () {
  'use strict';
  angular
    .module('btcapp.bitstamp', []);
}());
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
      'btcapp.bitstamp'
    ]);
}());
/**
 * Created by Rahul on 21/1/15.
 */

(function () {
  'use strict';
  angular
    .module('btcapp.bitstamp')
    .constant('BITSTAMP_HTTP_API', 'https://www.bitstamp.net/api/ticker/')
    .factory('httpService', httpService);

  httpService.$inject = ['$http', 'BITSTAMP_HTTP_API'];

  /* @ngInject */
  function httpService($http, BITSTAMP_HTTP_API) {
    var config = {
      method: 'GET',
      url: BITSTAMP_HTTP_API,
      responseType: 'json'
    };
    return {
      getLastPrice: getLastPrice
    };

    //Implementation ---
    function getLastPrice(callback){
      $http(config).success(function(data){
        callback(null, +data.last);
      }).error(function(){
        callback(new Error('unable to get price'));
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
    .module('btcapp.bitstamp')
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
    .module('btcapp.home')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['$scope', 'pusherService', 'receiverService', 'httpService'];

  /* @ngInject */
  function HomeCtrl($scope, pusherService, receiverService, httpService) {
    var vm = this;
    vm.price = void 0;

    pusherService.on(handlePushMessage);
    receiverService.on(handleSenderMessage);
    receiverService.start();

    httpService.getLastPrice(httpHandler);
    return vm;

    //Implementation ---
    function httpHandler(error, price){
      if(!error){
        vm.price = price;
      }
    }

    function handleSenderMessage(message){
      if (vm.senderMessage === message){
        return;
      }
      $scope.$apply(function() {
        vm.senderMessage = message;
      });
    }

    function handlePushMessage(price){
      if (vm.price === price){
        return;
      }
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
      aposMessageBus = castReceiverManager.getCastMessageBus(CAST_NS, cast.receiver.CastMessageBus.MessageType.JSON);
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