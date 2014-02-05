dbm.registerClass("com.developedbyme.utils.native.array.ArraySortingFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.array.ArraySortingFunctions");
	//"use strict";
	
	var ArraySortingFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArraySortingFunctions");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	
	staticFunctions.caseInsensitive = function(aValue1, aValue2) {
		aValue1 = aValue1.toLowerCase();
		aValue2 = aValue2.toLowerCase();
		return ClassReference._compareValues(aValue1, aValue2);
	};
	
	staticFunctions.trimmedCaseInsensitive = function(aValue1, aValue2) {
		aValue1 = StringFunctions.trim(aValue1.toLowerCase());
		aValue2 = StringFunctions.trim(aValue2.toLowerCase());
		return ClassReference._compareValues(aValue1, aValue2);
	};
	
	staticFunctions._compareValues = function(aValue1, aValue2) {
		return ((aValue1 === aValue2) ? 0 : ((aValue1 > aValue2) ? 1 : 0));
	};
});