Template.header.helpers ({
	anyProjects: function() {
		if (Accounts.loginServicesConfigured())
		{
			console.log("in anyProjects");
			if(Meteor.user() && Meteor.user().projectsVisited)
				var retval= Meteor.user().projectsVisited;
				console.log(retval);
				return retval;
		}
		else return null;
	},
	retrieveProject: function() {
		if (this.projectID)
		{	
			console.log("in retrieveProject");
			console.log(this);
			console.log(this.projectID);
			var namedProject=Projects.findOne(this.projectID);
			console.log(namedProject);
			if ((namedProject) && (namedProject.projectName))
				return namedProject.projectName;
		}
		return "";
	}
})