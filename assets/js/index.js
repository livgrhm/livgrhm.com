$( document ).ready(function() {
	var feed = new Instafeed({
		get: 'user',
		userId: 3953160061,
		accessToken: '3953160061.5e270e0.e387c4bf0e3041e4a20e2059e379fe40',
		target: 'instafeed',
		resolution: 'standard_resolution',
		after: function() {

		}
	});
	feed.run();
});
