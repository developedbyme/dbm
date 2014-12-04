/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Generator that compiles after effects expression so that they can be shown in real-time.
 */
dbm.registerClass("dbm.utils.canvas.generators.aftereffectsexpressions.ExpressionCompiler", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.canvas.generators.aftereffectsexpressions.ExpressionCompiler");
	
	//Self reference
	var ExpressionCompiler = dbm.importClass("dbm.utils.canvas.generators.aftereffectsexpressions.ExpressionCompiler");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependnecies
	var ScriptBreakdownVariableReferencePart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownVariableReferencePart");
	var ScriptBreakdownGetVariableOnObjectPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownGetVariableOnObjectPart");
	var ScriptBreakdownEvaluationPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownEvaluationPart");
	var ScriptBreakdownCallFunctionPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownCallFunctionPart");
	var ScriptBreakdownStringPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownStringPart");
	
	//Utils
	var StringFunctions = dbm.importClass("dbm.utils.native.string.StringFunctions");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var GetNamedArrayValueObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetNamedArrayValueObject");
	var DataSelector = dbm.importClass("dbm.utils.data.DataSelector");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.canvas.generators.aftereffectsexpressions.ExpressionCompiler::_init");
		
		this.superCall();
		
		this._compositions = null;
		this._currentComposition = null;
		this._currentLayer = null;
		
		this._time = null;
		
		return this;
	};
	
	objectFunctions.setCompositions = function(aCompositions) {
		this._compositions = aCompositions;
		
		return this;
	};
	
	objectFunctions.setCurrentComposition = function(aComposition) {
		this._currentComposition = aComposition;
		
		return this;
	};
	
	objectFunctions.setCurrentLayer = function(aCurrentLayer) {
		this._currentLayer = aCurrentLayer;
		
		return this;
	};
	
	objectFunctions.setTime = function(aTime) {
		this._time = aTime;
		
		return this;
	};
	
	objectFunctions.getReference = function(aBreakdown) {
		//console.log("dbm.utils.canvas.generators.aftereffectsexpressions.ExpressionCompiler::getReference");
		//METODO
		
		if(aBreakdown instanceof ScriptBreakdownVariableReferencePart) {
			var currentVariableName = aBreakdown.getVariableName();
			if(currentVariableName === "thisComp") {
				return {"type": "composition", "value": this._currentComposition, "selectionPath": ""};
			}
			if(currentVariableName === "layer") {
				return {"type": "layer", "value": this._currentLayer, "selectionPath": ""};
			}
			//METODO: all other base variables
		}
		else if(aBreakdown instanceof ScriptBreakdownGetVariableOnObjectPart) {
			var variableName = aBreakdown.getVariableName();
			var childBreakdowns = aBreakdown.getChildBreakdowns();
			var baseObject = this.getReference(childBreakdowns[0]);
			switch(baseObject.type) {
				case "composition":
					if(variableName === "layer") {
						return {"type": "layerSelect", "value": baseObject.value, "selectionPath": ""};
					}
					break;
				case "layer":
					if(variableName === "mask") {
						return {"type": "maskSelect", "value": baseObject.value, "selectionPath": baseObject.selectionPath};
					}
					else if(variableName === "effect") {
						return {"type": "effectSelect", "value": baseObject.value, "selectionPath": baseObject.selectionPath};
					}
					else if(variableName === "content") {
						return {"type": "contentSelect", "value": baseObject.value, "selectionPath": baseObject.selectionPath};
					}
					break;
				case "property":
					if(variableName === "effect") {
						return {"type": "effectSelect", "value": baseObject.value, "selectionPath": baseObject.selectionPath};
					}
					else if(variableName === "content") {
						return {"type": "contentSelect", "value": baseObject.value, "selectionPath": baseObject.selectionPath};
					}
					else {
						return {"type": "property", "value": baseObject.value, "selectionPath": baseObject.selectionPath + "/" + StringFunctions.convertToCamelCase(variableName)};
					}
					break;
			}
		}
		else if(aBreakdown instanceof ScriptBreakdownEvaluationPart) {
			var childBreakdowns = aBreakdown.getChildBreakdowns();
			var secondChild = childBreakdowns[1];
			if(secondChild instanceof ScriptBreakdownCallFunctionPart) {
				var baseObject = this.getReference(childBreakdowns[0]);
				switch(baseObject.type) {
					case "layerSelect":
						return {"type": "layer", "value": this._selectLayer(baseObject.value, secondChild), "selectionPath": ""};
					case "maskSelect":
						return {"type": "property", "value": baseObject.value, "selectionPath": this._generateSelectPath(baseObject.selectionPath, secondChild, "mask")};
					case "effectSelect":
						return {"type": "property", "value": baseObject.value, "selectionPath": this._generateSelectPath(baseObject.selectionPath, secondChild, "effect")};
					case "contentSelect":
						return {"type": "property", "value": baseObject.value, "selectionPath": this._generateSelectPath(baseObject.selectionPath, secondChild, "contents")};
				}
			}
		}
		
		return null; //MEDEBUG
	};
	
	objectFunctions._selectLayer = function(aCompositionData, aCallBreakdown) {
		//console.log("dbm.utils.canvas.generators.aftereffectsexpressions.ExpressionCompiler::_selectLayer");
		//console.log(aCompositionData, aCallBreakdown);
		
		var firstArgument = aCallBreakdown.getChildBreakdowns()[0];
		if(firstArgument instanceof ScriptBreakdownStringPart) {
			var layerName = firstArgument.getString();
			
			var selectedLayer = DataSelector.getFirstEqualMatchInTreeStructure(
				GetNamedArrayValueObject.createCommand(
					GetVariableObject.createCommand(
						GetVariableObject.createSelectOnBaseObjectCommand("data"),
						"metaData"
					),
					"name"
				),
				layerName,
				aCompositionData.data.getRoot()
			);
			
			if(selectedLayer !== null) {
				return selectedLayer.data;
			}
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_selectLayer", "Layer " + layerName + " doesn't exist.");
			return null;
		}
		//METODO: implement index selection
		
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_selectLayer", "Compiler can only handle strings for layer selection.");
		return null;
	};
	
	objectFunctions._generateSelectPath = function(aCurrentPath, aCallBreakdown, aType) {
		//console.log("dbm.utils.canvas.generators.aftereffectsexpressions.ExpressionCompiler::_generateSelectPath");
		//console.log(aCurrentPath, aCallBreakdown, aType);
		
		var firstArgument = aCallBreakdown.getChildBreakdowns()[0];
		if(firstArgument instanceof ScriptBreakdownStringPart) {
			return aCurrentPath + "/" + aType + "/" + StringFunctions.convertToCamelCase(firstArgument.getString());
		}
		
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_generateSelectPath", "Compiler can only handle strings for selection.");
		return null;
	}
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newScriptBreakDown = (new ClassReference()).init();
		return newScriptBreakDown;
	};
});