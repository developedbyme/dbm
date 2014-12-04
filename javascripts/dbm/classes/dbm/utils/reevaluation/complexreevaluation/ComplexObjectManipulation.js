/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.reevaluation.complexreevaluation.ComplexObjectManipulation", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.complexreevaluation.ComplexObjectManipulation");
	
	var ComplexObjectManipulation = dbm.importClass("dbm.utils.reevaluation.complexreevaluation.ComplexObjectManipulation");
	
	var StaticVariableObject = dbm.importClass("dbm.utils.reevaluation.staticreevaluation.StaticVariableObject");
	var ReevaluationBaseObject = dbm.importClass("dbm.utils.reevaluation.ReevaluationBaseObject");
	var ReevaluateArrayObject = dbm.importClass("dbm.utils.reevaluation.complexreevaluation.ReevaluateArrayObject");
	var ReevaluateObjectObject = dbm.importClass("dbm.utils.reevaluation.complexreevaluation.ReevaluateObjectObject");
	var VariableWithDefaultObject = dbm.importClass("dbm.utils.reevaluation.switchreevaluation.VariableWithDefaultObject");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var ObjectFunctions = dbm.importClass("dbm.utils.native.object.ObjectFunctions");
	
	var JavascriptObjectTypes = dbm.importClass("dbm.constants.JavascriptObjectTypes");
	
	staticFunctions.createReevaluationFromTemplate = function(aObject) {
		
		if(aObject instanceof ReevaluationBaseObject) {
			return aObject;
		}
		
		var returnValue = ClassReference.getReevaluationOrStaticFromTemplate(aObject);
		
		if(returnValue instanceof ReevaluationBaseObject) {
			return returnValue;
		}
		
		return StaticVariableObject.createReevaluationObject(returnValue);
	};
	
	staticFunctions.getReevaluationOrStaticFromTemplate = function(aObject) {
		
		var valueType = ObjectFunctions.typeOfValue(aObject);
		switch(valueType) {
			case JavascriptObjectTypes.NON_REAL_TYPE_ARRAY:
				return ClassReference.getReevaluationOrStaticArrayFromTemplate(aObject);
			case JavascriptObjectTypes.TYPE_OBJECT:
				return ClassReference.getReevaluationOrStaticObjectFromTemplate(aObject);
			default:
				//METODO: error message
			case JavascriptObjectTypes.TYPE_UNDEFINED:
			case JavascriptObjectTypes.NON_REAL_TYPE_NULL:
			case JavascriptObjectTypes.TYPE_BOOLEAN:
			case JavascriptObjectTypes.TYPE_NUMBER:
			case JavascriptObjectTypes.TYPE_STRING:
			case JavascriptObjectTypes.TYPE_FUNCTION:
			case JavascriptObjectTypes.TYPE_XML:
				return aObject;
		}
	};
	
	staticFunctions.getReevaluationOrStaticArrayFromTemplate = function(aArray) {
		
		var hasReevaluation = false;
		
		var currentArray = aArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var newValue = ClassReference.getReevaluationOrStaticFromTemplate(currentArray[i]);
			if(newValue instanceof ReevaluationBaseObject) {
				hasReevaluation = true;
			}
			currentArray[i] = newValue;
		}
		if(hasReevaluation) {
			return ReevaluateArrayObject.createReevaluationObject(currentArray);
		}
		return currentArray;
	};
	
	staticFunctions.getReevaluationOrStaticObjectFromTemplate = function(aObject) {
		
		var hasReevaluation = false;
		
		for(var objectName in aObject) {
			var newValue = ClassReference.getReevaluationOrStaticFromTemplate(aObject[objectName]);
			if(newValue instanceof ReevaluationBaseObject) {
				hasReevaluation = true;
			}
			aObject[objectName] = newValue;
		}
		if(hasReevaluation) {
			return ReevaluateObjectObject.createReevaluationObject(aObject);
		}
		return aObject;
	};
	
	staticFunctions.replaceObjectInsideReevaluationObject = function(aBaseObject, aPath, aObject, aWithDefault) {
		
		aWithDefault = VariableAliases.valueWithDefault(aWithDefault, false);
		
		var pathArray = aPath.split("/");
		
		return ClassReference._replaceObjectInsideReevaluationObjectRecursive(aBaseObject, pathArray, 0, aObject, aWithDefault);
	};
	
	staticFunctions._replaceObjectInsideReevaluationObjectRecursive = function(aBaseObject, aPathArray, aPathIndex, aObject, aWithDefault) {
		
		if(aPathIndex === aPathArray.length) {
			if(aWithDefault) {
				return VariableWithDefaultObject.createReevaluationObject(aObject, aBaseObject);
			}
			else {
				return aObject;
			}
		}
		
		var dataObject;
		var isReevaluation = false;
		
		if(aBaseObject instanceof ReevaluationBaseObject) {
			dataObject = aBaseObject.getDataObject();
			if(!(aBaseObject instanceof StaticVariableObject)) {
				isReevaluation = true;
			}
		}
		else {
			dataObject = aBaseObject;
		}
		
		var valueType = ObjectFunctions.typeOfValue(dataObject);
		var valueName;
		
		switch(valueType) {
			case JavascriptObjectTypes.NON_REAL_TYPE_ARRAY:
				valueName = parseInt(aPathArray[aPathIndex], 10);
				break;
			case JavascriptObjectTypes.TYPE_OBJECT:
				valueName = aPathArray[aPathIndex];
				break;
			default:
				//METODO: error message
				return aBaseObject;
		}
		
		var newBaseObject = dataObject[valueName];
		var newData = ClassReference._replaceObjectInsideReevaluationObjectRecursive(newBaseObject, aPathArray, aPathIndex+1, aObject, aWithDefault);
		dataObject[valueName] = newData;
		if(newData instanceof ReevaluationBaseObject && !isReevaluation) {
			switch(valueType) {
				case JavascriptObjectTypes.NON_REAL_TYPE_ARRAY:
					return ReevaluateArrayObject.createReevaluationObject(dataObject);
				case JavascriptObjectTypes.TYPE_OBJECT:
					return ReevaluateObjectObject.createReevaluationObject(dataObject);
			}
		}
		else {
			return aBaseObject;
		}
		
	};
});