(function(angular, window){
'use strict'

var OPTIONS = [
  "Hello, AngularJs",
  "Hello, Seu Viadão"
]

angular
  .module('app', [])
  .controller('HelloController', function($scope, $interval) {
    $scope.message = "AE CARAI"
    $interval(function() { 
      $scope.message = OPTIONS[Math.round(Math.random())]
    }, 1000)
  })
})(angular)