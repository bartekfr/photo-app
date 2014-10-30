angular.module("item", [])
.controller("itemCtrl", ["$scope", "report", function ($scope, report) {
	$scope.data = report;
}]);