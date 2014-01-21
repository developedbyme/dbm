dbm.registerClass("com.developedbyme.utils.native.function.FunctionFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.function.FunctionFunctions");
	
	var FunctionFunctions = dbm.importClass("com.developedbyme.utils.native.function.FunctionFunctions");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var JavascriptObjectTypes = dbm.importClass("com.developedbyme.constants.JavascriptObjectTypes");
	
	staticFunctions.getCallbackFunction = function(aObject, aFunction) {
		//METODO: do a try catch for silent error catch
		var returnFunction = function() {
			aFunction.call(aObject, arguments);
		};
		
		return returnFunction;
	};
	
	staticFunctions.getCallbackFunction1Argument = function(aObject, aFunction) {
		//METODO: do a try catch for silent error catch
		var returnFunction = function(aArgument1) {
			//console.log("com.developedbyme.utils.native.function.FunctionFunctions::getCallbackFunction1Argument (callback)");
			//console.log(aObject, aFunction, aArgument1);
			aFunction.call(aObject, aArgument1);
			//console.log("com.developedbyme.utils.native.function.FunctionFunctions::getCallbackFunction1Argument (callback done)");
		};
		
		return returnFunction;
	};
	
	staticFunctions.createScopedFunction = function(aObject, aFunction) {
		var thisPointer = aObject;
		var thisFunction = aFunction;
		var newScopedFunction = function _scopedFunction() {
			return thisFunction.call(thisPointer);
		};
		newScopedFunction.destroy = function() {
			thisPointer = null;
			thisFunction = null;
		};
		return newScopedFunction;
	};
	
	staticFunctions.createScopedFunctionWithArguments = function(aObject, aFunction) {
		var thisPointer = aObject;
		var thisFunction = aFunction;
		var newScopedFunction = function _scopedFunction(/* ... arguments */) {
			return thisFunction.apply(thisPointer, arguments);
		};
		newScopedFunction.destroy = function() {
			thisPointer = null;
			thisFunction = null;
		};
		return newScopedFunction;
	};
});