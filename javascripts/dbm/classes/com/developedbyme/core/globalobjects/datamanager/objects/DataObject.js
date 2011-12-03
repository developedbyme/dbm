dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.objects.DataObject", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.objects.DataObject");
	
	var DataObject = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.objects.DataObject");
	
	var ArrayHolder = dbm.importClass("com.developedbyme.utils.data.ArrayHolder");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.datamanager.objects.DataObject::init");
		
		this.superCall();
		
		this._hierarchyItem = null;
		this._data = this.createProperty("data", null);
		this._definitionXml = null;
		this._nodes = ArrayHolder.create(true);
		this.addDestroyableObject(this._nodes);
		
		return this;
	};
	
	objectFunctions.getData = function() {
		return this._data.getValue();
	};
	
	objectFunctions.setHierarchyItem = function(aItem) {
		this._hierarchyItem = aItem;
	};
	
	objectFunctions.getHierarchyItem = function() {
		return this._hierarchyItem;
	};
	
	objectFunctions.setDefinitionXml = function(aXml) {
		this._definitionXml = aXml;
	};
	
	objectFunctions.getDefinitionXml = function() {
		return this._definitionXml;
	};
	
	objectFunctions.addNode = function(aNode) {
		this._nodes.array.push(aNode);
	};
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		if(this._data != null) {
			aReturnArray.push("data: " + this._data.getValue());
		}
	}
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._hierarchyItem = null;
		this._data = null;
		this._definitionXml = null;
		this._nodes = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newDataObject = (new ClassReference()).init();
		return newDataObject;
	};
});