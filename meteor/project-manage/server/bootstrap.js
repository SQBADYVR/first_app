var adminId;
Projects = new Meteor.Collection('projects');

Meteor.publish('myProjects' ,function() {
    var myID=this.userId;
    return Projects.find({projectMembers: myID});  // narrow this down later
  });


Projects.allow({
  update: function(userId, doc, fields, modifier){
    console.log(userId);
    console.log(doc);
    console.log(fields);
    console.log(modifier);
    return (doc.projectEditors.indexOf(userId)>-1);
  },
  insert: function(userId, doc) {
    if (doc.projectEditors)
    return (doc.projectEditors.indexOf(userId)>-1);
  }

})

makeid = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

Meteor.startup(function() {
	Accounts.onCreateUser(function(options,user){
		// We still want the default hook's 'profile' behavior.
  		if (options.profile)
    		user.profile = options.profile;
    	user.colleagues=[];
    	user.invitations=[];  // invitations I've sent
    	user.includeDomain=false;
  		return user;
	});
	// create an admin user if they don't already exist

	if (Meteor.users.find({username: 'admin'}).count() < 1) {
		adminId=Accounts.createUser({
			'username': 'admin',
			'email': 'admin@test.com',
			'emails': ['admin@test.com'],
			'password': 'admin'
		});
	}
	
	// add a bunch of users
	if (Meteor.users.find().count() < 10) {
		for (var i = 100 - 1; i >= 0; i--) {
			var email = makeid() + '@test.com';
			var profileOptions = {
				'username': email,
				'email': email,
				'emails': [email],
				'password': 'password'
			};
			var tempID = Accounts.createUser(profileOptions);
			Meteor.users.update({username:"admin"},{$push:{"colleagues":tempID}});
			Meteor.users.update({_id: tempID},{$push:{"colleagues":adminId}});
		}
	}	
});

Meteor.publish('colleagues', function() {
	if (this.userId) {
		return Meteor.users.find({$or: [{_id: this.userId},{colleagues: {$all: [this.userId]}}]},{fields: {'_id': true, 'username': true, 'email': true, 'emails': true, 'colleagues': true, 'invitations':true}})
	} else this.ready();
});

Meteor.publish('self', function () {
	if (this.userId)
		return Meteor.users.find({_id: this.userId}, {fields: {'_id': true, 'username': true, 'email': true, 'emails': true, 'colleagues': true, 'includeDomain': true, 'invitations':true, 'profile': true}})
})

Meteor.publish('invited', function() {
	if (this.userId) {
		var myID=Meteor.users.findOne(this.userId);
		if (myID){
		return Meteor.users.find({invitations: {$in: [myID.username, myID.emails[0].address]}},{fields: {'_id':true, 'username':true, 'email':true, 'emails':true, 'invitations': true}})
		}	
	}
	else this.ready();
});





Meteor.users.allow({
  update: function (userId, doc, fields, modifier) {
  	if ((doc._id ===userId) && (fields.indexOf("includeDomain") > -1) && (fields.length === 1))
    	return true;
    if ((doc._id ===userId) && (fields.indexOf("colleagues") > -1) && (fields.length === 1))
    	if ((modifier.$push) || (modifier.$pull))
    		return true;
    if ((fields.indexOf("colleagues") > -1) && (fields.length === 1))
    	if (((modifier.$push) && (modifier.$push.colleagues === userId)) || ((modifier.$pull) && (modifier.$pull.colleagues === userId)))
    		return true;
    if ((doc._id ===userId) && (fields.indexOf("invitations") > -1) && (fields.length === 1))
    	if ((modifier.$push) || (modifier.$pull))
    		return true;
    if ((fields.indexOf("invitations") > -1) && (fields.length === 1))  //if we're dealing with invitations
    	{
    	var myRecord=Meteor.users.findOne(userId);

    	if ((doc.invitations) && (doc.invitations.indexOf(myRecord.username) > -1))  // and the person has invited me.  == may need to
    																		// update for username and email rather than _id
    	{
    		if ((modifier.$pull) && (modifier.$pull.invitations === myRecord.username))  // we're removing my name from invitations
    		{
    			return true;
    		}
    		else return false;
    	}
    	else if (myRecord.emails.length>0)
    		if (myRecord.emails[0].address)
    		{
    			if ((doc.invitations) && (doc.invitations.indexOf(myRecord.emails[0].address) > -1)) 
    				if ((modifier.$pull) && (modifier.$pull.invitations === myRecord.emails[0].address))
    					return true;

    		}

    }
    if ((fields.indexOf("colleagues") > -1) && (fields.length === 1))  //if we're dealing with a user who has invited me to be a colleague
    	if ((doc.invitations) && (doc.invitations.indexOf(userId) > -1))  // and the person has invited me.  == may need to
    																		// update for username and email rather than _id
    		if ((modifier.$push) && (modifier.$push.colleagues === userId))  // we're adding me to colleagues.
    			return true;
    return false;
  },
  remove: function (userId, doc) {
    // can only remove your own documents
//    return doc.owner === userId;
	return false;
  },
 //fetch: ['owner']
});

// In your server code: define a method that the client can call
Meteor.methods({
  sendEmail: function (to, from, subject, text) {
    check([to, from, subject, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });
  },
  inviteNewUser: function (invitor, invitee) {

  	if (invitee)
  	{
  	var checkEmail=invitee.indexOf('@');

  	if (checkEmail>=0)
  		{
  		//it's an email address
  		var ExistingUser=Meteor.users.findOne({emails: {address: invitee}});
 
  		if (!ExistingUser) // if not a user in the database
  			{
  			var me=Meteor.users.findOne(invitor);

  			var invitorEmail=me.emails[0].address;

  			//send an invite to join cloudDesign
  			subjectString="Your colleague, "+invitorEmail+", would like you to join his team on designCloud."

  			textString="designCloud is a revolutionary suite of tools for teams to manage product design information in the cloud.\n\n";
  			textString=textString + "Your colleague at "+invitorEmail+" is using it and wants you to join the team.\n\n.";
  			textString=textString + "Click the link below to sign up for free.\n\n";

  			Meteor.call('sendEmail', invitee, invitorEmail, subjectString, textString);
  			}
  		}
  	else
  		//it's a user name
  	{
  		return;
  	}
  }
}});
