dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownNumberPart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownNumberPart");
	
	var ScriptBreakdownNumberPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownNumberPart");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownNumberPart::_init");
		
		this.superCall();
		
		this._type = "number";
		
		return this;
	};
	
	objectFunctions.setScoop = function(aScoop) {
		this._scoop = aScoop;
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownNumberPart::_breakdown");
		//console.log(this._script);
	}
	
	objectFunctions.compile = function(aCompileData) {
		
		return this._script;
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