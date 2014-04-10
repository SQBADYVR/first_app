Router.map(function() {
	this.route('home', {
		path: '/',
		template: 'main',
		layoutTemplate: 'layout'
		});

	this.route('manageAccount',{
		path: '/manageAccount',
		layoutTemplate: 'layout'
	})
});