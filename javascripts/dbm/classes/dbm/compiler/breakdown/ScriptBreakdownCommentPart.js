/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Script breakdown for a comment.
 */
dbm.registerClass("dbm.compiler.breakdown.ScriptBreakdownCommentPart", "dbm.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.compiler.breakdown.ScriptBreakdownCommentPart");
	
	//Self reference
	var ScriptBreakdownCommentPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownCommentPart");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var DocumentationData = dbm.importClass("dbm.compiler.compiledata.documentation.DocumentationData");
	
	//Utils
	
	//Constants
	var BreakdownTypes = dbm.importClass("dbm.constants.compiler.BreakdownTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownCommentPart::_init");
		
		this.superCall();
		
		this._type = BreakdownTypes.COMMENT;
		
		return this;
	};
	
	/**
	 * Breaks down the script for this part.
	 */
	objectFunctions._breakdown = function() {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownCommentPart::_breakdown");
		
		if(this._script[1] === "*" && this._script[2] === "*") {
			this._type = BreakdownTypes.DOCUMENTATION;
			
			//MEDEBUG
			//DocumentationData.create(this._script);
		}
	};
	
	/**
	 * Compiles the script for this part.
	 *
	 * @param	aCompileData	CompileData	The settings and scope data for this compilation.
	 *
	 * @return	String	The compiled data.
	 */
	objectFunctions.compile = function(aCompileData) {
		
		return "";
	};
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._evaluation = null;
		this._result = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aParent		ScriptBreakDownPart	The parent part of this breakdown.
	 * @param	aScript		String				The script to breakdown.
	 *
	 * @return	ScriptBreakdownCommentPart	The newly created instance.
	 */
	staticFunctions.create = function(aParent, aScript) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setScript(aScript);
		return newScriptBreakDown;
	};
});