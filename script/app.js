// app.js
var routerApp = angular.module('routerApp', ['ui.router', 'ui.bootstrap', 'ngResource']);
var languageMode = 'by';

routerApp.config(function($provide, $stateProvider, $urlRouterProvider) {	
    $urlRouterProvider.otherwise('/home');
	
	$provide.decorator('$state', function($delegate, $stateParams) {
        $delegate.forceReload = function() {
            return $delegate.go($delegate.current, $stateParams, {
                reload: true, inherit: false, notify: true
            });
        };
        return $delegate;
    });
    
    $stateProvider
       
        /* HOME STATES */
        .state('home', {
            url: '/home',
            templateUrl: function(stateParams) {
                  return 'content/' + languageMode + '/home.html';
			}
        })
		
		.state('music', {
			url: '/music',
			templateUrl: function(stateParams) {
                  return 'content/' + languageMode + '/music.html';
			}
		})
		
		.state('discog', {
			url: '/discography',
			templateUrl: function(stateParams) {
                  return 'content/' + languageMode + '/discography.html';
			}
		})
		
		.state('foto', {
			url: '/foto',
			templateUrl: function(stateParams) {
                  return 'content/' + languageMode + '/fotoalbum.html';
			}
		})
		
		.state('pub', {
			url: '/pub',
			templateUrl: function(stateParams) {
                  return 'content/' + languageMode + '/publications.html';
			}
		})
		
		.state('biogr', {
			url: '/biography',
			templateUrl: function(stateParams) {
                  return 'content/' + languageMode + '/biography.html';
			}
		})
		
		.state('contacts', {
			url: '/contacts',
			templateUrl: function(stateParams) {
                  return 'content/' + languageMode + '/contacts.html';
			}
		})
		
}); // closes $routerApp.config()


routerApp.controller('MainController', function ($scope, $state, translationService) {
	$scope.radioModel = languageMode;

	$scope.checkModel = {
		BY: true,
		EN: false,
		RU: false
	};
	
	$scope.$watch('radioModel', function (val) {
		var loaded = false;
		return function (val) {
			languageMode = val;

			if (loaded) {
				loaded = true;          
			} else {
				$state.forceReload();
				translationService.getTranslation($scope);
			}
		};
    }());
	
	translationService.getTranslation($scope);
}); // closes $routerApp.controller(MainController)


routerApp.service('translationService', function($resource) {  
	this.getTranslation = function($scope) {
		console.log('#changing menu translations:');
		var languageFilePath = 'translation_' + languageMode + '.json';
		console.log(languageFilePath);
		$resource(languageFilePath).get(function (data) {
			$scope.translation = data;
		});
	};
}); // closes $routerApp.service(translationService)


/*
routerApp.controller('formController', function($scope) {
  
	// we will store our form data in this object
	$scope.formData = {};
	
	$scope.formData.breakfast = false;
	$scope.formData.lunch = false;
	$scope.formData.dinner = false;
	
	$scope.formData.lang = "EN";

	// COLLAPSE =====================
	$scope.isCollapsed = false;
	
});
*/
