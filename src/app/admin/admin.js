angular.module("admin", [])
.controller("adminCtrl", ["$scope", "$timeout", function ($scope, $timeout) {
	$scope.$on('requestSent', function(e, msg) {
		$scope.message = msg;

		//UGLY, temporrary way to show message only for a moment, TODO: use angular animations
		$timeout(function() {
			$scope.message = "";
		}, 3000);
	});
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
.controller("editCtrl", ["$scope", "report", "$state", function ($scope, report, $state) {
	$scope.reportData = report.data;
	$scope.title = report.title;
	$scope.report = report;
	$scope.message = "aaa";

	$scope.remove = function() {
		report.$delete(function() {
			$state.go("home");
		});
	};

	$scope.saveProperties = function() {
		report.title = $scope.title;
		$scope.$emit('requestSent', "Sending request...");
		report.$update(function() {
			$scope.$emit('requestSent', "Report properties saved");
		});
	};
}]);