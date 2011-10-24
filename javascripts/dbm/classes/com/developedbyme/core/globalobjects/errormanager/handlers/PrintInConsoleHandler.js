dbm.registerClass("com.developedbyme.core.globalobjects.errormanager.handlers.PrintInConsoleHandler", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.errormanager.handlers.PrintInConsoleHandler");
	
	var PrintInConsoleHandler = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.handlers.PrintInConsoleHandler");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.errormanager.handlers.PrintInConsoleHandler::init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.report = function(aType, aLevel, aObject, aFunctionName, aData) {
		switch(aType) {
			case ReportTypes.ERROR:
				console.error(aObject, aFunctionName+":", aData);
				break;
			case ReportTypes.WARNING:
				console.warn(aObject, aFunctionName+":", aData);
				break;
			case ReportTypes.LOG:
				console.log(aObject, aFunctionName+":", aData);
				break;
			default:
				console.log(aType, aObject, aFunctionName+":", aData);
				break;
		}
	};
	
	objectFunctions.reportError = function(aObject, aFunctionName, aError) {
		console.error(aObject, aFunctionName+":", aError);
	};
});