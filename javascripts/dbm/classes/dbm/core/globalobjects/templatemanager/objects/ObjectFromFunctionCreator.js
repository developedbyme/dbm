/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.templatemanager.objects.ObjectFromFunctionCreator", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.templatemanager.objects.ObjectFromFunctionCreator");
	
	var ObjectFromFunctionCreator = dbm.importClass("dbm.core.globalobjects.templatemanager.objects.ObjectFromFunctionCreator");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var ComplexObjectManipulation = dbm.importClass("dbm.utils.reevaluation.complexreevaluation.ComplexObjectManipulation");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.templatemanager.objects.ObjectFromFunctionCreator::_init");
		
		this.superCall();
		
		this._reevaluationObject = null;
		this._argumentNamesArray = new Array();
		
		return this;
	};
	
	objectFunctions.createObject = function(/* ... aArgumentsArray */) {
		var aArgumentsArray = arguments;
		
		return this._reevaluationObject.reevaluate(aArgumentsArray);
	};
	
	objectFunctions.setTemplate = function(aObject) {
		
		this._reevaluationObject = ComplexObjectManipulation.createReevaluationFromTemplate(aObject);
		
		return this;
	};
	
	objectFunctions.setArgumentNames = function(aNamesArray) {
		
		this._argumentNamesArray = ArrayFunctions.copyArray(aNamesArray);
		
		return this;
	};
	
	objectFunctions.insertArgumentByName = function(aName, aPath, aWithDefault) {
		
		aWithDefault = VariableAliases.valueWithDefault(aWithDefault, false);
		
		var index = ArrayFunctions.indexOfInArray(this._argumentNamesArray, aName);
		
		if(index === -1) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "insertArgumentByName", "Function doesn't have any argument named " + aName + ".");
			return this;
		}
		
		this.insertArgumentByIndex(index, aPath, aWithDefault);
		
		return this;
	};
	
	objectFunctions.insertArgumentByIndex = function(aIndex, aPath, aWithDefault) {
		
		aWithDefault = VariableAliases.valueWithDefault(aWithDefault, false);
		
		var indexSelector = GetVariableObject.createSelectOnBaseObjectCommand(aIndex);
		
		this._reevaluationObject = ComplexObjectManipulation.replaceObjectInsideReevaluationObject(this._reevaluationObject, aPath, indexSelector, aWithDefault);
		
		return this;
	};
	
	staticFunctions.create = function(aTemplateObject, aArgumentNamesArray) {
		
		var newObjectFromFunctionCreator = (new ObjectFromFunctionCreator()).init();
		
		newObjectFromFunctionCreator.setTemplate(aTemplateObject);
		
		if(VariableAliases.isSet(aArgumentNamesArray)) {
			newObjectFromFunctionCreator.setArgumentNames(aArgumentNamesArray);
		}
		return newObjectFromFunctionCreator;
	};
});