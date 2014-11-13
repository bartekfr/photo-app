describe('directives:chart', function() {

	var element, scope, isolatedScope;

	beforeEach(module("directives", "dist/tpl/directives/chart-directive.html"));
	beforeEach(angular.mock.inject(function($compile, $rootScope) {
		var linkingFn = $compile('<chart class="chart" data-width="550" data-height="300" source-data="reportData"></chart>');
		scope = $rootScope;
		scope.reportData =  [ { "month" : "january" , "value" : 500}, { "month" : "february" , "value" : -33}, { "month" : "march" , "value" : 50}, { "month" : "april" , "value" : 122}, { "month" : "june" , "value" : 175}];
		element = linkingFn(scope);
		scope.$digest();
		isolatedScope = element.isolateScope();
	}));

	it("Adds svg element", function() {
		expect(element.find("svg").length).toEqual(1);
	});

	it("Adds x and y axis", function() {
		expect(element.find(".x.axis").length).toEqual(1);
		expect(element.find(".y.axis").length).toEqual(1);
	});

	it("Draw line chart", function() {
		isolatedScope.chartType = "line";
		isolatedScope.$digest();
		expect(element.find(".line").length).toEqual(1);
		expect(element.find(".bar").length).toEqual(0);
	});

	it("Draw bar chart", function() {
		isolatedScope.chartType = "bar";
		isolatedScope.$digest();
		expect(element.find(".line").length).toEqual(0);
		expect(element.find(".bar").length).toEqual(5);
	});

	it("It updates when data are changed", function() {
		scope.reportData =  [ { "month" : "january" , "value" : 500}];
		isolatedScope.chartType = "bar";
		isolatedScope.$digest();
		scope.$digest();
		expect(element.find(".line").length).toEqual(0);
		expect(element.find(".bar").length).toEqual(1);
	});
});





