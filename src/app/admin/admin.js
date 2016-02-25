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
	$scope.report = report;
}])
.controller("calculationAddCtrl", ["$scope", "reports", function ($scope, reports) {

}])
.controller("calculationEditCtrl", ["$scope", "report", "$state", "messenger", function ($scope, report, $state, messenger) {

}]);