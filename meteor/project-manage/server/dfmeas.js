DFMEAs=new Meteor.Collection('dfmeas');
Meteor.publish('dfmeas' ,function() {
    return DFMEAs.find();  // narrow this down later
  });

DFMEAs.allow({
  update: function(userId, doc, fields, modifier){
    return true;
  },
  insert: function(userId, doc) {
    return true;
  }

})

var timestamp = (new Date()).getTime();

var FMEA_root = {
	header : {
		number : "FMEA1",
		team : ["User1", "User 2", "User3"],
		title : "DFMEA title",
		creation_date : timestamp,
		revision_date : timestamp,
	},
	nodeKind : "FMEAroot",
	parentcategory : null,
	parentProject: [],
	subcategories : [],
	undoStack: [],
	revision: {major: 0, minor: 1}
	}

Meteor.startup(function() {

	if (DFMEAs.find().count() === 0) {// populate with some data
		var FMEA_id = DFMEAs.insert(FMEA_root);
		for ( i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
			// Insert the functions
			var fctn_id = DFMEAs.insert({
				nodeKind: "designFunction",
				nodeText: "Design Function",
				parentCategory: FMEA_id,
				subcategories: [],
				content: "Design Function" + i,
				parentProject: [],
				rootID: FMEA_id,
				sortOrder: i*1000000000+Math.random()*100000000
			});
			DFMEAs.update({_id: FMEA_id}, {$push: {subcategories: fctn_id}});
			for ( j = 0; j < Math.floor(Math.random() * 3) + 1; j++) {
				var fmode_id = DFMEAs.insert({
					nodeKind: "failureMode",
					nodeText: "Failure Mode",
					parentCategory: fctn_id,
					subcategories: [],
					content: "Doesn't work" + j,
					parentProject:[],
					rootID: FMEA_id,
					sortOrder: i*1000000000+Math.random()*100000000
				});
				DFMEAs.update({_id: fctn_id}, {$push: {subcategories: fmode_id}});
				for ( k = 0; k < Math.floor(Math.random() * 5) + 1; k++) {
					var effects_id = DFMEAs.insert({
						nodeKind: "failureEffects",
						nodeText: "Effect of Failure",
						parentCategory: fmode_id,
						subcategories: [],
						content: "Everyone dies" + k,
						SEV: Math.floor(Math.random() * 10) + 1,
						classification: "YC",
						parentProject:[],
						rootID: FMEA_id,
						sortOrder: i*1000000000+Math.random()*100000000
					});
					DFMEAs.update({_id: fmode_id}, {$push: {subcategories: effects_id}});
					for ( l = 0; l < Math.floor(Math.random() * 5) + 1; l++) {
						var cause_id = DFMEAs.insert({
							nodeKind: "failureCauses",
							nodeText: "Potential Cause",
							parentCategory: effects_id,
							subcategories: [],
							content: "Something broke" + l,
							OCC: Math.floor(Math.random() * 10) + 1,
							designControl: "Test regimen that has a long-ass list of stuff like thermal shock, shake and bake, drop testing, and other stuff",
							DET: Math.floor(Math.random() * 10) + 1,
							parentProject:[],
							rootID: FMEA_id,
							sortOrder: i*1000000000+Math.random()*100000000
						});
						DFMEAs.update({
							_id: effects_id
						}, {
							$push: {subcategories: cause_id}
						});
					};
				};
			};
		}
	}
});