/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.native.function.EventListenerFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.native.function.EventListenerFunctions");
	
	//Self reference
	var EventListenerFunctions = dbm.importClass("dbm.utils.native.function.EventListenerFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
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
			//console.log("dbm.utils.native.function.EventListenerFunctions::createSingleEventObjectCallback (_eventCallback)");
			//console.log(aEvent);
			//console.log(thisPointer);
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
			//console.log("dbm.utils.native.function.EventListenerFunctions");
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