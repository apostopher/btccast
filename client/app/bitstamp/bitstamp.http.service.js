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