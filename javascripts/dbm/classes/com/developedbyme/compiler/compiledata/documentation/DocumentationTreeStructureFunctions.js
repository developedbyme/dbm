/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Functions for handling a documentation tree structure.
 */
dbm.registerClass("com.developedbyme.compiler.compiledata.documentation.DocumentationTreeStructureFunctions", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.compiledata.documentation.DocumentationTreeStructureFunctions");
	
	//Self reference
	var DocumentationTreeStructureFunctions = dbm.importClass("com.developedbyme.compiler.compiledata.documentation.DocumentationTreeStructureFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
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
		//console.log("com.developedbyme.compiler.compiledata.documentation.DocumentationTreeStructureFunctions::getChildrenByType");
		
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