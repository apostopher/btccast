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