/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Generator for parser functions.
 */
dbm.registerClass("dbm.utils.data.lazy.ParserGenerator", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.data.lazy.ParserGenerator");
	//"use strict";
	
	//Self reference
	var ParserGenerator = dbm.importClass("dbm.utils.data.lazy.ParserGenerator");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var TreeStructure = dbm.importClass("dbm.utils.data.treestructure.TreeStructure");
	var LazyData = dbm.importClass("dbm.utils.data.lazy.LazyData");
	var LazyObject = dbm.importClass("dbm.utils.data.lazy.LazyObject");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var CreateAndInitObjectReevaluationObject = dbm.importClass("dbm.utils.reevaluation.creationreevaluation.CreateAndInitObjectReevaluationObject");
	var CallFunctionObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.CallFunctionObject");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var GetNodeValueReevaluationObject = dbm.importClass("dbm.utils.reevaluation.xmlreevaluation.GetNodeValueReevaluationObject");
	var GetNodeValuesReevaluationObject = dbm.importClass("dbm.utils.reevaluation.xmlreevaluation.GetNodeValuesReevaluationObject");
	var GetChildNodeReevaluationObject = dbm.importClass("dbm.utils.reevaluation.xmlreevaluation.GetChildNodeReevaluationObject");
	var GetChildNodesReevaluationObject = dbm.importClass("dbm.utils.reevaluation.xmlreevaluation.GetChildNodesReevaluationObject");
	var GetAttributeReevaluationObject = dbm.importClass("dbm.utils.reevaluation.xmlreevaluation.GetAttributeReevaluationObject");
	var CreateAndInitObjectReevaluationObject = dbm.importClass("dbm.utils.reevaluation.creationreevaluation.CreateAndInitObjectReevaluationObject");
	
	//Constants
	
	
	/**
	 * Creates a parser tree structure.
	 */
	staticFunctions.createTreeStructure = function() {
		
		var parserTreeStructure = TreeStructure.create();
		
		parserTreeStructure.getRoot().setAttribute("defaultParser", "__defaultParser");
		parserTreeStructure.getRoot().setAttribute("objectParser", "__objectParser");
		
		return parserTreeStructure;
	};
	
	staticFunctions.createXmlNodeValueParser = function() {
		return GetNodeValueReevaluationObject.createCommand(GetVariableObject.createSelectDataCommand());
	};
	
	staticFunctions.createNamedDataNode = function(aTreeStructureItem) {
		
		var reevaluationObject = CreateAndInitObjectReevaluationObject.createCommand(LazyData, [
			CallFunctionObject.createCallFunctionOnPerformingObjectCommand("setData", [
				GetChildNodeReevaluationObject.createCommand(
					GetVariableObject.createCommandsForPath("data/data"),
					GetVariableObject.createCommandsForPath("data/selection")
				)
			]),
			CallFunctionObject.createCallFunctionOnPerformingObjectCommand("setTreeStructureItem", [GetVariableObject.createCommandsForPath("data/selectedTreeStrcutureItem")])
		]);
		
		aTreeStructureItem.data = reevaluationObject;
		var objectParserName = aTreeStructureItem.getInheritedAttribute("objectParser");
		var objectParser = aTreeStructureItem.getByPath(objectParserName);
		objectParser.data = ClassReference.createXmlNodeValueParser();
	};
	
	staticFunctions.createNamedAttribute = function(aTreeStructureItem) {
		var reevaluationObject = CreateAndInitObjectReevaluationObject.createCommand(LazyData, [
			CallFunctionObject.createCallFunctionOnPerformingObjectCommand("setParsedData", [
				GetAttributeReevaluationObject.createCommand(
					GetVariableObject.createCommandsForPath("data/data"),
					GetVariableObject.createCommandsForPath("data/selection")
				)
			])
		]);
		
		aTreeStructureItem.data = reevaluationObject;
	};
	
	staticFunctions.createXmlChildObjectParser = function(aTreeStructureItem) {
		var defaultParserName = aTreeStructureItem.getInheritedAttribute("defaultParser");
		var defaultParser = aTreeStructureItem.getByPath(defaultParserName);
		ClassReference.createNamedDataNode(defaultParser);
	};
	
	staticFunctions.createArrayIndexedXmlDataNodes = function(aTreeStructureItem) {
		var reevaluationObject = CreateAndInitObjectReevaluationObject.createCommand(LazyObject, [
			CallFunctionObject.createCallFunctionOnPerformingObjectCommand("setData", [
				GetVariableObject.createCommand(
					GetVariableObject.createCommandsForPath("data/data"),
					GetVariableObject.createCommandsForPath("data/selection")
				)
			]),
			CallFunctionObject.createCallFunctionOnPerformingObjectCommand("setTreeStructureItem", [GetVariableObject.createCommandsForPath("data/selectedTreeStrcutureItem")])
		]);
		
		aTreeStructureItem.data = reevaluationObject;
		var defaultParserName = aTreeStructureItem.getInheritedAttribute("defaultParser");
		var defaultParser = aTreeStructureItem.getByPath(defaultParserName);
		ClassReference.createNamedDataNode(defaultParser);
	};
	
	staticFunctions.createNodeList = function(aTreeStructureItem, aNodeName) {
		var reevaluationObject = CreateAndInitObjectReevaluationObject.createCommand(LazyData, [
			CallFunctionObject.createCallFunctionOnPerformingObjectCommand("setData", [
				GetChildNodesReevaluationObject.createCommand(
					GetVariableObject.createCommandsForPath("data/data"),
					aNodeName
				)
			]),
			CallFunctionObject.createCallFunctionOnPerformingObjectCommand("setTreeStructureItem", [GetVariableObject.createCommandsForPath("data/selectedTreeStrcutureItem")])
		]);
		
		aTreeStructureItem.data = reevaluationObject;
		var objectParserName = aTreeStructureItem.getInheritedAttribute("objectParser");
		var objectParser = aTreeStructureItem.getByPath(objectParserName);
		objectParser.data = GetNodeValuesReevaluationObject.createCommand(GetVariableObject.createSelectDataCommand());
	};
});