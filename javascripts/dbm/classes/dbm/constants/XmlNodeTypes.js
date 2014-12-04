/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.XmlNodeTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("dbm.constants.XmlNodeTypes");
	//"use strict";
	
	var XmlNodeTypes = dbm.importClass("dbm.constants.XmlNodeTypes");
	
	staticFunctions.ELEMENT_NODE = 1;
	staticFunctions.ATTRIBUTE_NODE = 2;
	staticFunctions.TEXT_NODE = 3;
	staticFunctions.CDATA_SECTION_NODE = 4;
	staticFunctions.ENTITY_REFERENCE_NODE = 5;
	staticFunctions.ENTITY_NODE = 6;
	staticFunctions.PROCESSING_INSTRUCTION_NODE = 7;
	staticFunctions.COMMENT_NODE = 8;
	staticFunctions.DOCUMENT_NODE = 9;
	staticFunctions.DOCUMENT_TYPE_NODE = 10;
	staticFunctions.DOCUMENT_FRAGMENT_NODE = 11;
	staticFunctions.NOTATION_NODE = 12;
	
});