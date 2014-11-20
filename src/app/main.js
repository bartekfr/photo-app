angular.module("reportsApp", [
	"ui.router",
	"ngResource",
	"filters",
	"directives",
	"services",
	"home",
	"report",
	"admin"
])
.constant('MONGOLAB_CONFIG', {
	DB_NAME: 'reportsdb',
	API_KEY: 'qUxqL9tqS3G-MbTZLJgdH8Ob4e1Yve_p'
})
.factory("reportsCollection", ["reportsDbResource", function(reportsDbResource) {
	return reportsDbResource("reports");
}])
.config(["$stateProvider", "$locationProvider", "$urlRouterProvider", function($stateProvider, $locationProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/home");
	// Now set up the states
	$stateProvider
		.state('home', {
			url: "/home",
			templateUrl: "dist/tpl/home/home.html",
			resolve: {
				reports: ["reportsCollection", function(reports) {
					return reports.query().$promise;
				}]
			},
			controller: "homeCtrl",
			data: {
				title: "Home page"
			}
		})
		.state('report', {
			url: "/report/:id",
			templateUrl: "dist/tpl/report/report.html",
			controller: "reportCtrl",
			resolve: {
				report: ["reportsCollection", "$stateParams", function(reportsCollection, $stateParams) {
					var id = $stateParams.id;
					//return true;  //block http request TODO: remove it
					return reportsCollection.get({id: id}).$promise;
				}]
			},
			data: {
				title: "Month report"
			}
		})
		//edit mode states
		.state('admin', {
			url: "/admin",
			templateUrl: "dist/tpl/admin/admin.html",
			controller: "adminCtrl",
			resolve: {
				token: ["authenticate", function(authenticate) {
					return authenticate.validateToken();
				}]
			},
			data: {
				restricted: true
			}
		})
		.state('admin.add', {
			url: "/add",
			templateUrl: "dist/tpl/admin/add.html",
			controller: "addCtrl",
			resolve: {
				reports: "reportsCollection"
			},
			data: {
				title: "Add new report:)"
			}
		})
		.state('admin.edit', {
			url: "/edit/:id",
			templateUrl: "dist/tpl/admin/edit.html",
			controller: "editCtrl",
			resolve: {
				report: ["reportsCollection", "$stateParams", function(reportsCollection, $stateParams) {
					var id = $stateParams.id;
					//return true;  //block http request TODO: remove it
					return reportsCollection.get({id: id}).$promise;
				}]
			},
			data: {
				title: "Edit report data",
				restricted: true
			}
		});

}])
.run([ '$rootScope', '$state', '$stateParams', "$http", "authenticate", "messenger", function ($rootScope, $state, $stateParams, $http, authenticate, messenger) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;

	var body = document.querySelector("body");

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		body.classList.add("loading");
		var restricted = toState.data.restricted;

		if(restricted) {
			if(localStorage.getItem("token") === null) {
				event.preventDefault();
				body.classList.remove("loading");
				$state.go("home");
				messenger.log("no token, back home");
			}
		}
	});

	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
		body.classList.remove("loading");
	});

	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams) {
		body.classList.remove("loading");
		messenger.log("change state error");
	});
}])
.controller("main", ["$scope", "$state", "authenticate", "$timeout", "$rootScope", function($scope, $state, authenticate, $timeout, $rootScope) {
	$rootScope.logged = authenticate.isLogged();
	$scope.logout = function() {
		authenticate.logout();
	};
	$scope.login = function() {
		 authenticate.login();
	};
}]);