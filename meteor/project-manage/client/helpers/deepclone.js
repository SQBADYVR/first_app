deepClone=function(oldParentNodeID, databaseName) {
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
};

var recursiveClone = function(currentNodeID, databaseName) {
	//this function clones the node whos ID is passed and all descendents of that node.
		var oldParentNode=(databaseName).findOne({_id: currentNodeID});
		var archivedParentNode=new Object;
		var i, childNode;
		jQuery.extend(archivedParentNode,oldParentNode);
		delete archivedParentNode._id;
		archivedParentNode.subcategories=[];
		var retval= databaseName.insert(archivedParentNode);
		if ((oldParentNode.subcategories) && (oldParentNode.subcategories.length)){	
			for (i=0; i< oldParentNode.subcategories.length; i++) {
				childNode=recursiveClone(oldParentNode.subcategories[i],databaseName);
				archivedParentNode.subcategories.push(childNode);
				databaseName.update({_id:retval},{$push: {subcategories: childNode}});
				databaseName.update({_id:childNode},{$set: {parentCategory: retval}});
			}
		}
		return retval;
};

