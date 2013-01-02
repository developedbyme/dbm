dbm.registerClass("com.developedbyme.compiler.breakdown.dbm.ScriptBreakdownDbmImportClassPart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.dbm.ScriptBreakdownDbmImportClassPart");
	
	var ScriptBreakdownDbmImportClassPart = dbm.importClass("com.developedbyme.compiler.breakdown.dbm.ScriptBreakdownDbmImportClassPart");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.compiler.breakdown.dbm.ScriptBreakdownDbmImportClassPart::_init");
		
		this.superCall();
		
		this._type = "dbmImportClass";
		this._variableName = null;
		this._classPath = null;
		
		return this;
	};
	
	objectFunctions.setupImport = function(aVariableName, aClassPath) {
		this._variableName = aVariableName;
		this._classPath = aClassPath;
		
		return this;
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.dbm.ScriptBreakdownDbmImportClassPart::_breakdown");
		
		//METODO: some kind of error message here?
	};
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("com.developedbyme.compiler.breakdown.dbm.ScriptBreakdownDbmImportClassPart::compile");
		//console.log(aCompileData);
		
		var compiledName = aCompileData.addImport(this._classPath);
		aCompileData.addImportReference(this._variableName, compiledName);
		
		return "";
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParent, aScript, aVariableName, aClassPath) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setScript(aScript);
		newScriptBreakDown.setupImport(aVariableName, aClassPath);
		return newScriptBreakDown;
	};
});