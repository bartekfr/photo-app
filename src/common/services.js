angular.module("services", [])
.factory("reportsDbResource", ["$resource", "MONGOLAB_CONFIG", function($resource, MONGOLAB_CONFIG) {

	return function(collection) {
		return $resource("https://api.mongolab.com/api/1/databases/reportsdb/collections/" + collection + "/:id", {
			apiKey: MONGOLAB_CONFIG.API_KEY,
			id: "@_id.$oid"
		});
	};
}]);