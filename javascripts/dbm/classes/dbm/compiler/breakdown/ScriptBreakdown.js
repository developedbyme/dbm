/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Holder for a script breakdown.
 */
dbm.registerClass("dbm.compiler.breakdown.ScriptBreakdown", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.compiler.breakdown.ScriptBreakdown");
	
	//Self reference
	var ScriptBreakdown = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdown");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var ScriptBreakdownPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownPart");
	var ScriptBreakdownCodePart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownCodePart");
	
	//Urils
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.compiler.breakdown.ScriptBreakdown::_init");
		
		this.superCall();
		
		this._owner = null;
		this._script = null;
		this._breakdown = null;
		
		return this;
	};
	
	objectFunctions.getType = function() {
		return "scriptFile";
	};
	
	objectFunctions.setOwner = function(aOwner) {
		
		this._owner = aOwner;
	};
	
	objectFunctions.setScript = function(aScript) {
		
		this._script = aScript;
		this._breakdown = ScriptBreakdownCodePart.create(null, this._script);
	};
	
	objectFunctions.getChildBreakdowns = function() {
		return [this._breakdown];
	};
	
	objectFunctions.getIncludedFiles = function() {
		
		this._breakdown.breakdownForInitialExecution();
		
		var returnArray = new Array();
		
		var registerClassRegExp = new RegExp("dbm\\.registerClass\\(\"([a-zA-Z0-9_\\.]*)\",[\\s]*\"([a-zA-Z0-9_\\.]*)\"", "g");
		var currentArray = this._script.match(registerClassRegExp);
		if(currentArray !== null) {
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentClass = currentArray[i].substring(0, currentArray[i].length-1);
				var currentClass = currentArray[i].substring(currentClass.lastIndexOf("\"")+1, currentClass.length);
				returnArray.push(dbm.getFileForClass(currentClass));
			}
		}
		
		var importClassRegExp = new RegExp("dbm\\.importClass\\(\"([a-zA-Z0-9_\\.]*)\"\\);", "g");
		var currentArray = this._script.match(importClassRegExp);
		if(currentArray !== null) {
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentClass = currentArray[i].substring(17, currentArray[i].length-3);
				returnArray.push(dbm.getFileForClass(currentClass));
			}
		}
		
		return returnArray;
	};
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("dbm.compiler.breakdown.ScriptBreakdown::compile");
		//console.log(aCompileData);
		return this._breakdown.compile(aCompileData) + ";";
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._owner = null;
		this._script = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aOwner, aScript) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setOwner(aOwner);
		newScriptBreakDown.setScript(aScript);
		return newScriptBreakDown;
	};
});