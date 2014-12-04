/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject");
	
	//Self reference
	var EncodingBaseObject = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var EncodingDataObject = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encodingdata.EncodingDataObject");
	
	//Utils
	var XmlCreator = dbm.importClass("dbm.utils.xml.XmlCreator");
	var XmlModifier = dbm.importClass("dbm.utils.xml.XmlModifier");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject::_init");
		
		this.superCall();
		
		this._variableNamesArray = new Array();
		this._propertyNamesArray = new Array();
		this._variableCustomTypes = this.addDestroyableObject(NamedArray.create(false));
		
		return this;
	};
	
	objectFunctions.addCustomTypeForVariable = function(aName, aType) {
		this._variableCustomTypes.addObject(aName, aType);
		
		return this;
	};
	
	objectFunctions.addVariableToEncode = function(aName) {
		this._variableNamesArray.push(aName);
		
		return this;
	};
	
	objectFunctions.addVariablesToEncode = function(aNames) {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject::addVariablesToEncode");
		//console.log(aNames);
		ArrayFunctions.concatToArray(this._variableNamesArray, aNames);
		
		return this;
	};
	
	objectFunctions.addPropertyToEncode = function(aName) {
		this._propertyNamesArray.push(aName);
		
		return this;
	};
	
	objectFunctions.addPropertiesToEncode = function(aNames) {
		ArrayFunctions.concatToArray(this._propertyNamesArray, aNames);
		
		return this;
	};
	
	objectFunctions._createDataNode = function(aType, aClassName, aParentNode) {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject::_createDataNode");
		
		var newNode = EncodingDataObject.createComplexValue(aType, aParentNode);
		EncodingDataObject.createAttribute("data:class", aClassName, newNode);
		
		return newNode;
	};
	
	objectFunctions._encodeVariables = function(aValue, aNode) {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject::_encodeVariables");
		//console.log(aValue, this._variableNamesArray);
		
		var currentArray = this._variableNamesArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentVariableName = currentArray[i];
			var newNode = null;
			if(this._variableCustomTypes.select(currentVariableName)) {
				newNode = dbm.singletons.dbmXmlObjectEncoder.encodeValueWithType(aValue[currentVariableName], this._variableCustomTypes.currentSelectedItem, aNode);
			}
			else {
				newNode = dbm.singletons.dbmXmlObjectEncoder.encodeValue(aValue[currentVariableName], aNode);
			}
			//METODO: check for null
			newNode.name = currentVariableName;
		}
	};
	
	objectFunctions._encodeProperties = function(aValue, aNode) {
		var currentArray = this._propertyNamesArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPropertyName = currentArray[i];
			var currentProperty = aValue.getProperty(currentPropertyName);
			//METODO: check for null
			if(currentProperty !== null) {
				var newNode = this._encodeProperty(currentProperty, aNode);
				newNode.name = currentPropertyName;
			}
			else {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_encodeProperties", "Property " + currentPropertyName + " does not exist on " + aValue + ".");
			}
		}
	};
	
	objectFunctions._encodeValue = function(aValue, aNode) {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject::_encodeValue");
		
		this._encodeVariables(aValue, aNode);
		this._encodeProperties(aValue, aNode);
	};
	
	objectFunctions.encode = function(aValue, aNode) {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject::encode");
		this._encodeValue(aValue, aNode);
		return aNode;
	};
	
	objectFunctions.encodeClass = function(aValue, aClassName, aParentNode) {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject::encodeClass");
		var returnNode = this._createDataNode("dbmObject", aClassName, aParentNode);
		this.encode(aValue, returnNode);
		return returnNode;
	};
	
	objectFunctions._encodeProperty = function(aProperty, aParentNode) {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject::encode");
		//console.log(aProperty, aParentNode);
		
		if(aProperty.hasAnimationController()) {
			var returnNode = dbm.singletons.dbmXmlObjectEncoder.encodeValue(aProperty.getAnimationController(), aParentNode);
			returnNode.parentApplyType = "animatedProperty";
			//METODO: might not be linked to this
			return returnNode;
		}
		else if(aProperty._inputConnection === null && aProperty._inputUpdateFunction === null) {
			var returnNode = dbm.singletons.dbmXmlObjectEncoder.encodeValue(aProperty.getValue(), aParentNode);
			returnNode.parentApplyType = "setPropertyInput";
			return returnNode;
		}
		else {
			//METODO: link up property
			return null; //MEDEBUG
		}
	};
	
	staticFunctions.create = function() {
		var newEncodingBaseObject = ClassReference._createAndInitClass(ClassReference);
		
		return newEncodingBaseObject;
	};
});