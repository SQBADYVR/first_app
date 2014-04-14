Projects=new Meteor.Collection('projects');

projectSubscription=Meteor.subscribe('myProjects');



Template.manageProject.helpers ({
	projectMembers: function() {
		return this.projectMembers;
	},
	projectMember: function() {
		return this;
	},
	isPublic: function() {
		if (this.publicProject)
		{
			return "active";
		}
		else
			return "";
	},
	isNotPublic: function() {
		if (this.publicProject)
			return "";
		else
			return "active";
	},
	debug: function() {
		return true;
	},
	email: function () {
		var temp=this;
		var userDude=Meteor.users.findOne(String(temp));

		if (userDude)
		{
			if (!userDude.username)
			{
				return userDude.emails[0].address;
			}
			else {
				return  userDude.username;
			}
		}
		return null;
	},
	isAdmin: function() {
		var self=this;
		var currProject=Session.get("currentProject");
		if (!(currProject))
		{
			return "";
		}
		else
		{
			var currProjectObject=Projects.findOne(currProject);
			if (currProjectObject.projectAdministrators.indexOf(String(self)) === -1) // is not an administrator
				return "";
			else
				return "Admin";
		}
	},	
	canEdit: function() {
		var self=this;
		var currProject=Session.get("currentProject");
		if (!(currProject))
		{
			return "";
		}
		else
		{
			var currProjectObject=Projects.findOne(currProject);
			if (currProjectObject.projectEditors.indexOf(String(self)) === -1) // is not an administrator
				return "";
			else
				return "Editor";
		}
	},	
	canDownload: function() {
		var self=this;
		var currProject=Session.get("currentProject");
		if (!(currProject))
		{
			return "";
		}
		else
		{
			var currProjectObject=Projects.findOne(currProject);
			if (currProjectObject.projectDownload.indexOf(String(self)) === -1) // is not an administrator
				return "";
			else
				return "canDownload";
		}
	},
	canPrint: function() {
		var self=this;
		var currProject=Session.get("currentProject");
		if (!(currProject))
		{
			return "";
		}
		else
		{
			var currProjectObject=Projects.findOne(currProject);
			if (currProjectObject.projectPrint.indexOf(String(self)) === -1) // is not an administrator
				return "";
			else
				return "canPrint";
		}
	},
	canView: function() {
		var self=this;
		var currProject=Session.get("currentProject");
		if (!(currProject))
		{
			return "";
		}
		else
		{
			var currProjectObject=Projects.findOne(currProject);
			if (currProjectObject.projectView.indexOf(String(self)) === -1) // is not an administrator
				return "";
			else
				return "canView";
		}
	},
	isProjectLoaded: function () {
		return (projectSubscription.ready());
	},
	enterManageProject: function() {
		//assumes called with the session variable currentProject set to the current project id.  
		//if set to null, create a new project.
		var currProject = Session.get("currentProject");
		if (!(currProject))
				{
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
			currProject=newProject;
			Session.set("currentProject",currProject);
			}
		return Projects.findOne(currProject);
	}
})

var okCancelEvents = function (selector, callbacks) {
  var ok = callbacks.ok || function () {};
  var cancel = callbacks.cancel || function () {};
  var events = {};
  events['keyup '+selector+', keydown '+selector+', focusout '+selector] =
    function (evt) {
      if (evt.type === "keydown" && evt.which === 27) {
        // escape = cancel
        cancel.call(this, evt);

      } else if (evt.type === "keyup" && evt.which === 13 ||
                 evt.type === "focusout") {
        // blur/return/enter = ok/submit if non-empty
        var value = String(evt.target.value || "");
        if (value)
          ok.call(this, value, evt);
        else
          cancel.call(this, evt);
      }
    };

  return events;
};

var activateInput = function (input) {
  input.focus();
  input.select();
};


Template.manageProject.events ({
  
  'click .destroy': function () {
    return null;
  },

  'dblclick .display': function (evt, tmpl) {
    Session.set('editing_itemname', this[0]);
    Deps.flush(); // update DOM before focus
    activateInput(tmpl.find("#item-input"));
  },


})