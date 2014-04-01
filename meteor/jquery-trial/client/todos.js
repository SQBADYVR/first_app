DFMEAs= new Meteor.Collection('dfmeas');
Nodes=new Meteor.Collection('nodes');
Session.set('dfmea_id',null);
  // Client-side JavaScript, bundled and sent to client.

Session.set('dfmea_id',null);

// ID of currently selected list
Session.setDefault('dfmea_id', null);

// Name of currently selected tag for filtering
Session.setDefault('tag_filter', null);

// When adding tag to a node, ID of the node
Session.setDefault('editing_addtag', null);

// When editing a list name, ID of the list
Session.setDefault('editing_listname', null);

// When editing node text, ID of the node
Session.setDefault('editing_itemname', null);

// Subscribe to 'lists' collection on startup.
//var dfmea_id=DFMEAs.find({name: "Test FMEA 1"});
//console.log(dfmea_id);
//Session.set("dfmea_id",dfmea_id);

// Select a list once data has arrived.

// Define Minimongo collections to match server/publish.js.
//Lists = new Meteor.Collection("lists");

// as "ok" or "cancel".
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

// Select a list once data has arrived.
var dfmeaHandle = Meteor.subscribe('dfmeas', function () {
  if (!Session.get('dfmea_id')) {
    var dfmea = DFMEAs.findOne({name: "Test FMEA 1"}, {sort: {name: 1}});
    if (dfmea) {
       Router.setList(dfmea._id);
    }
  }
});
// Always be subscribed to the nodes for the selected list.
Deps.autorun(function () {
  var dfmea_id = Session.get('dfmea_id');
  if (dfmea_id)
    {
    nodesHandle = Meteor.subscribe('nodes', dfmea_id);
  }
  else
    nodesHandle = null;
});

Template.lists.loading = function () {
  return !dfmeaHandle.ready();
};

var nodesHandle=null;
Template.mainTable.loading = function () {
  return nodesHandle && !nodesHandle.ready();
};

Template.mainTable.any_list_selected = function () {
  return !Session.equals('dfmea_id', null);
};

Template.nodes.nodes = function () {
  // Determine which nodes to display in main pane,
  // selected based on list_id and tag_filter.
  var parent=null;

  if (!parent) {
    parent = Session.get('dfmea_id');
   }

  //var sel = {ParentCategory: parent};

  //shut down tagging
  //var tag_filter = Session.get('tag_filter');
  //if (tag_filter)
  //  sel.tags = tag_filter;
  var nodelist=Nodes.find({parentCategory: parent});
  return nodelist;
};

////////// Tracking selected list in URL //////////

var nodesRouter = Backbone.Router.extend({
  routes: {
    ":dfmea_id": "main"
  },
  main: function (dfmea_id) {
    var oldList = Session.get("dfmea_id");
    if (oldList !== dfmea_id) {
      Session.set("dfmea_id", dfmea_id);
      Session.set("tag_filter", null);
    }
  },
  setList: function (dfmea_id) {
    this.navigate(dfmea_id, true);
  }
});

Router = new nodesRouter;

Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});

Template.mainTable.helpers({
  rowInsert: function() {
    ;
  },
  DesFctn: function() {
    var dfmeaID=Session.get('dfmea_id');
    console.log(dfmeaID);
    if (!(dfmeaID === undefined) && !(dfmeaID === null)) {
      var parent = Nodes.findOne({parentCategory: dfmeaID});
      console.log(parent);
      console.log(parent._id);
      var retval = Nodes.find({parentCategory: parent._id},{sortOrder:1}).fetch();
      console.log(retval);
      return retval;
    }
  },
  FMode: function() {
    console.log(this);
    var retval=Nodes.find({parentCategory: this._id},{sortOrder:1}).fetch();
    console.log(retval);
    return retval;
  },
  FEffect: function() {
    console.log(this);
    var retval=Nodes.find({parentCategory: this._id},{sortOrder:1}).fetch();
    console.log(retval);
    return retval;
  },
  Cause: function() {
    console.log(this);
    var retval=Nodes.find({parentCategory: this._id},{sortOrder:1}).fetch();
    console.log(retval);
    return retval;
  }
});