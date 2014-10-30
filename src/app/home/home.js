angular.module("home", [])
.controller("homeCtrl", ["$scope", "reports", function ($scope, reports) {
	$scope.reports = reports;

}]);