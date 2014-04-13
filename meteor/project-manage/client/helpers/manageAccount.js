// create function to parse user domain name

Meteor.subscribe('teammates')

var toggleAutoAccept=function() {
	if (Accounts.loginServicesConfigured()) {
		var myID=Meteor.userId;
		if (myID)
			if (Meteor.user().includeDomain)
				Meteor.users.update({_id: myID}, {$set: {includeDomain: false}})  // not working
			else Meteor.users.update({_id: myID},{$set: {includeDomain: true}});
				
		}
}

Template.manageAccount.helpers ({
	name: function() {
		if (Accounts.loginServicesConfigured()) {
			var myID=Meteor.userId;
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
			var myID=Meteor.userId;
			if (myID)
		 		 if (Meteor.user().emails.length>0)
			 	 return Meteor.user().emails[0].address;
			}
		return null;
	},
	autoAcceptInvite: function() {
		if (Accounts.loginServicesConfigured()) {
			var myID=Meteor.userId;
			if (myID)
		 		 if (Meteor.user().includeDomain)
			 	 return "checked";
			 }
		return "";
	},
	nameOrEmail: function ()
	{return null;}  //write this function

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