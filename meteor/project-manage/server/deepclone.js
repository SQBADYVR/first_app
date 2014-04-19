Meteor.startup(function() {
    Meteor.methods({
		deepClone: function(oldParentNodeID, databaseName) {
	if (oldParentNodeID && databaseName)
	{
	console.log(oldParentNodeID);
	console.log(databaseName);
	// oldParentNodeID is expected to be the _id of a headerNode with a field called archives[{Major:, Minor:, archivedParentNode}]
	// databaseName is the name of the database where the cloning occurs
	if (!(oldParentNodeID))
	{
		return;  //need to add error code
	}
	else
	{
		var clonedTree=recursiveClone(oldParentNodeID,databaseName);
		databaseName.update({_id:oldParentNodeID},{$push: {archivedStack: clonedTree}});
	}}
}});
});

var recursiveClone = function(currentNodeID, databaseName) {
	//this function clones the node whos ID is passed and all descendents of that node.
		var oldParentNode=(databaseName).findOne({_id: currentNodeID});
		var archivedParentNode=new Object;
		jQuery.extend(archivedParentNode,oldParentNode);
		delete archivedParentNode._id;
		if (oldParentNode.subcategories)
		{
			archivedParentNode.subcategories=[];
			var i, childNode;
			for (i=0; i< oldParentNode.subcategories.length; i++) {
				childNode=recursiveClone(archivedParentNode.subcategories[i],databaseName);
				archivedParentNode.subcategories.push(childNode);
			}
		return databaseName.insert(archivedParentNode);
}};

