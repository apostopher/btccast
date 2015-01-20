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
    vm.isAvailable = isAvailable;

    pusherService.on(handleMessage);

    return vm;

    //Implementation ---
    function isAvailable(){
      return (vm.price !== void 0);
    }

    function handleMessage(price){
      if (vm.price === price){
        return;
      }
      $scope.$apply(function() {
        vm.price = price;
      });
    }
  }
}());