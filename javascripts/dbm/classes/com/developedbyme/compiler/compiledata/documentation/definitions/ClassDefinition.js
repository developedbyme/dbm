/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Definition for a class documentation.
 */
dbm.registerClass("com.developedbyme.compiler.compiledata.documentation.definitions.ClassDefinition", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.compiledata.documentation.definitions.ClassDefinition");
	
	//Self reference
	var ClassDefinition = dbm.importClass("com.developedbyme.compiler.compiledata.documentation.definitions.ClassDefinition");
	
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
		//console.log("com.developedbyme.compiler.compiledata.documentation.definitions.ClassDefinition::_init");
		
		this.superCall();
		
		this.classPath = null;
		this.extendedClassPath = null;
		this.dependencies = new Array();
		
		return this;
	};
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.classPath = null;
		this.extendedClassPath = null;
		this.dependencies = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @praam	aClassPath			String	The path to the class.
	 * @param	aExtendedClassPath	String	The path to the class that is extended.
	 *
	 * @return	ClassDefinition	The newly created instance.
	 */
	staticFunctions.create = function(aClassPath, aExtendedClassPath) {
		var newClassDefinition = (new ClassReference()).init();
		newClassDefinition.classPath = aClassPath;
		newClassDefinition.extendedClassPath = aExtendedClassPath;
		
		return newClassDefinition;
	};
});