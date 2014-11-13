angular.module("admin", [])
.controller("adminCtrl", ["$scope", function ($scope) {
}])
.controller("addCtrl", ["$scope", "reports", function ($scope, reports) {
}])
.controller("editCtrl", ["$scope", "report", function ($scope, report) {
	console.log(22);
	$scope.reportData = report.data;
	$scope.report = report;
}]);