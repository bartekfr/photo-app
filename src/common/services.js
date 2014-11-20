angular.module("services", [])
.factory("reportsDbResource", ["$resource", "MONGOLAB_CONFIG", function($resource, MONGOLAB_CONFIG) {

	return function(collection) {
		return $resource("https://api.mongolab.com/api/1/databases/reportsdb/collections/" + collection + "/:id", {
			apiKey: MONGOLAB_CONFIG.API_KEY,
			id: "@_id.$oid"
		},
		{
			update: {
				method: "PUT"
			}
		});
	};
}])
.factory("authenticate", ["$http", "$q", "$state", "$rootScope", "messenger", function($http, $q, $state, $rootScope, messenger) {
	OAuth.initialize('eGdqaQpGexXG5mJQfD5W8ctPHq8');
	return {
		login: function() {
			var res = $q.defer();
			if(localStorage.getItem("token") === null) {
				OAuth.popup('google', {
					cache: true
				}).done(function(result) {
					localStorage.setItem("token", result.access_token);
					res.resolve(true);
				}).fail(function() {
					messenger.log("cannot log in");
				});
			}

			var promise = res.promise;
			promise.then(function(){
				$rootScope.logged = true;
				messenger.log("Logged in");
			});
			return promise;
		},
		logout: function() {
			localStorage.removeItem("token");
			// /OAuth.clearCache('google');
			$rootScope.logged = false;
			messenger.log("Logged out");
			$state.go("home").then(function(state) {
				//https://github.com/angular-ui/ui-router/issues/178
				$rootScope.$broadcast('$stateChangeSuccess', state, null);
			});
		},
		isLogged: function() {
			return localStorage.getItem("token") !== null;
		},
		validateToken: function() {
			var that = this;
			return $http.get("https://www.googleapis.com/oauth2/v1/tokeninfo", {
				params: {
					access_token: localStorage.getItem("token")
				}
			})
			.error(function() {
				messenger.log("invalid token");
				that.logout();
			});
		}
	};
}])
.factory("messenger", ["$rootScope", "$timeout", function($rootScope, $timeout) {

	return {
		log: function(msg) {
				//UGLY, temporrary way to show message only for a moment, TODO: use angular animations
				$rootScope.message = msg;
				$timeout(function() {
					$rootScope.message = "";
				}, 3000);

		}
	};
}]);