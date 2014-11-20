angular.module("admin", [])
.controller("adminCtrl", ["$scope", function ($scope) {
}])
.controller("addCtrl", ["$scope", "reports", function ($scope, reports) {
	$scope.report = {
		data: [],
		title: ""
	};

	$scope.save = function() {
		reports.save($scope.report);
	};
}])
.controller("editCtrl", ["$scope", "report", "$state", "messenger", function ($scope, report, $state, messenger) {
	$scope.reportData = report.data;
	$scope.title = report.title;
	$scope.report = report;

	$scope.remove = function() {
		report.$delete(function() {
			$state.go("home");
		});
	};

	$scope.saveProperties = function() {
		report.title = $scope.title;
		messenger.log("Sending request");
		report.$update(function() {
			messenger.log("Report properties saved");
		});
	};
}]);