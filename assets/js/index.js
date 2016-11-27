function initMap() {
	console.log('init map');
	var uluru = {lat: 51.461311, lng: -0.303742};
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 4,
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

$( document ).ready(function() {
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

	$('.skills-item').each( function (i, e) {
		$(e).hover(
			function () {
				$(e).find('.skills-hover').css('display', 'block');
			}, function () {
				$(e).find('.skills-hover').css('display', 'none');
			}
		);
	});

	$('.testimonials').slick({
	    autoplay: true,
		autoplaySpeed: 5000,
		arrows: false//,
		// dots: true
	});
});
