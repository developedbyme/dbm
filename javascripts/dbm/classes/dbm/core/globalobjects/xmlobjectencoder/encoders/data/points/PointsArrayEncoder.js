/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.xmlobjectencoder.encoders.data.points.PointsArrayEncoder", "dbm.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.data.points.PointsArrayEncoder");
	
	//Self reference
	var PointsArrayEncoder = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encoders.data.points.PointsArrayEncoder");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var XmlCreator = dbm.importClass("dbm.utils.xml.XmlCreator");
	var XmlModifier = dbm.importClass("dbm.utils.xml.XmlModifier");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.data.points.PointsArrayEncoder::_init");
		
		this.superCall();
		
		this.firstSeparator = ";";
		this.secondSeparator = ",";
		
		return this;
	};
	
	objectFunctions._encodeValue = function(aValue, aNode) {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.data.points.PointsArrayEncoder::_encodeValue");
		
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
	};
	
	staticFunctions.create = function() {
		var newPointsArrayEncoder = ClassReference._createAndInitClass(ClassReference);
		
		return newPointsArrayEncoder;
	};
});