describe('directives:chart', function() {

	var element, scope, isolatedScope;

	beforeEach(module("directives", "dist/tpl/directives/chart-directive.html"));
	beforeEach(angular.mock.inject(function($compile, $rootScope) {
		var linkingFn = $compile('<chart class="chart" data-width="550" data-height="300" source-data="reportData"></chart>');
		scope = $rootScope;
		scope.reportData =  [{ "month" : "january" , "value" : 500}, { "month" : "february" , "value" : -33}, { "month" : "march" , "value" : 50}, { "month" : "april" , "value" : 122}, { "month" : "june" , "value" : 175}];
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
describe('directives:grid', function() {

	var element, scope, isolatedScope;
	beforeEach(module("services"));


	beforeEach(module("directives", "dist/tpl/directives/data-grid-directive.html"));
	beforeEach(angular.mock.inject(function($compile, $rootScope) {
		var linkingFn = $compile('<div grid source-data="report" update="reportData"></div>');
		scope = $rootScope;
		scope.report = {"title" : "My expenses report" , "data" : [ { "month" : "january" , "value" : 300}, { "month" : "february" , "value" : -33}, { "month" : "march" , "value" : 50}, { "month" : "april" , "value" : 122}, { "month" : "june" , "value" : 175}]};
		scope.reportData = null;
		element = linkingFn(scope);
		scope.$digest();
		isolatedScope = element.isolateScope();
	}));

	it("Have row for each data object", function() {
		expect(element.find(".edit-row").length).toEqual(5);
		scope.report.data.push({ "month" : "december" , "value" : 400});
	});
	
	it("Removes row", function() {
		isolatedScope.remove(0);
		isolatedScope.$digest();
		expect(element.find(".edit-row").length).toEqual(4);
	});

	it("Adds row", function() {
		isolatedScope.addRow();
		isolatedScope.$digest();
		expect(element.find(".edit-row").length).toEqual(6);
	});

	it("On init form is pristine", function() {
		expect(element.find(".form").hasClass("ng-pristine")).toBe(true);
	});

	it("After change form is dirty", function() {
		isolatedScope.addRow();
		isolatedScope.$digest();
		expect(element.find(".form").hasClass("ng-dirty")).toBe(true);
	});

	it("After change form is dirty", function() {
		var input = element.find(".month input").eq(0);
		input.val("").trigger("input");
		isolatedScope.$digest();
		expect(element.find(".form").hasClass("ng-dirty")).toBe(true);
	});

	it("Before change save button is disabled ", function() {
		expect(element.find("button[type='submit']").is(":disabled")).toBe(true);
	});

	it("After change save button is enabled ", function() {
		isolatedScope.addRow();
		isolatedScope.$digest();
		expect(element.find("button[type='submit']").is(":disabled")).toBe(false);
	});
});





