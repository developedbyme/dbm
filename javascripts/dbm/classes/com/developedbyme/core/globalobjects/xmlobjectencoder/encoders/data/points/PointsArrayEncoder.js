/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.data.points.PointsArrayEncoder", "com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.data.points.PointsArrayEncoder");
	
	//Self reference
	var PointsArrayEncoder = dbm.importClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.data.points.PointsArrayEncoder");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var XmlCreator = dbm.importClass("com.developedbyme.utils.xml.XmlCreator");
	var XmlModifier = dbm.importClass("com.developedbyme.utils.xml.XmlModifier");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.data.points.PointsArrayEncoder::_init");
		
		this.superCall();
		
		this.firstSeparator = ";";
		this.secondSeparator = ",";
		
		return this;
	};
	
	objectFunctions._encodeValue = function(aValue, aNode) {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.data.points.PointsArrayEncoder::_encodeValue");
		
		this.superCall(aValue, aNode);
		
		var dataString = "";
		var currentArray = aValue;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPoint = currentArray[i];
			dataString += currentPoint.x + this.secondSeparator + currentPoint.y + this.secondSeparator + currentPoint.z + this.secondSeparator + currentPoint.w + this.firstSeparator; 
		}
		
		aNode.type = "simpleValue";
		aNode.nodeValue = dataString;
		
		/*
		//METODO: don't use private variables
		if(dbm.singletons.dbmXmlObjectEncoder._encodeSimpleValuesAsAttributes) {
			XmlModifier.createNamespacedAttribute(aNode, dbm.xmlNamespaces.dbmData, "data", "nodeValue", dataString);
		}
		else {
			XmlModifier.createText(aNode, dataString, dbm.singletons.dbmXmlObjectEncoder._useCdata);
		}
		*/
	};
	
	staticFunctions.create = function() {
		var newPointsArrayEncoder = ClassReference._createAndInitClass(ClassReference);
		
		return newPointsArrayEncoder;
	};
});