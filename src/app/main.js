angular.module("reportsApp", [
	"ui.router",
	"ngResource",
	"filters",
	"directives",
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
				reports: ["reportsResource", function(reportsResource) {
					return reportsResource.query();
				}]
			},
			controller: "homeCtrl",
			data: {
				title: "Home page"
			}
		})
		.state('item', {
			url: "/item/:id",
			templateUrl: "dist/tpl/item/item.html",
			controller: "itemCtrl",
			resolve: {
				report: ["reportsResource", "$stateParams", function(reportsResource, $stateParams) {
					var id = $stateParams.id;
					return true;  //block http request TODO: remove it
					//return reportsResource.get({id: id});
				}]
			},
			data: {
				title: "Month report"
			}
		});
}])
.run([ '$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
}]);