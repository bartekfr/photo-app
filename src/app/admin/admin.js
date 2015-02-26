angular.module("admin", [])
.controller("adminCtrl", ["$scope", function ($scope) {
}])
.controller("reportAddCtrl", ["$scope", "reports", "$state", "messenger", function ($scope, reports, $state, messenger) {
	$scope.report = {
		data: [],
		title: ""
	};

	$scope.save = function() {
		reports.save($scope.report).$promise.then(function() {
			$state.go("home");
			messenger.log("New report added");
		});
	};
}])
.controller("reportEditCtrl", ["$scope", "report", "$state", "messenger", function ($scope, report, $state, messenger) {
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
}])
.controller("calculationAddCtrl", ["$scope", "reports", function ($scope, reports) {

}])
.controller("calculationEditCtrl", ["$scope", "report", "$state", "messenger", function ($scope, report, $state, messenger) {

}]);