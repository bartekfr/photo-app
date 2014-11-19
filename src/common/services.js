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
.factory("authenticate", ["$http", "$q", function($http, $q) {

	return {
		login: function() {
			OAuth.initialize('eGdqaQpGexXG5mJQfD5W8ctPHq8');
			var res = $q.defer();
			if(localStorage.getItem("token") === null) {
				OAuth.popup('google').done(function(result) {
					localStorage.setItem("token", result.access_token);
					res.resolve(true);
				});
			}

			return res.promise;
		},
		logout: function() {
			localStorage.removeItem("token");
		},
		validateToken: function() {
			return $http.get("https://www.googleapis.com/oauth2/v1/tokeninfo", {
				params: {
					access_token: localStorage.getItem("token")
				}
			});
		}
	};
}]);