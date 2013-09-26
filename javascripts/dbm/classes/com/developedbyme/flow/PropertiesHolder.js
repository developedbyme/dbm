dbm.registerClass("com.developedbyme.flow.PropertiesHolder", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.PropertiesHolder");
	//"use strict";
	
	var PropertiesHolder = dbm.importClass("com.developedbyme.flow.PropertiesHolder");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.PropertiesHolder::_init");
		
		this.superCall();
		
		return this;
	};
	
	staticFunctions.create = function(aProperties) {
		//console.log("com.developedbyme.flow.PropertiesHolder::create");
		var newNode = (new ClassReference()).init();
		if(VariableAliases.isSet(aProperties)) {
			for(var objectName in aProperties) {
				newNode.createProperty(objectName, aProperties[objectName]);
			}
		}
		return newNode;
	};
});