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
    vm.price = 'loading price...';
    
    pusherService.on(handleMessage);

    return vm;

    //Implementation ---
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