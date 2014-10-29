angular.module("home", [])
.controller("homeCtrl", ["$scope", "images", function ($scope, images) {
	$scope.images = images;

}]);