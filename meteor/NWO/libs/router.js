Router.map(function() {
	this.route('home', {
		path: '/',
		onBeforeAction: function() {
			Router.go('/manageAccount');
		}
		});

	this.route('manageAccount',{
		path: '/manageAccount',
		layoutTemplate: 'layout'
	})
});