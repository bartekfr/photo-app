describe('services', function() {

	var responseData, backend;

	beforeEach(module("services"));
	beforeEach(module("ngResource"));

	beforeEach(angular.mock.inject(function($httpBackend) {
		backend = $httpBackend;
		backend.expectGET("https://api.mongolab.com/api/1/databases/reportsdb/collections/reports?apiKey=qUxqL9tqS3G-MbTZLJgdH8Ob4e1Yve_p")
		.respond([
			{
				id: "1",
				title: "Test image"
			},
			{
				id: "2",
				title: "Another test image"
			}
		])
	}));

	beforeEach(angular.mock.inject(function(reportsResource) {
		responseData = reportsResource.query();
		backend.flush();
	}));

	it("Make ajax request", function() {
		backend.verifyNoOutstandingExpectation();
	});

	it("Return image object with title property", function() {
		expect(responseData[0].title).toEqual("Test image");
	});

	it("Returns all data objects", function() {
		expect(responseData.length).toEqual(2);
	});
});





