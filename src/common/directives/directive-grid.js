angular.module("directives")
.directive("grid", [function() {
	return {
		restrict: "AE",
		templateUrl: "dist/tpl/directives/data-grid-directive.html",
		replace: true,
		scope: {
			report: "=sourceData",
		},
		controller: ["$scope", "messenger", function($scope, messenger) {
			$scope.reportData = $scope.report.data;

			$scope.$watchGroup(["editReport.$valid", "editReport.$dirty"], function(newValues) {
				$scope.canSave = newValues[0] && newValues[1];
			});

			$scope.save = function() {
				messenger.log("Sending request...");
				$scope.report.$update(function() {
					$scope.editReport.$setPristine();
					messenger.log("Report data saved");
				});
			};

			$scope.addRow = function() {
				$scope.editReport.$setDirty();
				if($scope.reportData.length === 0) {
					$scope.total = 1;
				} else {
					$scope.total =  $scope.reportData[$scope.reportData.length - 1].id + 1;
				}

				$scope.reportData.push({
					"month": "",
					"value": 0,
					"id": $scope.total
				});
			};

			$scope.remove = function(i) {
				$scope.report.data.splice(i, 1);
				$scope.editReport.$setDirty();
			};

			$scope.revert = function() {
				messenger.log("Sending request...");
				$scope.report.$get().then(function(response) {
					//$scope.report = response;
					$scope.reportData = response.data;
					$scope.editReport.$setPristine();
					messenger.log("Report data restored from database");
				});
			};
		}]
	};
}]);