DFMEAs= new Meteor.Collection("dfmeas");
Nodes = new Meteor.Collection("nodes");

// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  var dfmea_id;
  if (DFMEAs.find().count() === 0) {
    var timestamp = (new Date()).getTime();
    dfmea_id=DFMEAs.insert({
        name: "Test FMEA 1",
        header:[],
        project: null, 
        created: {"userid":timestamp},
        revised: {"userid":timestamp},
        subcategories: []
    }
  );
    timestamp += 1; // ensure unique timestamp.
  }

  

//  Nodes contains the tree that makes up all the stuff under the FMEA title.
//  DFMEAs is the list of DFMEAs
//  Nodes data structure (revised 3/30/2014)
//    categoryName:  string of one of the below:
//                    "RootNode"
//                    "DesignFunction"
//                    "FailureMode"
//                    "FailureEffect"
//                    "FailureCause"
// 
//    parent: string
//                    this is the database id for the parent in the tree
//    children:  array of strings
//                    is null if the node is a leaf
//                    otherwise has the ids of the children
//    content:  string containing what is visible on the DFMEA
//    SEV;
//    OCC:
//    DET:
//    DesignControl:
//    Class:
//    timestamp:      number
//    sortorder:  number
//    
//
//  DFMEAS data structure
//    project:      string with the ID of the project this belongs to
//    permissions:  array of {userid: permission} items to tell what permissions the user has in the DFMEA
//                    allowable permissions are:  NULL, view, print, edit, admin
//    name:        string with a text identified for this
//    FMEA:         id of the root of the tree describing the FMEA data
//    header:       array of {fieldName:content}  entries describing the header for the FMEA
//    created:      {userid: timestamp} telling who created the FMEA
//    revised:       array of {userid: timestamp} telling who saved edits to the FMEA
  

  if (Nodes.find().count() === 0) {// populate with some data
    console.log("populating Nodes");
      var topNode=Nodes.insert({
       categoryName: "RootNode",
        parentCategory: dfmea_id,
        subcategories: [],
        content: "Root of this DFMEA body",
        timestamp: timestamp,
        sortOrder: 1
     });
    DFMEAs.update({_id: dfmea_id}, {$push: {subcategories: topNode}});
    timestamp+=1;
     for ( i = 0; i < Math.floor(Math.random() * 2) + 2; i++) {
      // Insert the functions
      var fctn_id = Nodes.insert({
        categoryName: "DesignFunction",
        parentCategory: topNode,
        subcategories: [],
        content: "Design Function " + i,
        timestamp: timestamp,
        sortOrder: (i+1)*10000
      });
      timestamp+=1;
      Nodes.update({_id: topNode}, {$push: {subcategories: fctn_id}});
      for ( j = 0; j < Math.floor(Math.random() * 3) + 1; j++) {
        var fmode_id = Nodes.insert({
          categoryName: "FailureMode",
          parentCategory: fctn_id,
          subcategories: [],
          content: "Doesn't work " + j,
          timestamp: timestamp,
          sortOrder: (j+1)*10000
        });
        timestamp+=1;
        Nodes.update({_id: fctn_id}, {$push: {subcategories: fmode_id}});
        for ( k = 0; k < Math.floor(Math.random() * 5) + 1; k++) {
          var effects_id = Nodes.insert({
            categoryName: "FailureEffect",
            parentCategory: fmode_id,
            subcategories: [],
            content: "Everyone dies " + k,
            timestamp: timestamp,
            sortOrder: (k+1)*10000,
            SEV:  (Math.floor(Math.random()*10+1)),
            Class: ""
          });
          timestamp+=1;
          Nodes.update({_id: fmode_id}, {$push: {subcategories: effects_id}});
          for (l = 0; l < Math.floor(Math.random() * 5) + 1; l++) {
            var cause_id = Nodes.insert({
              categoryName: "FailureCause",
              parentCategory: effects_id,
              subcategories: [],
              content: "Something broke " + l,
              timestamp: timestamp,
              sortOrder: (l+1)*10000,
              OCC:  (Math.floor(Math.random()*10+1)),
              DesignControl: "Test regimen that has a long list of tests "+l,
              DET:  (Math.floor(Math.random()*10+1))
            });
            timestamp+=1;   
            Nodes.update({_id: effects_id}, {$push: {subcategories: cause_id }});       
            };
          };
        };
      };
  }

  Nodes.allow(
  {
  insert: function (userId, doc) {
    // the user must be logged in, and the document must be owned by the user
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    // can only change your own documents
    return true;
  },
  remove: function (userId, doc) {
    // can only remove your own documents
    return true;
  }
});
});
