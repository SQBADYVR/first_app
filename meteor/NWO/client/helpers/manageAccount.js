// create function to parse user domain name

var myTeam=Meteor.subscribe('colleagues');
var myInvites=Meteor.subscribe('invited');
var mySelf=Meteor.subscribe('self');

var toggleAutoAccept=function() {
	if (Accounts.loginServicesConfigured()) {
		var myID=Meteor.userId();
		if (myID)
			if (Meteor.user().includeDomain)
				Meteor.users.update({_id: myID}, {$set: {includeDomain: false}})  // not working
			else Meteor.users.update({_id: myID},{$set: {includeDomain: true}});
				
		}
	return null;
}

Template.manageAccount.helpers ({
	name: function() {
		if (Accounts.loginServicesConfigured()) {
			var myID=Meteor.userId();
			if (myID)
		  		if (Meteor.user().username)
					return Meteor.user().username;
				else if(Meteor.user().emails.length>0)
					return Meteor.user().emails[0].address;
		}
		return null;
	},
	email: function() {
		if (Accounts.loginServicesConfigured()) {
			var myID=Meteor.userId();
			if (myID)
		 		 if (Meteor.user().emails.length>0)
			 	 return Meteor.user().emails[0].address;
			}
		return null;
	},
	autoAcceptInvite: function() {
		if (Accounts.loginServicesConfigured()) {
			var myID=Meteor.userId();
			if (myID){
		 		 if (Meteor.user().includeDomain)
			 	 return "checked";
			 }
		}
		return "";
	},
	colleague: function() {
		if (Accounts.loginServicesConfigured()) {
			var myID=Meteor.userId();
			if (myID) {
				return Meteor.user().colleagues;
			}
		} else return null;
	},
	invitedUser: function () {
		if (Accounts.loginServicesConfigured()) {
			var myID=Meteor.userId();
			if (myID) {
				var retval= Meteor.users.find({invitations: {$in: [String(myID)]}}).fetch();  //fix to reflect username or email rather than ID
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
	invitedMeNameOrEmail: function() {
		var self=this;
		if (self) {
			if (self.username)
				return self.username;
			else if (self.emails.count()>0)
				return self.emails[0].address;
		}
		return null;
	},
	usersIveInvited: function() {
		if (Accounts.loginServicesConfigured()) {
			var myID=Meteor.userId();
			if (myID) {
				var retval= Meteor.user().invitations;
				return retval;
			}
		} 
		return null;
	},
	listInvited: function() {
		return this;
	},
	myDomainName: function() {
		if (Accounts.loginServicesConfigured()) {
			var myID=Meteor.userId();
			if (myID)
		 		 if (Meteor.user().emails.length>0) {
			 	 var domainName=Meteor.user().emails[0].address;
			 	 var retval=domainName.substr(domainName.indexOf('@')+1);
			 	 return retval;
			}
		}
		return null;
	}
});

var activateInput = function (input) {
  input.focus();
  input.select();
};

Template.manageAccount.events ({
 'click #autoAcceptInvite': function () {
    toggleAutoAccept();
    //  add in function to clear invitees to colleagues if domain names match.
  },

  'click .btn-remove-colleague' : function () {
  	console.log("Clickedit");
  }


})