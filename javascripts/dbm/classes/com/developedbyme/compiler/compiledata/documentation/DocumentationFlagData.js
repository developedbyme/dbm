/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Data for a flag in a documentation comment.
 */
dbm.registerClass("com.developedbyme.compiler.compiledata.documentation.DocumentationFlagData", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.compiledata.documentation.DocumentationFlagData");
	
	//Self reference
	var DocumentationFlagData = dbm.importClass("com.developedbyme.compiler.compiledata.documentation.DocumentationFlagData");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.compiler.compiledata.documentation.DocumentationFlagData::_init");
		
		this.superCall();
		
		this.type = null;
		this.arguments = null;
		
		return this;
	};
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.type = null;
		this.arguments = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aType		String	The type that this flag is.
	 * @param	aArguments	Array	The arguments for this flag.
	 *
	 * @return	DocumentationFlagData	The newly created instance.
	 */
	staticFunctions.create = function(aType, aArguments) {
		var newDocumentationFlagData = (new ClassReference()).init();
		newDocumentationFlagData.type = aType;
		newDocumentationFlagData.arguments = aArguments;
		
		return newDocumentationFlagData;
	};
});