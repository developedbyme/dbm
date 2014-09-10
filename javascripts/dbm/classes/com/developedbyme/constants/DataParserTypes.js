/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.constants.DataParserTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.DataParserTypes");
	
	var DataParserTypes = dbm.importClass("com.developedbyme.constants.DataParserTypes");
	
	//Basic
	staticFunctions.STRING = "string";
	staticFunctions.FLOAT = "float";
	staticFunctions.NUMBER = "number";
	staticFunctions.BOOLEAN = "boolean";
	staticFunctions.ARRAY = "array";
	staticFunctions.OBJECT = "object";
	staticFunctions.NULL = "null";
	
	staticFunctions.POINTS_ARRAY = "pointsArray";
	staticFunctions.TREE_STRUCTURE = "treeStructure";
	staticFunctions.TREE_STRUCTURE_ITEM = "treeStructureItem";
	
	//Text
	staticFunctions.UPPER_CASE_TEXT = "upperCaseText";
	staticFunctions.LOWER_CASE_TEXT = "lowerCaseText";
	staticFunctions.TEXT_REPLACEMENT = "textReplacement";
	
	//Complex
	staticFunctions.KEY_VALUE = "keyValue";
	staticFunctions.DBM_OBJECT = "dbmObject";
	
	//Object
	staticFunctions.STRING_ALIASES = "stringAliases";
});