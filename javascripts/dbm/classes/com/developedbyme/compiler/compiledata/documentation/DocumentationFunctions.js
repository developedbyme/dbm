/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Functions for documenting a broken down script.
 */
dbm.registerClass("com.developedbyme.compiler.compiledata.documentation.DocumentationFunctions", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.compiledata.documentation.DocumentationFunctions");
	
	//Self reference
	var DocumentationFunctions = dbm.importClass("com.developedbyme.compiler.compiledata.documentation.DocumentationFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var DocumentedItem = dbm.importClass("com.developedbyme.compiler.compiledata.documentation.DocumentedItem");
	var DocumentationData = dbm.importClass("com.developedbyme.compiler.compiledata.documentation.DocumentationData");
	var ClassDefinition = dbm.importClass("com.developedbyme.compiler.compiledata.documentation.definitions.ClassDefinition");
	var FunctionDefinition = dbm.importClass("com.developedbyme.compiler.compiledata.documentation.definitions.FunctionDefinition");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var BreakdownFunctions = dbm.importClass("com.developedbyme.compiler.breakdown.BreakdownFunctions");
	var RegExpFunctions = dbm.importClass("com.developedbyme.utils.native.regexp.RegExpFunctions");
	
	//Constants
	var DocumentationTypes = dbm.importClass("com.developedbyme.constants.compiler.DocumentationTypes");
	var BreakdownTypes = dbm.importClass("com.developedbyme.constants.compiler.BreakdownTypes");
	var DbmBreakdownTypes = dbm.importClass("com.developedbyme.constants.compiler.DbmBreakdownTypes");
	
	
	/**
	 * Documents a dbm class registration breakdown.
	 *
	 * @param	aBreakdown			ScriptBreakdownDbmRegisterClassPart		The code breakdown to document.
	 * @param	aDocumentationData	DocumentationData						The documentation that has been set for this breakdown.
	 *
	 * @return	DocumentedItem	The new documentation.
	 */
	staticFunctions.documentDbmClass = function(aBreakdown, aDocumentationData) {
		//console.log("com.developedbyme.compiler.compiledata.documentation.DocumentationFunctions::documentDbmClass");
		//console.log(aBreakdown, aDocumentationData);
		
		var returnData = DocumentedItem.create(DocumentationTypes.CLASS, aBreakdown.getScript());
		
		if(!VariableAliases.isSet(aDocumentationData)) {
			aDocumentationData = DocumentationData.createEmpty();
		}
		returnData.documentation = aDocumentationData;
		var childBreakdowns = aBreakdown.getChildBreakdowns();
		returnData.definition = ClassDefinition.create(BreakdownFunctions.getValueOrNull(childBreakdowns[0]), BreakdownFunctions.getValueOrNull(childBreakdowns[1]));
		
		return returnData;
	}; //End function documentDbmClass
	
	/**
	 * Documents a named function breakdown.
	 *
	 * @param	aBreakdown			ScriptBreakdownNamedFunctionDeclarationPart		The code breakdown to document.
	 * @param	aDocumentationData	DocumentationData								The documentation that has been set for this breakdown.
	 *
	 * @return	DocumentedItem	The new documentation.
	 */
	staticFunctions.documentNamedFunction = function(aBreakdown, aDocumentationData) {
		//console.log("com.developedbyme.compiler.compiledata.documentation.DocumentationFunctions::documentNamedFunction");
		//console.log(aBreakdown, aDocumentationData);
		
		var type = DocumentationTypes.FUNCTION;
		
		var nameBreakdown = aBreakdown.getNameBreakdown();
		
		var parentClassBreakdown = BreakdownFunctions.getParentByType(aBreakdown, DbmBreakdownTypes.REGISTER_CLASS);
		if(parentClassBreakdown !== null) {
			var localFunctionsVariableName = parentClassBreakdown.getLocalFunctionsVariableName();
			var staticFunctionsVariableName = parentClassBreakdown.getStaticFunctionsVariableName();
			
			if(nameBreakdown.getType() === BreakdownTypes.VARIABLE_ON_OBJECT_REFERENCE) {
				var objectBreakdown = nameBreakdown.getObject();
				if(objectBreakdown.getType() === BreakdownTypes.VARIABLE_REFERENCE) {
					var objectName = objectBreakdown.getVariableName();
					if(objectName === localFunctionsVariableName) {
						type = DocumentationTypes.LOCAL_CLASS_FUNCTION;
					}
					else if(objectName === staticFunctionsVariableName) {
						type = DocumentationTypes.STATIC_CLASS_FUNCTION;
					}
				}
			}
		}
		else {
			console.log(aBreakdown);
		}
		
		var returnData = DocumentedItem.create(type, aBreakdown.getScript());
		
		if(!VariableAliases.isSet(aDocumentationData)) {
			aDocumentationData = DocumentationData.createEmpty();
		}
		returnData.documentation = aDocumentationData;
		
		var functionBreakdown = aBreakdown.getFunctionBreakdown();
		
		returnData.definition = FunctionDefinition.create(nameBreakdown.getVariableName(), functionBreakdown.getArgumentNames(), BreakdownFunctions.checkForReturnStatement(functionBreakdown));
		//METODO: verify order of arguments
		
		return returnData;
	}; //End function documentNamedFunction
	
	
	/**
	 * Gets the full class path for a name.
	 * 
	 * @param	aName			String			The name of the class.
	 * @param	aClassPaths		Array<String>	List of the full class paths.
	 *
	 * @return	Array	The array of matching class paths.
	 */
	staticFunctions.getFullClassPathsByName = function(aName, aClassPaths) {
		//console.log("com.developedbyme.compiler.compiledata.documentation.DocumentationFunctions::getFullClassPathsByName");
		var returnArray = new Array();
		
		var nameOfClassRegExpString = "^(.*\\.)?" + RegExpFunctions.getSafeText(aName) + "$";
		var nameOfClassRegExp = new RegExp(nameOfClassRegExpString);
		
		var currentArray = aClassPaths;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentClassPath = currentArray[i];
			if(nameOfClassRegExp.test(currentClassPath)) {
				returnArray.push(currentClassPath);
			}
		}
		
		return returnArray;
	}; //End function getFullClassPathsByName
});