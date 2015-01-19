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