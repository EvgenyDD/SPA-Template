// app.js
var routerApp = angular.module('routerApp', ['ui.router', 'ui.bootstrap', 'ngResource', 'bootstrapLightbox']);
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


routerApp.controller('GalleryCtrl', function ($scope, Lightbox) {
    $scope.images = [
    {
      'url': 'https://farm6.staticflickr.com/5830/20552523531_e1efec8d49_k.jpg',
      'thumbUrl': 'https://farm6.staticflickr.com/5830/20552523531_ef720cd2f1_s.jpg',
      'caption': 'This image has dimensions 2048x1519 and the img element is scaled to fit inside the window.'
    },
    {
      'url': 'https://farm8.staticflickr.com/7300/12807911134_ff56d1fb3b_b.jpg',
      'thumbUrl': 'https://farm8.staticflickr.com/7300/12807911134_ff56d1fb3b_s.jpg'
    },
    {
      'url': 'https://farm1.staticflickr.com/400/20228789791_52fb84917f_b.jpg',
      'thumbUrl': 'https://farm1.staticflickr.com/400/20228789791_52fb84917f_s.jpg',
      'caption': 'The left and right arrow keys are binded for navigation. The escape key for closing the modal is binded by AngularUI Bootstrap.'
    },
    {
      'url': 'https://farm1.staticflickr.com/260/20185156095_912c2714ef_b.jpg',
      'thumbUrl': 'https://farm1.staticflickr.com/260/20185156095_912c2714ef_s.jpg'
    },
    {
      'url': 'https://farm6.staticflickr.com/5757/20359334789_57316968ed_m.jpg',
      'thumbUrl': 'https://farm6.staticflickr.com/5757/20359334789_57316968ed_s.jpg',
      'caption': 'Default minimum modal dimensions (400x200) apply for this image (240x95).'
    },
    {
      'url': 'https://farm1.staticflickr.com/359/18741723375_28c89372d7_c.jpg',
      'thumbUrl': 'https://farm1.staticflickr.com/359/18741723375_28c89372d7_s.jpg'
    },
    {
      'url': 'https://farm6.staticflickr.com/5606/15425945368_6f6ae945fc.jpg',
      'thumbUrl': 'https://farm6.staticflickr.com/5606/15425945368_6f6ae945fc_s.jpg'
    },
    {
      'url': 'https://farm9.staticflickr.com/8033/8010849891_3f029d68b3_c.jpg',
      'thumbUrl': 'https://farm9.staticflickr.com/8033/8010849891_3f029d68b3_s.jpg'
    },
    {
      'url': 'https://farm1.staticflickr.com/553/18990336631_4856e7e02c_h.jpg',
      'thumbUrl': 'https://farm1.staticflickr.com/553/18990336631_0186ac9e3e_s.jpg'
    },
    {
      'url': 'https://farm9.staticflickr.com/8736/16599799789_458891e47f_h.jpg',
      'thumbUrl': 'https://farm9.staticflickr.com/8736/16599799789_2fe489b6df_s.jpg',
      'caption': 'The next image does not exist and shows how loading errors are handled by default.'
    },
    {
      'url': '/does-not-exist.jpg',
      'thumbUrl': '/does-not-exist.jpg',
      'caption': 'This caption does not appear.'
    },
    {
      'url': 'https://farm9.staticflickr.com/8573/16800210195_a8af2ba1bb_h.jpg',
      'thumbUrl': 'https://farm9.staticflickr.com/8573/16800210195_85ab79b777_s.jpg',
      'caption': 'The previous image does not exist and shows how loading errors are handled by default.'
    },
    {
      'url': 'https://farm4.staticflickr.com/3870/14860034616_c0dd8cbc71_h.jpg',
      'thumbUrl': 'https://farm4.staticflickr.com/3870/14860034616_1c941f4f06_s.jpg'
    },
  ];

  $scope.openLightboxModal = function (index) {
    Lightbox.openModal($scope.images, index);
  };
  
 /* Lightbox.getImageUrl = function (image) {
    return '/resources/' + image.getName();
  };

  Lightbox.getImageCaption = function (image) {
    return image.label;
  };*/
});