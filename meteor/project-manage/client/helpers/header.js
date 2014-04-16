Template.header.helpers ({
	anyProjects: function() {
		if (Accounts.loginServicesConfigured())
		{

			if(Meteor.user() && Meteor.user().projectsVisited)
				var retval= Meteor.user().projectsVisited;

				return retval;
		}
		else return null;
	},
	retrieveProject: function() {
		if (this.projectID)
		{	

			var namedProject=Projects.findOne(this.projectID);

			if ((namedProject) && (namedProject.projectName))
				return namedProject.projectName;
		}
		return "";
	}
})