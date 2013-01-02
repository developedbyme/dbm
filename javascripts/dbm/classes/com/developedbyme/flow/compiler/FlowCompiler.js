dbm.registerClass("com.developedbyme.flow.compiler.FlowCompiler", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.compiler.FlowCompiler");
	//"use strict";
	
	var FlowCompiler = dbm.importClass("com.developedbyme.flow.compiler.FlowCompiler");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var FlowAnalyzeFunctions = dbm.importClass("com.developedbyme.flow.analyze.FlowAnalyzeFunctions");
	
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	var GhostProperty = dbm.importClass("com.developedbyme.core.objectparts.GhostProperty");
	var UpdateFunction = dbm.importClass("com.developedbyme.core.objectparts.UpdateFunction");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.compiler.FlowCompiler::_init");
		
		this.superCall();
		
		this._propertyIds = NamedArray.create(true);
		
		//console.log("//com.developedbyme.flow.compiler.FlowCompiler::_init");
		return this;
	};
	
	objectFunctions._getInputCode = function(aInputProperties, aVariableNames, aPrefix) {
		var returnString = "";
		
		var currentArray = aInputProperties.getNamesArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentName = currentArray[i];
			var currentObject = aInputProperties.getObject(currentName);
			var variableName = aVariableNames.getObject(currentObject);
			returnString += aPrefix + "var " + variableName + " = this.getInputProperty(\"" + currentName + "\").getValueWithoutFlow();" + "\n";
		}
		
		return returnString;
	};
	
	objectFunctions._getOutputCode = function(aInputProperties, aVariableNames, aFlowUpdateNumberVariableName, aPrefix) {
		var returnString = "";
		
		var currentArray = aInputProperties.getNamesArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentName = currentArray[i];
			var currentObject = aInputProperties.getObject(currentName);
			var variableName = aVariableNames.getObject(currentObject);
			returnString += aPrefix + "this.getOutputProperty(\"" + currentName + "\").setValueWithFlow(" + variableName + ", " + aFlowUpdateNumberVariableName +");" + "\n";
		}
		
		return returnString;
	};
	
	objectFunctions.compileGroup = function(aFlowGroup) {
		console.log("com.developedbyme.flow.compiler.FlowCompiler::_compileGroup");
		var inputProperties = aFlowGroup.getInputPropertiesNamedArray();
		var outputProperties = aFlowGroup.getOutputPropertiesNamedArray();
		
		var pathArrays = new Array();
		
		var currentArray = inputProperties.getObjectsArray();
		var currentArrayLength = currentArray.length;
		var currentArray2 = outputProperties.getObjectsArray();
		var currentArray2Length = currentArray2.length;
		for(var i = 0; i < currentArrayLength; i++) {
			for(var j = 0; j < currentArray2Length; j++) {
				FlowAnalyzeFunctions.findConnectionBetweenProperties(currentArray[i], currentArray2[j], pathArrays);
			}
		}
		
		console.log(pathArrays);
		
		var variableNames = NamedArray.create(true);
		var updateFunctions = new Array();
		
		var numberOfVariables = 0;
		var newVariableName = null;
		
		var currentArray = pathArrays;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			newVariableName = null;
			var currentArray2 = currentArray[i];
			var currentArray2Length = currentArray2.length;
			for(var j = 0; j < currentArray2Length; j++) {
				var currentConnection = currentArray2[j];
				if(currentConnection instanceof UpdateFunction) {
					if(ArrayFunctions.indexOfInArray(updateFunctions, currentConnection) == -1) {
						updateFunctions.push(currentConnection);
					}
					newVariableName = null;
				}
				else if(currentConnection instanceof AnyChangeMultipleInputProperty || currentConnection instanceof GhostProperty) {
					//MENOTE: do nothing
					newVariableName = null;
				}
				else {
					if(!variableNames.hasObject(currentConnection)) {
						if(newVariableName == null) {
							newVariableName = "variable_" + (numberOfVariables++);
						}
						variableNames.addObject(currentConnection, newVariableName);
					}
				}
			}
		}
		
		var flowUpdateNumberVaraibleName = "aFlowUpdateNumber";
		var returnCode = "function("+ flowUpdateNumberVaraibleName + ") {" + "\n";
		
		returnCode += this._getInputCode(inputProperties, variableNames, "	");
		//METODO
		returnCode += this._getOutputCode(outputProperties, variableNames, flowUpdateNumberVaraibleName, "	");
		
		returnCode += "};";
		
		return returnCode;
	};
	
	/**
	 * Performs the destruction of this class.
	 */
	objectFunctions.performDestroy = function() {
		
		this.superCall();
	};
	
	/**
	 * Sets all the references to null.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
	
	staticFunctions.create = function() {
		//console.log("com.developedbyme.flow.compiler.FlowCompiler::create (static)");
		var newFlowCompiler = (new ClassReference()).init();
		return newFlowCompiler;
	}
});