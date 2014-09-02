/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Definition for a variable documentation.
 */
dbm.registerClass("com.developedbyme.compiler.compiledata.documentation.definitions.VariableDefinition", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.compiledata.documentation.definitions.VariableDefinition");
	
	//Self reference
	var VariableDefinition = dbm.importClass("com.developedbyme.compiler.compiledata.documentation.definitions.VariableDefinition");
	
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
		//console.log("com.developedbyme.compiler.compiledata.documentation.definitions.VariableDefinition::_init");
		
		this.superCall();
		
		this.variableName = null;
		this.value = null;
		
		return this;
	};
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.variableName = null;
		this.value = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aName	String		The name of the function.
	 * @param	aValue	*			The value that varaible is set to.
	 *
	 * @return	VariableDefinition	The newly created instance.
	 */
	staticFunctions.create = function(aName, aValue) {
		var newVariableDefinition = (new ClassReference()).init();
		
		newVariableDefinition.variableName = aName;
		newVariableDefinition.value = aValue;
		
		return newVariableDefinition;
	};
});