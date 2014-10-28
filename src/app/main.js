angular.module('photoApp', ["filters"])
.controller('mainController', ['$scope', function ($scope){
	$scope.appName = "photo app"
}])