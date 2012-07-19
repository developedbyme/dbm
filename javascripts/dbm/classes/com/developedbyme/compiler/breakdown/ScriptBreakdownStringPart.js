dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownStringPart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownStringPart");
	
	var ScriptBreakdownStringPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownStringPart");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownStringPart::_init");
		
		this.superCall();
		
		this._type = "string";
		this._scoop = "\"";
		
		return this;
	};
	
	objectFunctions.setScoop = function(aScoop) {
		this._scoop = aScoop;
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownStringPart::_breakdown");
		//console.log(this._script);
	}
	
	objectFunctions.compile = function(aCompileData) {
		
		return aCompileData.addString(this._script, this._scoop);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParent, aScript, aScoop) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setScript(aScript);
		newScriptBreakDown.setScoop(aScoop);
		return newScriptBreakDown;
	};
});