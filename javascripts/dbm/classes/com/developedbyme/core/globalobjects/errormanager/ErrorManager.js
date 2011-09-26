dbm.registerClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	
	dbm.setClassAsSingleton("dbmErrorManager");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.errormanager.ErrorManager::init");
		
		this.superCall();
		
		this._handlers = new Array();
		
		return this;
	};
	
	objectFunctions.addHandler = function(aHandler) {
		this._handlers.push(aHandler);
	};
	
	objectFunctions.report = function(aType, aLevel, aObject, aFunctionName, aData) {
		var currentArray = this._handlers;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentHandler = currentArray[i];
			currentHandler.report(aType, aLevel, aObject, aFunctionName, aData);
		}
	};
	
	objectFunctions.reportError = function(aObject, aFunctionName, aError) {
		var currentArray = this._handlers;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentHandler = currentArray[i];
			currentHandler.reportError(aObject, aFunctionName, aError);
		}
	};
});