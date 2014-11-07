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

		var yScale = d3.scale.linear()
			.domain([d3.min(data, function(d) {
				return d.value;
			}), d3.max(data, function(d) {
				return d.value;
			})])
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

		///TODO: move drawing part to another function
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
					value = d.value;
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
				if(value.length) {
					draw();
				}
			}, true);

			scope.$watch("chartType", function(value) {
				draw();
			});

			function draw() {
				element.find("svg").remove();
				drawChart(element[0], scope.data, {
					type: scope.chartType,
					width: attr.width,
					height: attr.height
				});
			}


		}
	};
}]);