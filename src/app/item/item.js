angular.module("item", [])
.controller("itemCtrl", ["$scope", "report", function ($scope, report) {
	$scope.data = report;
	$scope.reportData = [
		{month: "january", value: 230},
		{month: "february", value: "-50"},
		{month: "march", value: 50},
		{month: "april", value: 122},
		{month: "june", value: 175}
	];
}]);