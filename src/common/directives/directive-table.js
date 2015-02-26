angular.module("directives")
.directive('ngTable', [ function() {
	/*
		value of ngTable attribute is expression used to filter data.
		Properties used in this expression are defined on parent scope so I decided not to use isolated scope
		but simply setting this expression in template string so it's evaluated against proper scope.
		Alternative solution could be filtering data in controller and providing already filtered data to table directive
		or set watcher in directive link function on directive parent scope (see commented code)
	*/
	return {
		restrict: 'AE',
		template: function(elem, attr) {
			var tpl = '<table>' +
			'<tr>' +
				'<th ng-repeat="label in labels" ng-class="{order: label.val == orderProperty}" ' +
				'ng-click="setOrder(label.val)">{{label.text}}</th>' +
			'</tr>' +
			'<tr ng-repeat="row in orderedData = (' + attr.ngTable +' | orderBy:orderProperty:reverse)">';

			var labels = JSON.parse(attr.labels);

			angular.forEach(labels, function(val, i) {
				var tdContent;
				var tdTemplate = val.template;
				if(tdTemplate) {
					tdContent = val.template;
				} else {
					tdContent = "{{row." + val.val + "}}";
				}
				tpl += "<td>" + tdContent + "</td>";
			});

			tpl += "</tr></table>";
			return tpl;
		},
		replace: true,
		scope: true,
		link: function(scope, element, attr) {
			scope.labels = JSON.parse(attr.labels);
			scope.orderProperty = null;
			scope.reverse = false;
			scope.setOrder = function(property) {
				if(scope.orderProperty === property) {
					scope.reverse = !scope.reverse;
				} else {
					scope.reverse = false; //default when new property clicked
				}
				scope.orderProperty = property;
			};
			/*no needed if template is created manually
			scope.$parent.$watchCollection(attr.ngTable, function(value) {
				scope.items = value;
			});
			*/
		}
	};
}]);

