/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Script breakdown of a function declaration.
 */
dbm.registerClass("dbm.compiler.breakdown.ScriptBreakdownFunctionPart", "dbm.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.compiler.breakdown.ScriptBreakdownFunctionPart");
	
	//Self reference
	var ScriptBreakdownFunctionPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownFunctionPart");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var ScriptBreakdownLinePart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownLinePart");
	var ScriptBreakdownCodePart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownCodePart");
	var ScriptBreakdownListPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownListPart");
	
	//Utils
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var ScopeFunctions = dbm.importClass("dbm.utils.native.string.ScopeFunctions");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var JavascriptLanguageFunctions = dbm.importClass("dbm.utils.native.string.JavascriptLanguageFunctions");
	var StringFunctions = dbm.importClass("dbm.utils.native.string.StringFunctions");
	var BreakdownFunctions = dbm.importClass("dbm.compiler.breakdown.BreakdownFunctions");
	
	//Constants
	var BreakdownTypes = dbm.importClass("dbm.constants.compiler.BreakdownTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownFunctionPart::_init");
		
		this.superCall();
		
		this._type = BreakdownTypes.FUNCTION_DECLARATION;
		this._functionName = null;
		this._arguments = null;
		this._code = null;
		
		return this;
	};
	
	/**
	 * Gets an argument breakdown.
	 *
	 * @param	aIndex	Number	The index of the argument to get.
	 *
	 * @return	ScriptBreakdownPart	The argument breakdown.
	 */
	objectFunctions.getArgumentBreakdown = function(aIndex) {
		return BreakdownFunctions.getBreakdownWithoutComments(this._arguments.getChildBreakdowns()[aIndex]);
	};
	
	/**
	 * Gets an all the names of the arguments.
	 *
	 * @return	Array	Array of all the names.
	 */
	objectFunctions.getArgumentNames = function() {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownFunctionPart::getArgumentNames");
		
		var currentArray = this._arguments.getChildBreakdowns();
		var currentArrayLength = currentArray.length;
		if(currentArrayLength === 1 && currentArray[0].getType() === BreakdownTypes.COMMENT) {
			return [];
		}
		var returnArray = new Array(currentArrayLength);
		for(var i = 0; i < currentArrayLength; i++) {
			returnArray[i] = BreakdownFunctions.getBreakdownWithoutComments(currentArray[i]).getVariableName();
		}
		return returnArray;
	};
	
	objectFunctions._breakdown = function() {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownFunctionPart::_breakdown");
		
		var argumentsIndex = this._script.indexOf("(");
		
		var functionName = StringFunctions.trim(this._script.substring(8, argumentsIndex));
		if(!VariableAliases.isEmptyText(functionName)) {
			this._functionName = functionName;
		}
		
		var argumentsScope = ScopeFunctions.getScope(this._script, argumentsIndex, "(", ")");
		
		this._arguments = ScriptBreakdownListPart.create(this, StringFunctions.trim(this._script.substring(argumentsScope.start+1, argumentsScope.end)));
		this._arguments.declaresVariables = "argument";
		var codeString = StringFunctions.trim(this._script.substring(argumentsScope.end+1, this._script.length));
		
		this._code = ScriptBreakdownCodePart.create(this, codeString.substring(1, codeString.length-1));
		this._code.setScope("{", "}");
		
		this._childBreakdowns.push(this._arguments);
		this._childBreakdowns.push(this._code);
	};
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownFunctionPart::compile");
		//console.log(aCompileData);
		
		aCompileData.createScope();
		
		var returnString = "function";
		
		//if(this._functionName !== null) {
		//	returnString += " " + this._functionName;
		//}
		
		returnString += "(" + this._arguments.compile(aCompileData) + ")";
		returnString += this._code.compile(aCompileData);
		
		aCompileData.removeLastScope();
		
		return returnString;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._arguments = null;
		this._code = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParent, aScript) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setScript(aScript);
		return newScriptBreakDown;
	};
});