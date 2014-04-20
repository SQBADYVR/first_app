Router.map(function() {
	this.route('home', {
		path: '/',
		template: 'main',
		layoutTemplate: 'layout'
		});

	this.route('loginAlert', {
		path: '/login',
		template: 'login',
		layoutTemplate: 'layout',
    	onBeforeAction: function() {
    		Session.set("moduleName","");
    	}
	}	);

	this.route('manageAccount',{
		path: '/manageAccount',
		layoutTemplate: 'layout',
		waitOn: function () {
    		if (!(Meteor.user()))
    		{
    		console.log("bounced");
    		Router.go('loginAlert');	//reroute to login screen
    		}
			return [Meteor.subscribe('teammates') && Accounts.loginServicesConfigured()];
		},
		onBeforeAction: function() {
			Session.set("moduleName","Account Manager");
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
			Session.set("moduleName","Project Manager")
    		console.log("bounced");
    		Router.go('loginAlert');	//reroute to login screen
    		}
    	}
	})

	this.route('editDFMEA', {
		path: '/editDFMEA/:id',
		layoutTemplate: 'layout',
		template: 'dfmea',
		onBeforeAction: function() {
 			if(!(Meteor.user()))
 				{Router.go('loginAlert');
 					}
 			else
 			{
 			Session.set("moduleName","cDFMEA&#8482;")
 			Session.set("currentDFMEA",this.params._id);
 			}
 		}
	})

	this.route('editDFMEA', {
		path: '/editDFMEA',
		layoutTemplate: 'layout',
		template: 'dfmea',
		onBeforeAction: function() {
 			if(!(Meteor.user()))
 				{
 				Router.go('loginAlert');
 				}
 			else
 			{
 			Session.set("moduleName","cDFMEA&#8482;")
 			}			
 		}
	})

	this.route('manageProjects', {
	    path: '/manageProjects/:_id',
 		layoutTemplate: 'layout',
 		template: 'manageProject',
 		onBeforeAction: function() {
 			if(!(Meteor.user()))
 				{Router.go('loginAlert');}
 			else
 			{
			Session.set("moduleName","Project Manager")
			Session.set("currentProject",this.params._id);
 			}
 		}
  	});
});
