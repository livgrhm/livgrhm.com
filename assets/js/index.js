function initInstagram() {
	var feed = new Instafeed({
		get: 'user',
		userId: 3953160061,
		accessToken: '3953160061.5e270e0.e387c4bf0e3041e4a20e2059e379fe40',
		target: 'instafeed',
		resolution: 'standard_resolution',
		template: '<div class="col-xs-12 col-sm-6 col-md-3"><a href="{{link}}"><img src="{{image}}" /></a></div>',
		after: function() {
			var rem = ($('#instafeed').children().length % 4);
			if (rem !== 0) {
				for (var i = 1; i <= rem; i++) {
					$('#instafeed').children()[$('#instafeed').children().length - i].remove();
				}
			}
		}
	});
	feed.run();
}

function initSkills() {
	$('.skills-item').each( function (i, e) {
		$(e).hover(
			function () {
				$(e).find('.skills-hover').css('display', 'block');
			}, function () {
				$(e).find('.skills-hover').css('display', 'none');
			}
		);
	});
}

function initSlick() {
	$('.testimonials').slick({
	    autoplay: true,
		autoplaySpeed: 5000,
		arrows: false//,
		// dots: true
	});
}

function initMasonry() {
	$('.blog-tiles').masonry({
	  // options
	  itemSelector: '.blog-item'
	});

	$('.blog-item').each( function (i, e) {
		$(e).hover(
			function () {
				$(e).addClass('shadow');
			}, function () {
				$(e).removeClass('shadow');
			}
		);
	});
}

function initMap() {
	var uluru = {lat: 51.461311, lng: -0.303742};
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 10,
		center: uluru,
		scrollwheel: false
	});
	var image = '/assets/images/gm_marker.png';
	var marker = new google.maps.Marker({
		position: uluru,
		map: map,
		animation: google.maps.Animation.DROP,
		icon: image
	});
};

function initAnchor() {
	// init controller
	var controller = new ScrollMagic.Controller();

	var tween = TweenMax.from("#skillsTitle", 0.5, {autoAlpha: 0, scale: 0.7});
	var scene = new ScrollMagic.Scene({triggerElement: "a#skills", duration: 400, triggerHook: "onEnter"})
					.setTween(tween)
					.addIndicators() // add indicators (requires plugin)
					.addTo(controller);

	var tween = TweenMax.from("#hiremeTitle", 0.5, {autoAlpha: 0, scale: 0.7});
	var scene = new ScrollMagic.Scene({triggerElement: "a#hireme", duration: 400, triggerHook: "onEnter"})
					.setTween(tween)
					.addIndicators() // add indicators (requires plugin)
					.addTo(controller);

	var tween = TweenMax.from("#blogTitle", 0.5, {autoAlpha: 0, scale: 0.7});
	var scene = new ScrollMagic.Scene({triggerElement: "a#blog", duration: 400, triggerHook: "onEnter"})
					.setTween(tween)
					.addIndicators() // add indicators (requires plugin)
					.addTo(controller);

	// change behaviour of controller to animate scroll instead of jump
	controller.scrollTo( function (newpos) {
		TweenMax.to(window, 0.5, {scrollTo: {y: newpos}});
	});

	//  bind scroll to anchor links
	$(document).on("click", "a[href^='#']", function (e) {
		var id = $(this).attr("href");
		if ($(id).length > 0) {
			e.preventDefault();

			// trigger scroll
			controller.scrollTo(id);

			// if supported by the browser we can even update the URL.
			// if (window.history && window.history.pushState) {
			// 	history.pushState("", document.title, id);
			// }
		}
	});
}

$( document ).ready(function() {
	// Initialise ScrollMagic nice anchor jumps
	initAnchor();

	// Initialise Instagram
	initInstagram();

	// Initialise Skills
	initSkills();

	// Initialise Slick (testimonials slider)
	initSlick();

	// Initialise masonry
	initMasonry();
});
