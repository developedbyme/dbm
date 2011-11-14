dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdown", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdown");
	
	var ScriptBreakdown = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdown");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ScriptBreakdownPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownPart");
	var ScriptBreakdownCodePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCodePart");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdown::init");
		
		this.superCall();
		
		this._owner = null;
		this._script = null;
		this._breakdown = null;
		
		return this;
	};
	
	objectFunctions.setOwner = function(aOwner) {
		
		this._owner = aOwner;
	};
	
	objectFunctions.setScript = function(aScript) {
		
		this._script = aScript;
		this._breakdown = ScriptBreakdownCodePart.create(null, this._script);
	};
	
	objectFunctions.getIncludedFiles = function() {
		
		this._breakdown.breakdownForInitialExecution();
		
		var importClassRegExp = new RegExp("dbm\.importClass\\(\"([a-zA-Z0-9_\.]*)\"\\);", "g");
		
		var returnArray = new Array();
		var currentArray = this._script.match(importClassRegExp);
		if(currentArray != null) {
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentClass = currentArray[i].substring(17, currentArray[i].length-3);
				returnArray.push(dbm.getFileForClass(currentClass));
			}
		}
		
		return returnArray;
	};
	
	objectFunctions.compile = function() {
		
		return this._breakdown.compile() + ";";
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