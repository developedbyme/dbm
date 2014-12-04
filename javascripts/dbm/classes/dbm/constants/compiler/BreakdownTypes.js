/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Types of breakdown parts when compiling a script.
 */
dbm.registerClass("dbm.constants.compiler.BreakdownTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("dbm.constants.compiler.BreakdownTypes");
	
	//Self reference
	var BreakdownTypes = dbm.importClass("dbm.constants.compiler.BreakdownTypes");
	
	staticFunctions.ASSIGN_VALUE = "assignValue";
	staticFunctions.ASSOCIATIVE_VARIABLE_ON_OBJECT_REFERENCE = "associativeVariableOnObjectReference";
	staticFunctions.CALL_FUNCTION = "callFunction";
	staticFunctions.CASE = "case";
	staticFunctions.CATCH = "catch";
	staticFunctions.CODE = "code";
	staticFunctions.COMMENT = "comment";
	staticFunctions.CONDITION = "condition";
	staticFunctions.DECLARE_VARIABLE = "declareVariable";
	staticFunctions.DEFAULT = "default";
	staticFunctions.DELETE = "delete";
	staticFunctions.DOCUMENTATION = "documentation";
	staticFunctions.EVALUATION = "evaluation";
	staticFunctions.FINALLY = "finally";
	staticFunctions.FOR = "for";
	staticFunctions.FUNCTION_DECLARATION = "functionDeclaration";
	staticFunctions.KEYWORD = "keyword";
	staticFunctions.LINE = "line";
	staticFunctions.LIST = "list";
	staticFunctions.LITERAL_ARRAY = "literalArray";
	staticFunctions.LITERAL_NAME = "literalName"
	staticFunctions.LITERAL_OBJECT = "literalObject";
	staticFunctions.NAMED_FUNCTION_DECLARATION = "namedFunctionDeclaration";
	staticFunctions.NEW = "new";
	staticFunctions.NUMBER = "number";
	staticFunctions.RETURN = "return";
	staticFunctions.STRING = "string";
	staticFunctions.SWITCH = "switch";
	staticFunctions.TRY = "try";
	staticFunctions.VARIABLE_ON_OBJECT_REFERENCE = "variableOnObjectReference";
	staticFunctions.VARIABLE_REFERENCE = "variableReference";
	staticFunctions.WHILE = "while";
	
});