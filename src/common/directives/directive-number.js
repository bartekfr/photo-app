angular.module("directives")
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