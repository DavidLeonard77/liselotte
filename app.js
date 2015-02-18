(function(){

	var book = [

		{

			title: 'Introduction',
			url: '/chapter.html?chapter=1',
			directory: '/graphics/chapters/chapter1/',
			preview: 'preview.jpg',

			page: [

				{

					image: 'images/image01415.jpg',
					cap: 'Slide 1 caption',
					txt: 'descriptions/description01.txt',
					audio: 'audio/audiofile1.mp3'

				}

			]

		},{

			title: 'Childhood',
			url: '/chapter.html?chapter=2',
			directory: '/graphics/chapters/chapter2/',
			preview: 'preview.jpg',

			page: [

				{

					image: 'images/image01415.jpg',
					cap: 'Slide 1 caption',
					txt: 'descriptions/description01.txt',
					audio: 'audio/audiofile1.mp3'

				},{

					image: 'images/image01516.jpg',
					cap: 'Slide 2 caption',
					txt: 'descriptions/description02.txt',
					audio: 'audio/audiofile2.mp3'

				},{

					image: 'images/image01617.jpg',
					cap: 'Slide 3 caption',
					txt: 'descriptions/description03.txt',
					audio: 'audio/audiofile3.mp3'

				},{

					image: 'images/image02021.jpg',
					cap: 'Slide 4 caption',
					txt: 'descriptions/description04.txt',
					audio: 'audio/audiofile4.mp3'

				},{

					image: 'images/image02122.jpeg',
					cap: 'Slide 5 caption',
					txt: 'descriptions/description05.txt',
					audio: 'audio/audiofile5.mp3'

				},{

					image: 'images/image02223.jpeg',
					cap: 'Slide 6 caption',
					txt: 'descriptions/description06.txt',
					audio: 'audio/audiofile6.mp3'

				}

			]

		}

	];

	var app = angular
		.module('liselotteSite',[])
		.config(['$locationProvider', function($locationProvider) {

			$locationProvider.html5Mode(true);
		}])
		.directive('cover',function(){
			return {
				restrict: 'E',
				templateUrl: '/index.php/liselotte/cover.html',
				controller: function(){

					this.cover = {

						title: 'Liselotte',
						slides: [

							'/graphics/cover/old_town_warsaw-destroyed.jpg',
							'/graphics/cover/jewish-couple-P.jpeg'

						]

					};

				},
				controllerAs: 'coverCtrl'
			}
		})
		.directive('chapters',function(){
			return {
				restrict: 'E',
				templateUrl: '/index.php/liselotte/chapters.html',
				controller: function($scope){

					$scope.thumbWidth = 20;
					$scope.thumbHeight = 20;

					$scope.chapterThumbSize = function(){
						$scope.thumbWidth = Math.floor(($(window).width()-368)/2);
						$scope.thumbHeight = Math.floor(this.thumbWidth/3*2);
					};

					$(window).resize(function(){
						$scope.$apply(function(){
							$scope.chapterThumbSize();
						});
					});

					$scope.chapterThumbSize();

					this.gotoChapter = function (chapter) { document.location = '/index.php/liselotte' + chapter };

				},
				controllerAs: 'chaptersCtrl'
			};
		})
		.directive('page',function($location){
			return {
				restrict: 'E',
				templateUrl: '/index.php/liselotte/page.html',
				controller: function(){

					this.bookGallery = book;

					var urlParams = $location.search();
					var chapter = parseInt(urlParams['chapter'])-1;

					for (var x in this.bookGallery) {
						if (chapter == parseInt(x)+1) { book[parseInt(x)].show = true; }
						else { book[parseInt(x)].show = false; }
					}

					// initialize carousel
					var directory = book[chapter].directory;
					var pageCount = 0;

					this.isFirst = true;
					this.isLast = false;

					$('.carousel-page-image-prev').css({'opacity':'1'});
					$('.carousel-page-image-active').css({'background-image':'url(' + directory+book[chapter].page[pageCount].image + ')','opacity':'1'});
					if (book[chapter].page.length > 1) {
						$('.carousel-page-image-next').css({'background-image':'url(' + directory+book[chapter].page[pageCount+1].image + ')','opacity':'0'});
					}

					function getDescription(ch,pg) {
						$.ajax({
							url : directory+book[ch].page[pg].txt,
							dataType: "text",
							success : function(data) {
								$('.carousel-page-txt').html(data);
							}
						});
					};

					this.checkLimits = function(){

						if (pageCount == 0) this.isFirst = true;
						else this.isFirst = false;

						if (pageCount+1 >= book[chapter].page.length) this.isLast = true;
						else this.isLast = false;
					};

					this.showNext = function(){

						// if there are more images
						if (!this.isLast) {
							
							pageCount++;
							this.checkLimits();

							// reveal next
							$('.carousel-page-image-next').css({'opacity':'1'});
							this.carousel.cap = book[chapter].page[pageCount].cap;
							getDescription(chapter,pageCount);

							setTimeout(function(){

								// move carousel
								$('.carousel-page-image-active').css({'background-image':'url(' + directory+book[chapter].page[pageCount].image + ')'});
								$('.carousel-page-image-prev').css({'background-image':'url(' + directory+book[chapter].page[pageCount-1].image + ')'});
								
								// close door
								$('.carousel-page-image-next').css({'opacity':'0'});


								// if there are more
								if (pageCount+2 < book[chapter].page.length) {

									setTimeout(function(){

										// preload next
										$('.carousel-page-image-next').css({'background-image':'url(' + directory+book[chapter].page[pageCount].image + ')'});

									},1000);
								
								}

  							},1000);

  						}
					};

					this.showPrev = function(){

						// if not first
						if (!this.isFirst) {

							pageCount--;
							this.checkLimits();

							// reveal prev
							$('.carousel-page-image-active').css({'opacity':'0'});
							this.carousel.cap = book[chapter].page[pageCount].cap;
							getDescription(chapter,pageCount);

							setTimeout(function(){

								// move carousel
								$('.carousel-page-image-active').css({'background-image':'url(' + directory+book[chapter].page[pageCount].image + ')'});
								$('.carousel-page-image-next').css({'background-image':'url(' + directory+book[chapter].page[pageCount+1].image + ')'});

								// close door
								$('.carousel-page-image-active').css({'opacity':'1'});

								// if there are more
								if (pageCount > 1) {

									setTimeout(function(){
										
										// preload prev
										$('.carousel-page-image-prev').css({'background-image':'url(' + directory+book[chapter].page[pageCount].image + ')'});
									
									},1000);

								}

							},1000);


  						}
					};

					this.carousel = {
						cap: book[chapter].page[pageCount].cap
					};
					getDescription(chapter,pageCount);

				},
				controllerAs: 'pageCtrl'
			};
		})
		.directive('menu',function(){
			return {
				restrict: 'E',
				templateUrl: '/index.php/liselotte/menu.html',
				controller: function($scope){

					$scope.menu = {

						title : 'Liselotte',
						nav : {}

					};

					$scope.menu.nav['galleries'] = {
						visible: false,
						title: 'galleries',
						url: 'index.php/liselotte'
					};

					$scope.menu.nav['home'] = {
						visible: false,
						title: 'home',
						url: 'index.php/liselotte'
					};

					$scope.showMenu = function (menuItem) {

						if (menuItem == 'galleries') {
							for (var item in $scope.menu.nav) { if (item != menuItem) $scope.menu.nav[item].visible = false }
							$scope.menu.nav[menuItem].visible = true;
							$('.menu-items-spacer').css({ 'opacity' : '1' });
						}

					}

					$scope.hideMenu = function (menuItem) {

						$('.menu-items-spacer').css({ 'opacity' : '0' });

						setTimeout(function(){
							$scope.$apply(function(){
								$scope.menu.nav[menuItem].visible = false;
							});
						}, 500);
					}

				},
				controllerAs: 'menuCtrl'
			};
		})
		.controller('globalCtrl',function($scope,$location){

			$scope.pageNav = function (url) {

				window.location = url;
			};

			$scope.book = book;
		});

})();