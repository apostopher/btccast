/**
 * Created by Rahul on 18/1/15.
 */

(function () {
  'use strict';
  angular
    .module('btcapp')
    /* @ngInject */
    .config(function ($stateProvider, $urlRouterProvider, $compileProvider) {
      $compileProvider.debugInfoEnabled(false);
      $urlRouterProvider.otherwise('home');

      $stateProvider
        .state('home', {
          url: '/home',
          cache: false,
          controller: 'HomeCtrl as home',
          templateUrl: 'app/home/home.html'
        });

    });
}());