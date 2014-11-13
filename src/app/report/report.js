angular.module("report", [])
.controller("reportCtrl", ["$scope", "report", function ($scope, report) {
	$scope.reportData = report.data;
	$scope.report = report;
	//$scope.reportData =  [ { "month" : "january" , "value" : 500} , { "month" : "february" , "value" : -33} , { "month" : "march" , "value" : 50} , { "month" : "april" , "value" : 122} , { "month" : "june" , "value" : 175}];
}]);