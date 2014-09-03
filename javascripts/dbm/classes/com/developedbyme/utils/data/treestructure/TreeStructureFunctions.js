/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Functions for manipulating a tree structure.
 */
dbm.registerClass("com.developedbyme.utils.data.treestructure.TreeStructureFunctions", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.treestructure.TreeStructureFunctions");
	//"use strict";
	
	//Self reference
	var TreeStructureFunctions = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureFunctions");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Gets items by matching an attribute.
	 *
	 * @param	aTreeStructureItems		Array<TreeStructureItem>	The list of items to search in.
	 * @param	aAttributeName			String						The name of the attribute to check.
	 * @param	aMatchValue				*							The value that the attribute should match.
	 * @param	aReturnArray			Array						The array that gets filled with the results.
	 */
	staticFunctions.getItemsByAttribute = function(aTreeStructureItems, aAttributeName, aMatchValue, aReturnArray) {
		//console.log("com.developedbyme.utils.data.treestructure.TreeStructureFunctions::getItemsByAttribute");
		
		var currentArray = aTreeStructureItems;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentItem	= currentArray[i];
			if(currentItem.hasAttribute(aAttributeName) && currentItem.getAttribute(aAttributeName) === aMatchValue) {
				aReturnArray.push(currentItem);
			}
		}
	};
	
	/**
	 * Gets items by seeing if an attribute is missing.
	 *
	 * @param	aTreeStructureItems		Array<TreeStructureItem>	The list of items to search in.
	 * @param	aAttributeName			String						The name of the attribute to check for.
	 * @param	aReturnArray			Array						The array that gets filled with the results.
	 */
	staticFunctions.getItemsWithoutAttribute = function(aTreeStructureItems, aAttributeName, aReturnArray) {
		//console.log("com.developedbyme.utils.data.treestructure.TreeStructureFunctions::getItemsWithoutAttribute");
		
		var currentArray = aTreeStructureItems;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentItem	= currentArray[i];
			if(!currentItem.hasAttribute(aAttributeName)) {
				aReturnArray.push(currentItem);
			}
		}
	};
});