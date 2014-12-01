angular.module("directives", [])
.directive("chart", [function() {

	function drawChart(element, data, options) {
		var w = options.width;
		var h = options.height;
		var type = options.type;
		var margin = {top: 20, right: 30, bottom: 30, left: 60};
		var width = w - margin.left - margin.right;
		var height = h - margin.top - margin.bottom;
		var isLine = type === "line";

		//x and y scales
		var xScale = d3.scale.ordinal()
			.domain(data.map(function(d) {
				return d.month;
			}));

		if (isLine) {
			xScale.rangePoints([0, width], 0);
		} else {
			xScale.rangeRoundBands([0, width], 0.1);
		}

		var yMin = d3.min(data, function(d) {
				return d.value;
			});
		var yMax = d3.max(data, function(d) {
				return d.value;
			});

		if(yMax < 0) {
			yMax = 0;
		}
		if(yMin > 0) {
			yMin = 0;
		}

		var yScale = d3.scale.linear()
			.domain([yMin, yMax])
			.range([height, 0]);

		//x and y axis
		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("top");

		var yAxis = d3.svg.axis()
			.scale(yScale)
			.ticks(10)
			.tickSize(-width, 0)
			.orient("left");

		//create chart svg
		var svg = d3.select(element)
			.append("svg")
			.attr("width", w)
			.attr("height", h)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		//append y axis to chart
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", -40)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Billions of dollars");

		if (isLine) {
			//prepare path
			var line = d3.svg.line()
			.x(function(d) {
				return xScale(d.month);
			})
			.y(function(d) {
				return yScale(d.value);
			});

			svg.append("path")
				.attr("class", "line")
				.attr("d", function(d) { return line(data); });
			//add markers
			svg.selectAll('circle')
				.data(data)
				.enter().append('circle')
				.attr('cx', function (d) { return xScale(d.month); })
				.attr('cy', function (d) { return yScale(d.value); })
				.attr('r', 3);

		} else {
			//draw chart
			svg.selectAll("rect")
				.data(data)
				.enter()
				.append("g")
				.attr("transform", function(d) { return "translate(" + xScale(d.month) + ",0)"; })
				.append("rect")
				.attr("class", "bar")
				.attr("y", function(d, i) {
					var value = d.value;
					if(value >= 0) {
						return yScale(value);
					} else {
						return yScale(0);
					}
				})
				.attr("width", xScale.rangeBand())
				.attr("height", 0)
				.attr("height", function(d){
					//return yScale(0) - yScale(d.value);
					return Math.abs(yScale(0) - yScale(d.value));

				});
		}

		//append x axis after bar chart so that axis is over chart
		var axisXGroup = svg.append("g");
			axisXGroup.attr("class", "x axis")
			//.attr("transform", "translate(0," + parseInt(yScale(0)) + ")")
			.attr("transform", "translate(0," + parseInt(yScale(0)) + ")")
			.call(xAxis)
			.append("text")
			.attr("x", width)
			.attr("y", 10)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("[months]");

			axisXGroup.selectAll(".tick text")
			.style("text-anchor", isLine ? "start" :  "middle");

	}

	return {
		restrict: "AE",
		templateUrl: "dist/tpl/directives/chart-directive.html",
		replace: true,
		scope: {
			data: "=sourceData"
		},
		link: function(scope, element, attr) {
			scope.chartTypes = ["line", "bar"];
			scope.chartType = scope.chartTypes[1];
			scope.$watch("data", function(value) {
				scope.data = value;
				element.find("svg").remove();
				if(value.length) {
					draw();
				}
			}, true);

			scope.$watch("chartType", function(value) {
				draw();
			});

			function draw() {
				element.find("svg").remove();
				if(!scope.data.length) {
					return false;
				}
				drawChart(element[0], scope.data, {
					type: scope.chartType,
					width: attr.width,
					height: attr.height
				});
			}
		}
	};
}])
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


			$scope.$watch("editReport.$valid", function(value) {
				$scope.canSave = value;
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
				$scope.reportData.push({
					"month": "",
					"value": 0
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
}])
.directive("number", ["messenger", function(messenger) {
	return {
		restrict: "AE",
		template: '<button ng-click="decrement()">-</button><input type="text" /><button ng-click="increment()">+</button>',
		replace: false,
		require: "ngModel",
		scope: {
			value: "=ngModel",
			step: "=ngStep",
			max: "@",
			min: "@"
		},
		link: function(scope, element, attr, model) {
			var input = element.find("input");

			scope.increment = function() {
				updateModel(1);
			};

			scope.decrement = function() {
				updateModel(-1);
			};

			model.$render = function() {
				input.val(model.$viewValue);
			};

			input.on("input", function() {
				var val = input.val();
				model.$setViewValue(val);
			});


			function updateModel(val) {
				model.$setViewValue(+model.$viewValue + val * scope.step);
				model.$render();
			}

			model.$formatters.push(checkRange);
			model.$formatters.push(toInt);
			model.$parsers.push(toInt);
			model.$parsers.push(checkRange);

			function checkRange(value) {
				var maxCondition = value <= scope.max;
				var minCondition = value >= scope.min;
				var valid = maxCondition && minCondition;

				model.$setValidity("range", valid);

				if(valid) {
					return value;
				}

				return undefined;
			}

			function toInt(val) {
				return parseInt(val, 10);
			}

		}
	};
}]);