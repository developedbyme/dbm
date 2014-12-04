/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Script breakdown for a literal object ({variableName1: value1, variableName2: value2}).
 */
dbm.registerClass("dbm.compiler.breakdown.ScriptBreakdownLiteralObjectPart", "dbm.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.compiler.breakdown.ScriptBreakdownLiteralObjectPart");
	
	//Self reference
	var ScriptBreakdownLiteralObjectPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownLiteralObjectPart");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var ScriptBreakdownLinePart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownLinePart");
	var ScriptBreakdownCodePart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownCodePart");
	var ScriptBreakdownListPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownListPart");
	var ScriptBreakdownLiteralNamePart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownLiteralNamePart");
	
	//Utils
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var ScopeFunctions = dbm.importClass("dbm.utils.native.string.ScopeFunctions");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var JavascriptLanguageFunctions = dbm.importClass("dbm.utils.native.string.JavascriptLanguageFunctions");
	var StringFunctions = dbm.importClass("dbm.utils.native.string.StringFunctions");
	
	//Constants
	var BreakdownTypes = dbm.importClass("dbm.constants.compiler.BreakdownTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownLiteralObjectPart::_init");
		
		this.superCall();
		
		this._type = BreakdownTypes.LITERAL_OBJECT;
		this._names = new Array();
		this._values = new Array();
		
		return this;
	};
	
	objectFunctions._replaceChildBreakdown = function(aCurrentPart, aNewPart) {
		
		var nameIndex = ArrayFunctions.indexOfInArray(this._names, aCurrentPart);
		if(nameIndex > -1) {
			this._names[nameIndex] = aNewPart;
		}
		var valueIndex = ArrayFunctions.indexOfInArray(this._values, aCurrentPart);
		if(valueIndex > -1) {
			this._values[valueIndex] = aNewPart;
		}
		
		this.superCall(aCurrentPart, aNewPart);
	};
	
	objectFunctions._breakdown = function() {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownLiteralObjectPart::_breakdown");
		
		var currentArray = this._getCommaArray(this._script);
		var currentArrayLength = currentArray.length;
		var currentPosition = 0;
		for(var i = 0; i < currentArrayLength; i++) {
			
			var currentLine = StringFunctions.trim(this._script.substring(currentPosition, currentArray[i]));
			var colonPosition = this._getColonPosition(currentLine);
			if(colonPosition === -1) {
				continue;
			}
			else {
				var namePart = ScriptBreakdownLiteralNamePart.create(this, StringFunctions.trim(currentLine.substring(0, colonPosition)));
				var valuePart = ScriptBreakdownLinePart.create(this, StringFunctions.trim(currentLine.substring(colonPosition+1, currentLine.length)));
				this._names.push(namePart);
				this._childBreakdowns.push(namePart);
				this._values.push(valuePart);
				this._childBreakdowns.push(valuePart);
			}
			currentPosition = currentArray[i]+1;
		}
		
		var currentLine = StringFunctions.trim(this._script.substring(currentPosition, this._script.length));
		var colonPosition = this._getColonPosition(currentLine);
		if(colonPosition !== -1) {
			var namePart = ScriptBreakdownLiteralNamePart.create(this, StringFunctions.trim(currentLine.substring(0, colonPosition)));
			var valuePart = ScriptBreakdownLinePart.create(this, StringFunctions.trim(currentLine.substring(colonPosition+1, currentLine.length)));
			this._names.push(namePart);
			this._childBreakdowns.push(namePart);
			this._values.push(valuePart);
			this._childBreakdowns.push(valuePart);
		}
		
	};
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownLiteralObjectPart::compile");
		
		var argumentsArray = new Array();
		var currentArray = this._names;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentName = currentArray[i];
			var currentValue = this._values[i];
			argumentsArray.push(currentName.compile(aCompileData) + ":" + currentValue.compile(aCompileData));
		}
		
		var returnString = "{" + argumentsArray.join(",") + "}";
		
		return returnString;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._arguments = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParent, aScript) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setScript(aScript);
		return newScriptBreakDown;
	};
});