angular.module("directives")
.directive("grid", [function() {
	return {
		restrict: "AE",
		templateUrl: "dist/tpl/directives/data-grid-directive.html",
		replace: true,
		scope: {
			report: "=sourceData",
			toUpdate: "=update"
		},
		controller: ["$scope", "messenger", function($scope, messenger) {
			$scope.reportData = angular.copy($scope.report.data);
			$scope.toUpdate = $scope.reportData;

			$scope.$watchGroup(["editReport.$valid", "editReport.$dirty"], function(newValues) {
				$scope.canSave = newValues[0] && newValues[1];
			});

			$scope.save = function() {
				$scope.report.data = $scope.reportData;
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
				$scope.reportData.splice(i, 1);
				$scope.editReport.$setDirty();
			};

			$scope.revert = function() {
				messenger.log("Sending request...");
				$scope.report.$get().then(function(response) {
					$scope.reportData = angular.copy(response.data);
					$scope.toUpdate = $scope.reportData;
					$scope.editReport.$setPristine();
					messenger.log("Report data restored from database");
				});
			};
		}]
	};
}]);