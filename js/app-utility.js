var app = angular.module('appUtility', ['ngRoute'])
.config(function ($routeProvider, $locationProvider) {
    $routeProvider
    .when('/Main', {
        templateUrl: '/pages/main.html',
        controller: 'MainCtrl',
    })
    .when('/List/:id', {
        templateUrl: '/pages/list.html',
        controller: 'ListCtrl',
    })
    .otherwise({
        redirectTo: '/Main'
    });
});
app.controller('MainCtrl', function ($scope, $route, $http) {

	$scope.lists = [];

	$http.get("/_api/Lists", {
		headers : { 'Accept' : 'application/json; odata=verbose' }
	}).then(function(result) {
		$scope.lists = result.data.d.results;
		console.log(result.data.d.results);
	});
});
app.controller('ListCtrl', function ($scope, $route, $http) {
	$scope.id = $route.current.params["id"];
	$scope.title = "";

	$scope.fields = null;
	$scope.items = null;

	$http.get("/_api/Web/Lists(guid'" + $scope.id + "')", {
		headers : { 'Accept' : 'application/json; odata=verbose' }
	}).then(function(result) {
		$scope.list = result.data.d;
		$scope.title = result.data.d.Title;
	});

	//Fields
	$scope.getFields = function() {
		if($scope.fields == null) {
			$http.get("/_api/Web/Lists(guid'" + $scope.id + "')/Fields", {
				headers : { 'Accept' : 'application/json; odata=verbose' }
			}).then(function(result) {
				$scope.fields = result.data.d.results;
				console.log($scope.fields);
			});
		} else {
			$scope.fields = null;
		}
	}

	//FieldsCSharp
	$scope.getFieldsCSharp = function() {
		if($scope.fieldsCSharp == null) {
			$http.get("/_api/Web/Lists(guid'" + $scope.id + "')/Fields", {
				headers : { 'Accept' : 'application/json; odata=verbose' }
			}).then(function(result) {
				$scope.fieldsCSharp = result.data.d.results;
				console.log($scope.fieldsCSharp);
			});
		} else {
			$scope.fieldsCSharp = null;
		}
	}

	//Items
	$scope.getItems = function() {
		if($scope.items == null) {
			$http.get("/_api/Web/Lists(guid'" + $scope.id + "')/Fields?$select=Title,Hidden&$orderby=Title&$top=100&$filter=Hidden eq false", {
				headers : { 'Accept' : 'application/json; odata=verbose' }
			}).then(function(result) {
				$scope._fields = result.data.d.results;
				console.log(result.data.d.results);

				$http.get("/_api/Web/Lists(guid'" + $scope.id + "')/Items", {
					headers : { 'Accept' : 'application/json; odata=verbose' }
				}).then(function(result) {
					$scope.items = result.data.d.results;
					console.log($scope.items);
				});
			});
			
		} else {
			$scope.items = null;
		}
	}

	$scope.getType = function(object) {
		return typeof(object);
	}

	$scope.getContent = function(event, url) {
		event.preventDefault();
		$http.get(url, {
			headers : { 'Accept' : 'application/json; odata=verbose' }
		}).then(function(result) {
			console.log(result.data.d);
			if(result.data.d.results != null && result.data.d.results.constructor === Array) {
				$scope.array = result.data.d.results;
			} else {
				if(result.data.d.results != null) {
					$scope.object = result.data.d.results;
				} else {
					$scope.object = result.data.d;
				}
				console.log('object' + typeof(result.data.d.results));
			}
			$scope.list = null;
		});
	}

	$scope.getCsharpType = function(spType) {
		if(spType == 'Text' || spType == 'Note') {
			return 'string';
		}
		if(spType == 'Integer' || spType == 'Counter') {
			return 'int';
		}
		if(spType == 'Number') {
			return 'double';
		}
		if(spType == 'Lookup') {
			return 'SPFieldLookupValue';
		}
		if(spType == 'User') {
			return 'SPFieldLookupValue';
		}
		return spType;
	}
});