dbm.registerClass("com.developedbyme.flow.PropertiesHolder", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.PropertiesHolder");
	
	var PropertiesHolder = dbm.importClass("com.developedbyme.flow.PropertiesHolder");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.PropertiesHolder::init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.performDestroy = function() {
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aProperties) {
		var newNode = (new ClassReference()).init();
		if(aProperties != null) {
			for(var objectName in aProperties) {
				newNode.createProperty(objectName, aProperties[objectName]);
			}
		}
		return newNode;
	}
});