/**
 * Created by Rahul on 21/1/15.
 */

(function () {
  'use strict';
  angular
    .module('btcapp.bitstamp')
    .constant('BITSTAMP_HTTP_API', 'lastprice')
    .factory('httpService', httpService);

  httpService.$inject = ['$http', 'BITSTAMP_HTTP_API'];

  /* @ngInject */
  function httpService($http, BITSTAMP_HTTP_API) {
    var config = {
      method: 'GET',
      url: BITSTAMP_HTTP_API
    };
    return {
      getLastPrice: getLastPrice
    };

    //Implementation ---
    function getLastPrice(callback){
      $http(config).success(function(data){
        callback(null, +data);
      }).error(function(){
        callback(new Error('unable to get price'));
      });
    }
  }
}());