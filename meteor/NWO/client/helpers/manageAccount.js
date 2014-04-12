// create function to parse user domain name

var myTeam=Meteor.subscribe('colleagues');
var myInvites=Meteor.subscribe('invited');

var toggleAutoAccept=function() {
	if (Accounts.loginServicesConfigured()) {
		var myID=Meteor.userId();
		if (myID)
			if (Meteor.user().includeDomain)
				Meteor.users.update({_id: myID}, {$set: {includeDomain: false}})  // not working
			else Meteor.users.update({_id: myID},{$set: {includeDomain: true}});
				
		}
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
				return Meteor.users.find({invitations: {$in: [myID]}}).fetch();  
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
				return collegue.emails[0].address;
			}}
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
  }


})