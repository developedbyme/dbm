dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.objects.ParserResultDataObject", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	var ParserResultDataObject = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	var ArrayHolder = dbm.importClass("com.developedbyme.utils.data.ArrayHolder");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var XmlChildRetreiver = dbm.importClass("com.developedbyme.utils.xml.XmlChildRetreiver");
	
	var AssetStatusTypes = dbm.importClass("com.developedbyme.constants.AssetStatusTypes");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.datamanager.objects.ParserResultDataObject::init");
		
		this.superCall();
		
		this.result = null;
		this.isLinked = false;
		this.nodes = null;
		
		return this;
	};
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.result = null;
		this.nodes = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aResult) {
		var newParserResultDataObject = (new ClassReference()).init();
		newParserResultDataObject.result = aResult;
		return newParserResultDataObject;
	};
	
	staticFunctions.createLinked = function(aResultLink, aNodes) {
		var newParserResultDataObject = (new ClassReference()).init();
		newParserResultDataObject.result = aResultLink;
		newParserResultDataObject.isLinked = true;
		newParserResultDataObject.nodes = aNodes;
		return newParserResultDataObject;
	};
});