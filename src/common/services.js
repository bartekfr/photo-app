angular.module("services", [])
.factory('imagesResources',["$timeout", function($timeout) {
	var photos = [
		{
			title: "Picture 1"
		},
		{
			title: "Picture 2"
		}
	];

	//fake ajax request delay
	var fakePromise = $timeout(function() {
		return photos;
	}, 1000);
	return fakePromise;
}]);