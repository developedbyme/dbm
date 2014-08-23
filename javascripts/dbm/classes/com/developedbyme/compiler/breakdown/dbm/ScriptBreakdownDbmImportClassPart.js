/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Script breakdown for the import of a class.
 */
dbm.registerClass("com.developedbyme.compiler.breakdown.dbm.ScriptBreakdownDbmImportClassPart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.dbm.ScriptBreakdownDbmImportClassPart");
	
	//Self reference
	var ScriptBreakdownDbmImportClassPart = dbm.importClass("com.developedbyme.compiler.breakdown.dbm.ScriptBreakdownDbmImportClassPart");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	var DbmBreakdownTypes = dbm.importClass("com.developedbyme.constants.compiler.DbmBreakdownTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.compiler.breakdown.dbm.ScriptBreakdownDbmImportClassPart::_init");
		
		this.superCall();
		
		this._type = DbmBreakdownTypes.IMPORT_CLASS;
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
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
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