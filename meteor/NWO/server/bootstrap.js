var adminId;


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
		return Meteor.users.find({_id: this.userId}, {fields: {'_id': true, 'username': true, 'email': true, 'emails': true, 'colleagues': true, 'includeDomain': true, 'invitations':true}})
})

Meteor.publish('invited', function() {
	if (this.userId) {
		return Meteor.users.find({invitations: {$all: [this.userId]}},{fields: {'_id':true, 'username':true, 'email':true, 'emails':true, 'invitations': true}})
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
    	if ((doc.invitations) && (doc.invitations.indexOf(userId) > -1))  // and the person has invited me.  == may need to
    																		// update for username and email rather than _id
    		if ((modifier.$pull) && (modifier.$pull.invitations === userId))  // we're removing my name from invitations
    			return true;
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
