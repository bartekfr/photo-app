angular.module("item", [])
.controller("itemCtrl", ["$scope", "report", function ($scope, report) {
	$scope.reportData = report.data;
	//$scope.reportData =  [ { "month" : "january" , "value" : 500} , { "month" : "february" , "value" : -33} , { "month" : "march" , "value" : 50} , { "month" : "april" , "value" : 122} , { "month" : "june" , "value" : 175}];
	$scope.save = function() {
		report.data = $scope.reportData;
		report.$save();
	};

	$scope.addRow = function() {
		$scope.reportData.push({
			"month": "",
			"value": 0
		});
	};

	$scope.remove = function(i) {
		$scope.reportData.splice(i, 1);
	};

}]);