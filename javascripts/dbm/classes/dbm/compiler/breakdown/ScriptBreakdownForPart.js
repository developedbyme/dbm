/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Script breakdown for a for loop.
 */
dbm.registerClass("dbm.compiler.breakdown.ScriptBreakdownForPart", "dbm.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.compiler.breakdown.ScriptBreakdownForPart");
	
	//Self reference
	var ScriptBreakdownForPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownForPart");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var ScriptBreakdownLinePart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownLinePart");
	var ScriptBreakdownCodePart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownCodePart");
	
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
		//console.log("dbm.compiler.breakdown.ScriptBreakdownForPart::_init");
		
		this.superCall();
		
		this._type = BreakdownTypes.FOR;
		this._evaluation = null;
		this._code = null;
		
		return this;
	};
	
	objectFunctions._breakdown = function() {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownForPart::_breakdown");
		
		var evaluationIndex = this._script.indexOf("(");
		var evaluationScope = ScopeFunctions.getScope(this._script, evaluationIndex, "(", ")");
		this._evaluation = ScriptBreakdownCodePart.create(this, StringFunctions.trim(this._script.substring(evaluationScope.start+1, evaluationScope.end)));
		this._evaluation.keepBlankLines = true;
		var resultString = StringFunctions.trim(this._script.substring(evaluationScope.end+1, this._script.length));
		if(resultString.charAt(0) === "{" && ScopeFunctions.getScope(resultString, 0, "{", "}").end === resultString.length-1) {
			this._code = ScriptBreakdownCodePart.create(this, resultString.substring(1, resultString.length-1));
			this._code.setScope("{", "}");
		}
		else {
			this._code = ScriptBreakdownLinePart.create(this, resultString);
		}
		this._childBreakdowns.push(this._evaluation);
		this._childBreakdowns.push(this._code);
	};
	
	objectFunctions.compile = function(aCompileData) {
		
		var evaluationString = this._evaluation.compile(aCompileData);
		var isInType = evaluationString.match(new RegExp("^[^;]* in .[^;]*$"));
		
		if(!isInType) {
			var evaluationSplitArray = evaluationString.split(";");
			for(var i = evaluationSplitArray.length; i < 3; i++) {
				evaluationSplitArray.push("");
			}
			evaluationString = evaluationSplitArray.join(";");
		}
		
		var returnString = "for(" + evaluationString + ")";
		returnString += this._code.compile(aCompileData);
		
		return returnString;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._evaluation = null;
		this._result = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParent, aScript) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setScript(aScript);
		return newScriptBreakDown;
	};
});