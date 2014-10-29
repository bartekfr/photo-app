angular.module("photoApp", [
	"ui.router",
	"filters",
	"services",
	"home",
	"item"
])
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/home");
	// Now set up the states
	$stateProvider
		.state('home', {
			url: "/home",
			templateUrl: "dist/tpl/home/home.html",
			resolve: {
				images: "imagesResources"
			},
			controller: "homeCtrl",
			data: {
				title: "Home page"
			}
		})
		.state('item', {
			url: "/item",
			templateUrl: "dist/tpl/item/item.html",
			controller: "itemCtrl",
			data: {
				title: "Item page"
			}
		});
}])
.run([ '$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
}]);