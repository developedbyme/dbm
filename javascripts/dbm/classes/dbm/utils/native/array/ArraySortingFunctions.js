/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Sorting functions for arrays.
 */
dbm.registerClass("dbm.utils.native.array.ArraySortingFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.native.array.ArraySortingFunctions");
	//"use strict";
	
	//Self reference
	var ArraySortingFunctions = dbm.importClass("dbm.utils.native.array.ArraySortingFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var StringFunctions = dbm.importClass("dbm.utils.native.string.StringFunctions");
	
	//Constants
	
	
	/**
	 * Sorts strings without considering case.
	 *
	 * @param	aValue1		String	The first value to compare.
	 * @param	aValue2		String	The second value to compare.
	 *
	 * @return	Number	The sorting order.
	 */
	staticFunctions.caseInsensitive = function(aValue1, aValue2) {
		aValue1 = aValue1.toLowerCase();
		aValue2 = aValue2.toLowerCase();
		return ClassReference._compareValues(aValue1, aValue2);
	};
	
	/**
	 * Sorts strings without considering case and white space in the beginning and end.
	 *
	 * @param	aValue1		String	The first value to compare.
	 * @param	aValue2		String	The second value to compare.
	 *
	 * @return	Number	The sorting order.
	 */
	staticFunctions.trimmedCaseInsensitive = function(aValue1, aValue2) {
		aValue1 = StringFunctions.trim(aValue1.toLowerCase());
		aValue2 = StringFunctions.trim(aValue2.toLowerCase());
		return ClassReference._compareValues(aValue1, aValue2);
	};
	
	/**
	 * Sorts class paths based on their class name.
	 *
	 * @param	aValue1		String	The first value to compare.
	 * @param	aValue2		String	The second value to compare.
	 *
	 * @return	Number	The sorting order.
	 */
	staticFunctions.classPathsByName = function(aValue1, aValue2) {
		aValue1 = aValue1.substring(aValue1.lastIndexOf(".")+1, aValue1.length).toLowerCase();
		aValue2 = aValue2.substring(aValue2.lastIndexOf(".")+1, aValue2.length).toLowerCase();
		return ClassReference._compareValues(aValue1, aValue2);
	};
	
	/**
	 * Compare values and returns an integer for the sorting order.
	 *
	 * @param	aValue1		*	The first value to compare.
	 * @param	aValue2		*	The second value to compare.
	 *
	 * @return	Number	The sorting order.
	 */
	staticFunctions._compareValues = function(aValue1, aValue2) {
		return ((aValue1 === aValue2) ? 0 : ((aValue1 > aValue2) ? 1 : -1));
	};
});