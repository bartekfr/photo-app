angular.module("home", [])
.controller("homeCtrl", ["$scope", "reports", "calculations", function ($scope, reports, calculations) {
	$scope.reports = reports;
	$scope.calculations = calculations;
}]);