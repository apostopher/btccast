/**
 * Created by Rahul on 19/1/15.
 */

(function () {
  'use strict';
  angular
    .module('btcapp.home')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['$scope', 'pusherService', 'receiverService'];

  /* @ngInject */
  function HomeCtrl($scope, pusherService, receiverService) {
    var vm = this;
    vm.price = void 0;
    vm.isAvailable = isAvailable;

    pusherService.on(handlePushMessage);
    receiverService.on(handleSenderMessage);
    receiverService.start();

    return vm;

    //Implementation ---
    function handleSenderMessage(message){

    }

    function isAvailable(){
      console.log(vm.price);
      return (vm.price !== void 0);
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