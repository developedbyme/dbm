/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Script breakdown of a list, such as a list of arguments in a function declaration.
 */
dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownListPart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownListPart");
	
	//Self reference
	var ScriptBreakdownListPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownListPart");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var ScriptBreakdownLinePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownLinePart");
	var ScriptBreakdownCodePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCodePart");
	
	//Utils
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var ScopeFunctions = dbm.importClass("com.developedbyme.utils.native.string.ScopeFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var JavascriptLanguageFunctions = dbm.importClass("com.developedbyme.utils.native.string.JavascriptLanguageFunctions");
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	var StringRegularExpressions = dbm.importClass("com.developedbyme.utils.native.string.StringRegularExpressions");
	
	//Dependencies
	var BreakdownTypes = dbm.importClass("com.developedbyme.constants.compiler.BreakdownTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownListPart::_init");
		
		this.superCall();
		
		this._type = BreakdownTypes.LIST;
		
		return this;
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownListPart::_breakdown");
		
		if(StringRegularExpressions.isWhiteSpace(this._script)) {
			return;
		}
		
		var currentArray = this._getCommaArray(this._script);
		var currentArrayLength = currentArray.length;
		var currentPosition = 0;
		var currentBreakdown;
		for(var i = 0; i < currentArrayLength; i++) {
			currentBreakdown = ScriptBreakdownLinePart.create(this, StringFunctions.trim(this._script.substring(currentPosition, currentArray[i])));
			this._childBreakdowns.push(currentBreakdown);
			currentPosition = currentArray[i]+1;
		}
		currentBreakdown = ScriptBreakdownLinePart.create(this, StringFunctions.trim(this._script.substring(currentPosition, this._script.length)));
		this._childBreakdowns.push(currentBreakdown);
	};
	
	objectFunctions.compile = function(aCompileData) {
		
		var argumentsArray = new Array();
		
		var currentArray = this._childBreakdowns;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPart = currentArray[i];
			argumentsArray.push(currentPart.compile(aCompileData));
		}
		
		var returnString = argumentsArray.join(",");
		
		return returnString;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParent, aScript) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setScript(aScript);
		return newScriptBreakDown;
	};
});