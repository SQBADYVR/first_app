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
   	   	return [Meteor.subscribe('projects') && Accounts.loginServicesConfigured()];
    	},
		onBeforeAction: function() {
			var newProject=null;
			var currProject = Session.get('currentProject');
			if ((currProject === null) || (currProject === undefined))
				{
				console.log("in router");
				newProject=Projects.insert(
					{
					projectName: "New Project",
					publicProject: true,
					projectMembers: [Meteor.userId()],
					projectAdministrators: [Meteor.userId()],
					projectEditors: [Meteor.userId()],
					projectDownload: [Meteor.userId()],
					projectPrint: [Meteor.userId()],
					projectView: [Meteor.userId()],
					DFMEAlinks:[],
					PFMEAlinks:[],
					DVPRlinks:[],
					RequirementsLink:[],
					ControlPlanLinks:[],
					PVPRlinks:[]
					});
				Session.set("currentProject",newProject);
				return newProject;
				}
			else
			{
				return currProject;
			}
		}
	});

	this.route('editDFMEA', {
		path: '/editDFMEA',
		layoutTemplate: 'layout'
	});
});