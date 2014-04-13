Router.map(function() {
	this.route('home', {
		path: '/',
		template: 'main',
		layoutTemplate: 'layout'
		});

	this.route('manageAccount',{
		path: '/manageAccount',
		layoutTemplate: 'layout',
		waitOn: function () {
			return [Meteor.subscribe('teammates') && Accounts.loginServicesConfigured()];
		},
		onBeforeAction: function() {
			console.log('in router');
		}
	})

	this.route('manageProjects', {
		path:'/manageProjects',
		template: 'manageProject',
		layoutTemplate: 'layout',
		waitOn: function () {  // wait for the subscription to be ready; see below
   	   		return [Accounts.loginServicesConfigured()]},
    	onBeforeAction: function() {
    		if (!(Meteor.user()))
    		{
    		console.log("bounced");
    		Router.go('home');	//reroute to login screen
    		}
    	}
	})

	this.route('editDFMEA', {
		path: '/editDFMEA',
		layoutTemplate: 'layout'
	})
});