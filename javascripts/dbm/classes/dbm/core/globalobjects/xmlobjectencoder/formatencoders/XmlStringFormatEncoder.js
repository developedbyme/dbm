/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.xmlobjectencoder.formatencoders.XmlStringFormatEncoder", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.xmlobjectencoder.formatencoders.XmlStringFormatEncoder");
	
	//Self reference
	var XmlStringFormatEncoder = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.formatencoders.XmlStringFormatEncoder");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.formatencoders.XmlStringFormatEncoder::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.encode = function(aEncodingData) {
		var returnString = "";
		
		returnString += this._encodePart(aEncodingData);
		
		return returnString;
	}
	
	objectFunctions.encodeString = function(aEncodingData) {
		return this.encode(aEncodingData);
	};
	
	objectFunctions._encodePart = function(aPart) {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.formatencoders.XmlStringFormatEncoder::_encodePart");
		//console.log(aPart);
		//console.log(aPart.name, aPart.type, aPart.dataType);
		
		var returnString = "";
		switch(aPart.type) {
			case "root":
				returnString += this._getChildNodes(aPart);
				break;
			case "complexValue":
				returnString += "<data:item " + this._getAttributesString(aPart) +  ">" + "\n";
				returnString += this._getChildNodes(aPart);
				returnString += "</data:item>" + "\n";
				break;
			case "simpleValue":
				returnString += "<data:item " + this._getAttributesString(aPart) +  ">";
				returnString += "<![CDATA[" + aPart.nodeValue + "]]>";
				returnString += "</data:item>" + "\n";
				break;
			default:
				//METODO: error message
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_encodePart", "Unknown type " + aPart.type + ".");
				break;
		}
		return returnString;
	};
	
	objectFunctions._getChildNodes = function(aPart) {
		var returnString = "";
		
		var currentArray = aPart.nodeValue;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPart = currentArray[i];
			returnString += this._encodePart(currentPart);
		}
		
		return returnString;
	};
	
	objectFunctions._getAttributesString = function(aPart) {
		var returnString = this._encodeAttribute("data:type", aPart.dataType);
		if(aPart.name !== null) {
			returnString += " " + this._encodeAttribute("data:name", aPart.name);
		}
		if(aPart.parentApplyType !== null) {
			returnString += " " + this._encodeAttribute("data:parentApplyType", aPart.parentApplyType);
		}
		var currentArray = aPart.attributes;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentAttribute = currentArray[i];
			returnString += " " + this._encodeAttribute(currentAttribute.name, currentAttribute.nodeValue);
		}
		return returnString;
	};
	
	objectFunctions._encodeAttribute = function(aName, aValue) {
		return aName + "=\"" + aValue + "\""; //METODO: escape string
	};
	
	staticFunctions.create = function() {
		var newXmlStringFormatEncoder = ClassReference._createAndInitClass(ClassReference);
		
		return newXmlStringFormatEncoder;
	};
});