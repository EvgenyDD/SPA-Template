// app.js
var routerApp = angular.module('routerApp', ['ui.router', 'ui.bootstrap', 'ngResource', 'bootstrapLightbox', 'LocalStorageModule']);
var languageMode = 'by';

var backgroundImagesForStates = {
'home': 'resources/1.jpg',
'music': 'resources/1.jpg',
'discog': 'resources/2.jpg',
'foto':	'resources/2.jpg',
'pub': 'resources/3.jpg',
'biogr':	'resources/2.jpg',
'contacts':	'resources/1.jpg'	
};


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
	
	allLang = document.cookie;
	var onlyLang = allLang.replace("language=",""); 
	if(onlyLang=='by' || onlyLang=='en' || onlyLang=='ru')
		languageMode = onlyLang;

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


routerApp.controller('PaginationCtrl', function ($scope, $log, $stateParams, $state) {
	$scope.currentPage = $stateParams.pageId;

	$scope.loadPage = function() {
		 $state.go('pub', { pageId: $scope.currentPage });	 
	};
}); // closes $routerApp.controller(PaginationCtrl)


routerApp.controller('MenuController', function ($scope, $location, $state, $rootScope){
	$rootScope.$on('$stateChangeSuccess',
	  function(event, toState, toParams, fromState, fromParams) {
		$state.current = toState;
	  }
	)
	
	$scope.isActive = function (viewLocation) {		
		return viewLocation === $state.current.name;	
    };
}); // closes $routerApp.controller(MenuController)


routerApp.controller('ContentController', function ($scope, $state, translationService, $window) {
	$scope.radioModel = languageMode;

	$scope.$watch('radioModel', function (val) {		
		var loaded = false;
		return function (val) {
			languageMode = val;
			document.cookie = "language=" + languageMode;	
			
			translationService.getTranslation($scope);
			
			if (!loaded) {
				loaded = true;
			} else {
				$state.forceReload();					
			}
		};
    }());
}); // closes $routerApp.controller(ContentController)


routerApp.service('translationService', function($resource, $window) {
	this.getTranslation = function($scope) {
		var languageFilePath = 'content/translation_' + languageMode + '.json';	

		$resource(languageFilePath).get(function (data) {
			$scope.translation = data;	 
			$window.document.title = $scope.translation.SITE_TITLE;	
		});
	};
}); // closes $routerApp.service(translationService)


routerApp.directive('bgImg', [function () {
	return {
		'restrict': 'A',
		'scope': true,
		'link': function ($scope, element, attrs) {

		var setBg = function (srcImg) {
			if (!!!srcImg) {
				element[0].style.backgroundImage =  'url(' + attrs.bgSrc + ') ';
			} else {
				element[0].style.backgroundImage =  'url(' + srcImg + ') ';
			}	

			element[0].style.backgroundRepeat = attrs.bgRepeat;
			element[0].style.backgroundSize = attrs.bgSize;
			element[0].style.backgroundAttachment = attrs.bgAttachment;
		};

		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if (Object.keys(backgroundImagesForStates).lastIndexOf(toState.name) > -1) {
			  setBg(backgroundImagesForStates[toState.name]);
			}
		});
		
	}};
}]); //closes $routerApp.directive('bgImg')


routerApp.controller('ScrollCtrl', function($scope, $location, anchorSmoothScroll) {
	$scope.gotoElement = function (eID){
		// set the location.hash to the id of
		// the element you wish to scroll to.
		$location.hash('bottom');

		// call $anchorScroll()
		anchorSmoothScroll.scrollTo(eID);      
	};
}); //closes $routerApp.controller('ScrollCtrl')


routerApp.service('anchorSmoothScroll', function(){   
    this.scrollTo = function(eID) {        
        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / 100)*3;
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for ( var i=startY; i>stopY; i-=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }
        
        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }
        
        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }
    };  
}); //closes $routerApp.service('anchorSmoothScroll')
