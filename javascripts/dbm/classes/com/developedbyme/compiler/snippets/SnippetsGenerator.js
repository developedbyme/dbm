/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Class that generate code snippets for import.
 */
dbm.registerClass("com.developedbyme.compiler.snippets.SnippetsGenerator", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.snippets.SnippetsGenerator");
	
	//Self reference
	var SnippetsGenerator = dbm.importClass("com.developedbyme.compiler.snippets.SnippetsGenerator");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Generates code that imports a class and runs it at start.
	 * Used for compiling standalone classes.
	 *
	 * @param	@aClassPath		String	The path to the class to generate code for.
	 * 
	 * @return	String	The generated code.
	 */
	staticFunctions.createApplicationStart = function(aClassPath) {
		var returnString = "";
		
		returnString += "dbm.runTempFunction(function() {";
		returnString += "	var RunningClass = dbm.importClass(\"" + aClassPath + "\");";
		returnString += "	dbm.addStartFunction(function() {";
		returnString += "		var runningInstance = (new RunningClass()).init();";
		returnString += "		runningInstance.start();";
		returnString += "	});";
		returnString += "});";
		
		return returnString;
	}; //End function createApplicationStart
	
	/**
	 * Generates an import statement for a class.
	 *
	 * @param	aClassPath		String	The path to the class to generate code for.
	 * 
	 * @return	String	The generated code.
	 */
	staticFunctions.createImport = function(aClassPath) {
		//console.log("com.developedbyme.compiler.snippets.SnippetsGenerator::createImport");
		//console.log(aClassPath);
		
		var className = ClassReference.getClassNameFromPath(aClassPath);
		return "var " + className + " = dbm.importClass(\"" + aClassPath + "\");"
	}; //End function createImport
	
	/**
	 * Gets the class name from a full path.
	 *
	 * @param	aClassPath		String	The path to get the name for.
	 *
	 * @return	String 	The name of the class.
	 */
	staticFunctions.getClassNameFromPath = function(aClassPath) {
		//console.log("com.developedbyme.compiler.snippets.SnippetsGenerator::getClassNameFromPath");
		//console.log(aClassPath);
		
		return aClassPath.substring(aClassPath.lastIndexOf(".")+1, aClassPath.length);
	}; //End function getClassNameFromPath
});