/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.compiler.snippets.SnippetsGenerator", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.snippets.SnippetsGenerator");
	
	var SnippetsGenerator = dbm.importClass("com.developedbyme.compiler.snippets.SnippetsGenerator");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
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
	};
});