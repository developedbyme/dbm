/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.development.CommandLineExecutor", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.development.CommandLineExecutor");
	
	//Self reference
	var CommandLineExecutor = dbm.importClass("com.developedbyme.utils.development.CommandLineExecutor");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var ScriptBreakdown = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdown");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.development.CommandLineExecutor::_init");
		
		this.superCall();
		
		this._thisObject = dbm.getWindow();
		this._closureVariables = this.addDestroyableObject(NamedArray.create(false));
		this._importClosureVariablesScript = "";
		this._exportClosureVariablesScript = "";
		this._closureVariablesName = "aClosureVariables";
		this._keepClosureVariables = true;
		
		return this;
	};
	
	objectFunctions.addClosureVariable = function(aName, aValue) {
		if(this._closureVariables.hasObject(aName)) {
			this._closureVariables.replaceObject(aName, aValue);
		}
		else {
			this._closureVariables.addObject(aName, aValue);
			this._importClosureVariablesScript += "var " + aName + " = " + this._closureVariablesName + "[\"" + aName + "\"]" + ";";
			this._exportClosureVariablesScript += this._closureVariablesName + "[\"" + aName + "\"]" + " = " + aName + ";";
		}
	};
	
	objectFunctions._addDynamciallyDeclaredVariables = function(aNamesArray) {
		var currentArray = aNamesArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentName = currentArray[i];
			if(!this._closureVariables.hasObject(currentName)) {
				this.addClosureVariable(currentName, undefined); //MENOTE: undefined simulates default behaviour
			}
		}
	};
	
	objectFunctions.executeScript = function(aScript) {
		
		if(this._keepClosureVariables) {
			var breakdown = ScriptBreakdown.create(null, aScript);
			var newVariablesArray = new Array();
			breakdown._breakdown.breakdownToGetVariableDecalarations(newVariablesArray);
			this._addDynamciallyDeclaredVariables(newVariablesArray);
		}
		
		var fullCode = this._importClosureVariablesScript + "\n";
		fullCode += aScript + ";" + "\n";
		fullCode += this._exportClosureVariablesScript + "\n";
		
		var excecuteFunction = new Function(this._closureVariablesName, fullCode);
		excecuteFunction.call(this._thisObject, this._closureVariables.getObjectsObject());
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		//switch(aName) {
		//	case ProcessExtendedEventIds.DONE:
		//		return true;
		//}
		
		return this.superCall(aName);
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._status = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newCommandLineExecutor = (new ClassReference()).init();
		return newCommandLineExecutor;
	};
});