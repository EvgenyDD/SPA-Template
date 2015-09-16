// app.js
var routerApp = angular.module('routerApp', ['ui.router', 'ui.bootstrap', 'ngResource']);
var languageMode = 'by';
var curPage = 1;

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
			url: '/pub/:pageId',
			templateUrl: function(stateParams) {
                  return 'content/' + languageMode + '/publications_' + (stateParams.pageId || 1) + '.html';
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
		});

}); // closes $routerApp.config()

routerApp.controller('PaginationCtrl', function ($scope, $log, $state) {
	$scope.totalItems = 25;//what the fuck 25 equal to 3 pagination buttons?
	$scope.currentPage = curPage;

	$scope.loadPage = function() {
		 $state.go('pub', { pageId: $scope.currentPage });
	};

 /* $scope.maxSize = 5;
  $scope.bigTotalItems = 10;
  $scope.bigCurrentPage = 1;*/
});


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

			if (!loaded) {
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
		var languageFilePath = 'content/translation_' + languageMode + '.json';
		$resource(languageFilePath).get(function (data) {
			$scope.translation = data;
		});
	};
}); // closes $routerApp.service(translationService)
