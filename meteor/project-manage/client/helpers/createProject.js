Projects=new Meteor.Collection('projects');

var projectSubscription=Meteor.subscribe('myProjects');
var myTeam=Meteor.subscribe('colleagues');

var toggleAdmin=function(myRecord) {
	if (Accounts.loginServicesConfigured())
		if (myRecord)  // if passed a good record and the user database is up to date
		{
		myRecord=String(myRecord);
		var currentProject=Session.get("currentProject");
		if (Meteor.userId() && currentProject)
			{
			var currProject=Projects.findOne(currentProject);
			if (currProject)
				{
				if (currProject.projectAdministrators.indexOf(Meteor.userId()) > -1)  //check that user had admin access
					if (currProject.projectAdministrators.indexOf(myRecord) === -1)  // if the record is currently not an admin
						Projects.update({_id:currentProject},{$push:{projectAdministrators: myRecord}});
					else 
					{
					if (currProject.projectAdministrators.length>1)  // cannot deactivate only remaining admin
							{
							if (myRecord === Meteor.userId())  // if I am deactivating my own admin access, confirm it
								$('#checkAdminDelete').modal();
							else Projects.update({_id:currentProject},{$pull:{projectAdministrators: myRecord}});
							}
					else $('#needOneAdmin').modal();
					}
				}			
			}
		}
}

var toggleEditor=function(myRecord) {
	if (Accounts.loginServicesConfigured())
		if (myRecord)  // if passed a good record and the user database is up to date
		{
		myRecord=String(myRecord);
		var currentProject=Session.get("currentProject");
		if (Meteor.userId() && currentProject)
			{
			var currProject=Projects.findOne(currentProject);
			if (currProject)
				{
				if (currProject.projectAdministrators.indexOf(Meteor.userId()) > -1)  //check that user had admin access
					if (currProject.projectEditors.indexOf(myRecord) === -1)  // if the record is currently not an editor
						Projects.update({_id:currentProject},{$push:{projectEditors: myRecord}});
					else Projects.update({_id:currentProject},{$pull:{projectEditors: myRecord}});
				}			
			}
		}
}

var toggleDownload=function(myRecord) {
	if (Accounts.loginServicesConfigured())
		if (myRecord)  // if passed a good record and the user database is up to date
		{
		myRecord=String(myRecord);
		var currentProject=Session.get("currentProject");
		if (Meteor.userId() && currentProject)
			{
			var currProject=Projects.findOne(currentProject);
			if (currProject)
				{
				if (currProject.projectAdministrators.indexOf(Meteor.userId()) > -1)  //check that user had admin access
					if (currProject.projectDownload.indexOf(myRecord) === -1)  // if the record is currently not an editor
						Projects.update({_id:currentProject},{$push:{projectDownload: myRecord}});
					else Projects.update({_id:currentProject},{$pull:{projectDownload: myRecord}});
				}			
			}
		}
}

var togglePrint=function(myRecord) {
	if (Accounts.loginServicesConfigured())
		if (myRecord)  // if passed a good record and the user database is up to date
		{
		myRecord=String(myRecord);
		var currentProject=Session.get("currentProject");
		if (Meteor.userId() && currentProject)
			{
			var currProject=Projects.findOne(currentProject);
			if (currProject)
				{
				if (currProject.projectAdministrators.indexOf(Meteor.userId()) > -1)  //check that user had admin access
					if (currProject.projectPrint.indexOf(myRecord) === -1)  // if the record is currently not an editor
						Projects.update({_id:currentProject},{$push:{projectPrint: myRecord}});
					else Projects.update({_id:currentProject},{$pull:{projectPrint: myRecord}});
				}			
			}
		}
}

var toggleView=function(myRecord) {
	if (Accounts.loginServicesConfigured())
		if (myRecord)  // if passed a good record and the user database is up to date
		{
		myRecord=String(myRecord);
		var currentProject=Session.get("currentProject");
		if (Meteor.userId() && currentProject)
			{
			var currProject=Projects.findOne(currentProject);
			if (currProject)
				if (!(currProject.publicProject))
				{
				if (currProject.projectAdministrators.indexOf(Meteor.userId()) > -1)  //check that user had admin access
					if (currProject.projectView.indexOf(myRecord) === -1)  // if the record is currently not an editor
						Projects.update({_id:currentProject},{$push:{projectView: myRecord}});
					else if (!(currProject.publicProject))
						Projects.update({_id:currentProject},{$pull:{projectView: myRecord}});
				}			
			}
		}
}

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
	isNotPublic2: function() {
		return (!(this.publicProject));
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
			return "btn-default";
		}
		else
		{
			var currProjectObject=Projects.findOne(currProject);
			if (currProjectObject.projectAdministrators.indexOf(String(self)) === -1) // is not an administrator
				return "btn-default";
			else
				return "btn-success";
		}
	},	
	canEdit: function() {
		var self=this;
		var currProject=Session.get("currentProject");
		if (!(currProject))
		{
			return "btn-default";
		}
		else
		{
			var currProjectObject=Projects.findOne(currProject);
			if (currProjectObject.projectEditors.indexOf(String(self)) === -1) 
				return "btn-default";
			else
				return "btn-success";
		}
	},	
	canDownload: function() {
		var self=this;
		var currProject=Session.get("currentProject");
		if (!(currProject))
		{
			return "btn-default";
		}
		else 
		{
			var currProjectObject=Projects.findOne(currProject);
			if (currProjectObject.publicProject){
				if (currProjectObject.projectDownload.indexOf(String(self)) === -1) 
					Projects.update({_id:currProject},{$push:{projectDownload: String(self)}});
				return "btn-success disabled";
			}
			else {
				if (currProjectObject.projectDownload.indexOf(String(self)) === -1) 
					return "btn-default";
				else
					return "btn-success";
			}
		}
	},
	canPrint: function() {
		var self=this;
		var currProject=Session.get("currentProject");
		if (!(currProject))
		{
			return "btn-default";
		}
		else
		{
			var currProjectObject=Projects.findOne(currProject);
			if (currProjectObject.publicProject){
				if (currProjectObject.projectPrint.indexOf(String(self)) === -1) 
					Projects.update({_id:currProject},{$push:{projectPrint: String(self)}});
				return "btn-success disabled";
			}
			else {
				if (currProjectObject.projectPrint.indexOf(String(self)) === -1) 
					return "btn-default";
				else
					return "btn-success";
			}
		}
	},
	canView: function() {
		var self=this;
		var currProject=Session.get("currentProject");
		if (!(currProject))
		{
			return "btn-default";
		}
		else
		{
			var currProjectObject=Projects.findOne(currProject);
			if (currProjectObject.publicProject){
				if (currProjectObject.projectView.indexOf(String(self)) === -1) 
					Projects.update({_id:currProject},{$push:{projectView: String(self)}});
				return "btn-success disabled";
			}
			else {
				if (currProjectObject.projectView.indexOf(String(self)) === -1) 
					return "btn-default";
				else
					return "btn-success";
			}
		}
	},
	isProjectLoaded: function () {
		return (projectSubscription.ready());
	},	
	colleague: function() {
		if (Accounts.loginServicesConfigured()) {
			var myID=Meteor.userId();
			if (myID) {
				var colleagues=Meteor.user().colleagues;	//update to remove those already in the project!
				var retval=_.difference(colleagues, Projects.findOne(Session.get('currentProject')).projectMembers);
				return retval;
			}
		} else return null;
	},
	nameOrEmail: function () {
		if (myTeam.ready()) {
			var self=this;
			if (self) { 
			var colleague=Meteor.users.findOne({_id:String(self)});
			if (colleague.username)
				return colleague.username;
			else if (colleague.emails.count()>0)
				return colleague.emails[0].address;
			}}
		return null;
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

  'click .Admin': function() {
  	return toggleAdmin(this);
  },

  'click .Editor': function() {
  	return toggleEditor(this);
  }, 

  'click .Download': function() {
  	return toggleDownload(this);
  },

  'click .Print': function() {
  	return togglePrint(this);
  },

 'click .Viewer': function() {
  	return toggleView(this);
  },
  'click #confirmDelete': function() {
  		Projects.update({_id:Session.get("currentProject")},{$pull:{projectAdministrators: Meteor.userId()}});
  },

  'click .btn-add-to-project': function() {
  		if (this)
  		{
  			var self=String(this);
  			if (self === "")	
  				return;
  			else Projects.update({_id:Session.get("currentProject")},{$push:{projectMembers: self}});
  		}
  }
})

