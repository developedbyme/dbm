dbm.registerClass("com.developedbyme.flow.data.KeyValuePropertyPair", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.data.KeyValuePropertyPair");
	
	var KeyValuePropertyPair = dbm.importClass("com.developedbyme.flow.data.KeyValuePropertyPair");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.data.KeyValuePropertyPair::_init");
		
		this.superCall();
		
		this.keyValue = this.createProperty("keyValue", "");
		this.dataValue = this.createProperty("dataValue", "");
		
		return this;
	};
	
	/**
	 * Sets all the references to null.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.keyValue = null;
		this.dataValue = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aKeyValue, aDataValue) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("keyValue", aKeyValue);
		newNode.setPropertyInputWithoutNull("dataValue", aDataValue);
		return newNode;
	}
});