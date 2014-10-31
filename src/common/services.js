angular.module("services", [])
.factory("reportsResource", ["$resource", function($resource) {
	return $resource("https://api.mongolab.com/api/1/databases/reportsdb/collections/reports/:id", {
		apiKey: "qUxqL9tqS3G-MbTZLJgdH8Ob4e1Yve_p",
		id: "@_id.$oid"
	});
}]);