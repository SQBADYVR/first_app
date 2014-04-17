// Need to make help lessons
// Need to fix security for write access to matrix
// Need to fix security for write to remote file
// Need to fix revisioining
// Need to build out the choose DFMEA
// Need to build out nested DFMEA
// Need to build out autogenerating FM

DFMEAs=new Meteor.Collection('dfmeas');
var dfmeaSubscription=Meteor.subscribe('dfmeas');

var stuffArray = function() {
	var i,j,k,l;
	var designFunctionCursor;
	var currentRow=new Array();
	var stuffArray=new Array();
	var rowCount=0;

	currentRow=[];
	if (Session.get('currentDFMEA') && dfmeaSubscription.ready())
	{
		designFunctionCursor=DFMEAs.find({nodeKind: "designFunction"})  // need to make sure it's the right DFMEA
		var currentNode=designFunctionCursor.fetch()
		for (i=0; i<designFunctionCursor.count(); i++) {
			var stuffObj={};
			_.extend(stuffObj,currentNode[i],{rowSpan: 0});
			var DFchildren=currentNode[i].subcategories;
			currentRow.push(stuffObj);
			var failureModeCursor=DFMEAs.find({_id: {$in: DFchildren}});
			var currentNode2=failureModeCursor.fetch();
			for (j=0; j< DFchildren.length; j++){
				var stuffObject={};
				_.extend(stuffObject,currentNode2[j],{rowSpan:0});
				currentRow.push(stuffObject);
				var FMchildren=currentNode2[j].subcategories;
				var failureEffectsCursor=DFMEAs.find({_id: {$in: FMchildren}});
				var currentNode3=failureEffectsCursor.fetch();
				for (k=0; k< FMchildren.length; k++) {
					var stuffObject3={};
					_.extend(stuffObject3,currentNode3[k],{rowSpan:currentNode3[k].subcategories.length});
					currentRow.push(stuffObject3);
					var FEchildren=currentNode3[k].subcategories;
					var failureCauseCursor=DFMEAs.find({_id: {$in: FEchildren}});
					var currentNode4=failureCauseCursor.fetch();
					for (l=0; l< FEchildren.length; l++) {
						var stuffObject4={};
						_.extend(stuffObject4,currentNode4[l],{rowSpan: 1});
						currentRow.push(stuffObject4);
						stuffArray.push(currentRow);
						currentRow=[];
						rowCount++;
					}
				}
			}
		}
	var firstPointer=0, secondPointer=0,rowLength, oldRowLength=1000000;
	for (i=0; i<rowCount; i++) {
		
		rowLength=stuffArray[i].length;
		if (rowLength>3)
		{
			stuffArray[firstPointer][0].rowSpan=i-firstPointer;
			firstPointer=i;
		}
		if ((rowLength>2) && (rowLength> oldRowLength)) {
			stuffArray[secondPointer][stuffArray[secondPointer].length-3].rowSpan=i-secondPointer;
			secondPointer=i;
		}
		oldRowLength=rowLength;
	}
	stuffArray[firstPointer][0].rowSpan=i-firstPointer;
	stuffArray[secondPointer][stuffArray[secondPointer].length-3].rowSpan=i-secondPointer;
	return stuffArray;
	}
	else return "";
}

Template.dfmea.helpers ({
	rowOfArray: function(){
		return stuffArray();
	},
	processRow: function() {
		return this;
	},
	rowSpan: function() {
		return this.rowSpan;
	},
	designEffect: function() {
		return this.nodeKind==="failureEffects";
	},
	designCause: function() {
		return this.nodeKind==="failureCauses";
	},
	RPN: function() {
		return 1000;
	},
	canEdit: function() {
		return true;  // need to put in logic to check permissions
	},
	editing: function(editType) {
		if (editType)
			return (Session.equals('editing_itemname', this._id) && (Session.equals('editField', editType)) && Template.dfmea.canEdit());  //need to fix the display on this		
		else
			return (Session.equals('editing_itemname', this._id) && Template.dfmea.canEdit());
}
});

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

Template.dfmea.events(okCancelEvents(
  '#content-input',
  {
    ok: function (text, evt) {
      DFMEAs.update({_id: this._id},{
        $set: {content: text,
        timestamp: (new Date()).getTime(),
      }});
      Session.set("editing_itemname", null);
      Session.set('editField',null);
    },
	cancel: function () {
      Session.set('editing_itemname', null);
      Session.set('editField',null);
    }})
);

Template.dfmea.events(okCancelEvents(
  '#SEV-input',
  {
    ok: function (text, evt) {
      DFMEAs.update({_id: this._id},{
        $set: {SEV: text,
        timestamp: (new Date()).getTime(),
      }});
      Session.set("editing_itemname", null);
      Session.set('editField',null);
    },
	cancel: function () {
      Session.set('editing_itemname', null);
      Session.set('editField',null);
    }})
);

Template.dfmea.events(okCancelEvents(
  '#OCC-input',
  {
    ok: function (text, evt) {
      DFMEAs.update({_id: this._id},{
        $set: {OCC: text,
        timestamp: (new Date()).getTime(),
      }});
      Session.set("editing_itemname", null);
      Session.set('editField',null);
    },
	cancel: function () {
      Session.set('editing_itemname', null);
      Session.set('editField',null);
    }})
);


Template.dfmea.events(okCancelEvents(
  '#DET-input',
  {
    ok: function (text, evt) {
      DFMEAs.update({_id: this._id},{
        $set: {DET: text,
        timestamp: (new Date()).getTime(),
      }});
      Session.set("editing_itemname", null);
      Session.set('editField',null);
    },
	cancel: function () {
      Session.set('editing_itemname', null);
      Session.set('editField',null);
    }})
);

Template.dfmea.events(okCancelEvents(
  '#class-input',
  {
    ok: function (text, evt) {
      DFMEAs.update({_id: this._id},{
        $set: {classification: text,
        timestamp: (new Date()).getTime(),
      }});
      Session.set("editing_itemname", null);
      Session.set('editField',null);
    },
	cancel: function () {
      Session.set('editing_itemname', null);
      Session.set('editField',null);
    }})
);

Template.dfmea.events(okCancelEvents(
  '#designControl-input',
  {
    ok: function (text, evt) {
      DFMEAs.update({_id: this._id},{
        $set: {designControl: text,
        timestamp: (new Date()).getTime(),
      }});
      Session.set("editing_itemname", null);
      Session.set('editField',null);
    },
	cancel: function () {
      Session.set('editing_itemname', null);
      Session.set('editField',null);
    }})
);
Template.dfmea.events ({

  'click .destroy': function () {
    return null;
  },
  'dblclick .nodeContent': function (evt, tmpl) {
    Session.set('editing_itemname', this._id);
    Session.set('editField',"Content");
    Deps.flush(); // update DOM before focus
    activateInput(tmpl.find("#content-input"));
  },
   'dblclick .SEV': function (evt, tmpl) {
    Session.set('editing_itemname', this._id);
    Session.set('editField',"SEV");
    Deps.flush(); // update DOM before focus
    activateInput(tmpl.find("#SEV-input"));
  },   
  'dblclick .Classification': function (evt, tmpl) {
    Session.set('editing_itemname', this._id);
    Session.set('editField',"Class");
    Deps.flush(); // update DOM before focus
    activateInput(tmpl.find("#class-input"));
  },
   'dblclick .designControl': function (evt, tmpl) {
    Session.set('editing_itemname', this._id);
    Session.set('editField',"designControl");
    Deps.flush(); // update DOM before focus
    activateInput(tmpl.find("#designControl-input"));
  }, 
  'dblclick .OCC': function (evt, tmpl) {
    Session.set('editing_itemname', this._id);
    Session.set('editField',"OCC");
    Deps.flush(); // update DOM before focus
    activateInput(tmpl.find("#OCC-input"));
  },
   'dblclick .DET': function (evt, tmpl) {
    Session.set('editing_itemname', this._id);
    Session.set('editField',"DET");
    Deps.flush(); // update DOM before focus
    activateInput(tmpl.find("#DET-input"));
  },
  'click .btn-add-to-project': function() {
  		if (this)
  		{
  			var self=String(this);
  			if (self === "")	
  				return;
  			else Projects.update({_id:Session.get("currentProject")},{$push:{projectMembers: self}});
  		}
  },
  'click .btn-help': function() {
  	if (this)
  	{
  		$('#helpOnProjects').modal();
  	}
  },
  'click .projectType': function() {
	var projType=$("input[name='optionsRadios']:checked",$('#projectType')).val();
	var projBool=(projType === "private") ? false : true;
    Projects.update({_id:Session.get("currentProject")},{$set: {publicProject: projBool}});
  },
  'click .btn-rev-minor': function() {
  	;
  },
  'click .btn-rev-major': function() {
  	;
  }
})