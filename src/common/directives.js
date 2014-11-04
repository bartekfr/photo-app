angular.module("directives", [])
.directive("chart", [function() {
	return {
		restrict: "AE",
		template: "<div><input ng-model='line' type='checkbox' value='true'></div>",
		replace: true,
		scope: {
			data: "=sourceData"
		},
		link: function(scope, element, attr) {
			scope.$watch("data", function(value) {
				scope.data = value;
				if(value.length) {
					drawChart();
				}
			});

			scope.$watch("line", function(value) {
				element.find("svg").remove();
				drawChart();
			});

			function drawChart() {
				data = scope.data;
				var w = attr.width;
				var h = attr.height;
				var margin = {top: 20, right: 30, bottom: 30, left: 60};
				var width = w - margin.left - margin.right;
				var height = h - margin.top - margin.bottom;

				//x and y scales
				var xScale = d3.scale.ordinal()
					.domain(data.map(function(d) {
						return d.month;
					}));

				if(scope.line) {
					xScale.rangePoints([0, width], 0).range();
				} else {
					xScale.rangeRoundBands([0, width], 0.1);
				}

				var yScale = d3.scale.linear()
					.domain([0, d3.max(data, function(d) {
						return d.value;
					})])
					.range([height, 0]);

				//x and y axis
				var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient("bottom");

				var yAxis = d3.svg.axis()
					.scale(yScale)
					.ticks(10)
					.tickSize(-w, 0)
					.orient("left");

				//create chart svg
				var svg = d3.select(element[0])
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
					.text("Frequency");

				///TODO: move drawing part to another function
				if(scope.line) {
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
							return yScale(d.value);
						})
						.attr("width", xScale.rangeBand())
						.attr("height", 0)
						.attr("height", function(d){
							return height - yScale(d.value);
						});
				}

				//append x axis after bar chart so that axis is over chart
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + parseInt(height) + ")")
					.call(xAxis)
					.append("text")
					.attr("x", width)
					.attr("y", 8)
					.attr("dy", ".71em")
					.style("text-anchor", "middle")
					.text("[months]");
			}
		}
	};
}]);