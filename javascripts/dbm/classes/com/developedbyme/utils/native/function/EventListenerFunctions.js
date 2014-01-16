dbm.registerClass("com.developedbyme.utils.native.function.EventListenerFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.function.EventListenerFunctions");
	
	var EventListenerFunctions = dbm.importClass("com.developedbyme.utils.native.function.EventListenerFunctions");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	staticFunctions.addEventListener = function(aObject, aEventName, aFunction, aUseCapture) {
		switch(dbm.getEnvironmentName()) {
			case "nodejs":
				return aObject.addListener(aEventName, aFunction, aUseCapture);
			default:
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[EventListenerFunctions]", "addEventListener", "Unknown environment " + dbm.getEnvironmentName() + ".");
			case "browser":
				return aObject.addEventListener(aEventName, aFunction, aUseCapture);
		}
	};
	
	staticFunctions.removeEventListener = function(aObject, aEventName, aFunction, aUseCapture) {
		switch(dbm.getEnvironmentName()) {
			case "nodejs":
				return aObject.removeListener(aEventName, aFunction, aUseCapture);
			default:
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[EventListenerFunctions]", "removeEventListener", "Unknown environment " + dbm.getEnvironmentName() + ".");
			case "browser":
				return aObject.removeEventListener(aEventName, aFunction, aUseCapture);
		}
	};
	
	staticFunctions.createCallbackFunction = function(aObject) {
		switch(dbm.getEnvironmentName()) {
			case "nodejs":
				return ClassReference.createMultipleArgumentsCallback(aObject);
			default:
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[EventListenerFunctions]", "createCallbackFunction", "Unknown environment " + dbm.getEnvironmentName() + ".");
			case "browser":
				return ClassReference.createSingleEventObjectCallback(aObject);
		}
	};
	
	staticFunctions.createSingleEventObjectCallback = function(aObject) {
		var thisPointer = aObject;
		var eventCallback = function _eventCallback(aEvent) {
			//console.log("com.developedbyme.utils.native.function.EventListenerFunctions");
			//console.log(aEvent);
			//console.log(thisPointer._javascriptEventName);
			if(thisPointer === null || thisPointer._performerObject === null) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, thisPointer, "_eventCallback", "Performer object is null.");
				return true;
			}
			thisPointer._performerObject.perform(thisPointer._extendedEventName, aEvent);
			return true;
		};
		eventCallback._deleteEventCallback = function() {
			thisPointer = null;
		};
		return eventCallback;
	};
	
	staticFunctions.createMultipleArgumentsCallback = function(aObject) {
		var thisPointer = aObject;
		var eventCallback = function _eventCallback(/* ... aArguments */) {
			//console.log("com.developedbyme.utils.native.function.EventListenerFunctions");
			//console.log(aEvent);
			//console.log(thisPointer._javascriptEventName);
			var aArguments = arguments;
			if(thisPointer === null || thisPointer._performerObject === null) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, thisPointer, "_eventCallback", "Performer object is null.");
				return true;
			}
			thisPointer._performerObject.perform(thisPointer._extendedEventName, aArguments);
			return true;
		};
		eventCallback._deleteEventCallback = function() {
			thisPointer = null;
		};
		return eventCallback;
	};
});