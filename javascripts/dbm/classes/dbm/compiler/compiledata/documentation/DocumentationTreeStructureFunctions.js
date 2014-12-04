/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Functions for handling a documentation tree structure.
 */
dbm.registerClass("dbm.compiler.compiledata.documentation.DocumentationTreeStructureFunctions", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.compiler.compiledata.documentation.DocumentationTreeStructureFunctions");
	
	//Self reference
	var DocumentationTreeStructureFunctions = dbm.importClass("dbm.compiler.compiledata.documentation.DocumentationTreeStructureFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Gets children of a type.
	 *
	 * @param	aItem	TreeStructureItem	The item to get children from.
	 * @param	aType	DocumentationTypes	The type of item you are looking for.
	 *
	 * @return	Array	The children of that matches the specified type.
	 */
	staticFunctions.getChildrenByType = function(aItem, aType) {
		//console.log("dbm.compiler.compiledata.documentation.DocumentationTreeStructureFunctions::getChildrenByType");
		
		var returnArray = new Array();
		
		var currentArray = aItem.getChildren();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentItem = currentArray[i];
			if(currentItem.data.type === aType) {
				returnArray.push(currentItem);
			}
		}
		
		return returnArray;
	}; //End function getChildrenByType
});