dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCommentPart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownCommentPart");
	
	var ScriptBreakdownCommentPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCommentPart");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownCommentPart::_init");
		
		this.superCall();
		
		this._type = "comment";
		
		return this;
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownCommentPart::_breakdown");
		
	}
	
	objectFunctions.compile = function(aCompileData) {
		
		return "";
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