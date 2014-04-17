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
	}

});