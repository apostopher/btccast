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