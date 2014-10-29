angular.module("filters", [])
.filter('capitalize', function(){
	return function(input){
		function convert_case(str) {
			var lower = str.toLowerCase();
			return lower.replace(/(^| )(\w)/g, function(x) {
				return x.toUpperCase();
			});
		}
		return convert_case(input);
	};
});