angular.module("item", [])
.controller("itemCtrl", ["$scope", "report", function ($scope, report) {
	$scope.data = report;
	$scope.reportData = [
		{month: "january", value: 200},
		{month: "february", value: 56},
		{month: "march", value: 36},
		{month: "april", value: 122},
		{month: "june", value: 175}
	];
}]);