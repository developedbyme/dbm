/**
 * Global object for andeling id
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.core.globalobjects.idmanager.IdManager", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.idmanager.IdManager");
	
	var IdManager = dbm.importClass("com.developedbyme.core.globalobjects.idmanager.IdManager");
	
	var NormalIdGroup = dbm.importClass("com.developedbyme.core.globalobjects.idmanager.objects.NormalIdGroup");
	
	dbm.setClassAsSingleton("dbmIdManager");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.idmanager.IdManager");
		
		this._idGroupsObject = new Object();
		
		return this;
	};
	
	/**
	 * Sets the id group.
	 *
	 * @param	aGroupName		The name of the group.
	 * @param	aGroupObject	The group object.
	 */
	objectFunctions.setIdGroup = function(aGroupName, aGroupObject) {
		//console.log("setIdGroup");
		if(this._idGroupsObject[aGroupName] !== undefined) {
			//METODO: warning message
		}
		this._idGroupsObject[aGroupName] = aGroupObject;
	};
	
	/**
	 * Returns a unique id for a group.
	 *
	 * @param	aGroupName	The name of the group.
	 */
	objectFunctions.getNewId = function(aGroupName) {
		//console.log("getId");
		if(this._idGroupsObject[aGroupName] === undefined) {
			//METODO: warning message
			var newGroup = (new NormalIdGroup()).init();
			newGroup.prefix = aGroupName + "_";
			this._idGroupsObject[aGroupName] = newGroup;
		}
		var currentGroup = this._idGroupsObject[aGroupName];
		return currentGroup.getNewId();
	};
});