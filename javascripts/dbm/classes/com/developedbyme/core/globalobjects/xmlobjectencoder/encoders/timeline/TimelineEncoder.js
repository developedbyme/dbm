/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.timeline.TimelineEncoder", "com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.timeline.TimelineEncoder");
	
	//Self reference
	var TimelineEncoder = dbm.importClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.timeline.TimelineEncoder");
	
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
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.timeline.TimelineEncoder::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._encodeValue = function(aValue, aNode) {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.timeline.TimelineEncoder::_encodeValue");
		
		this.superCall(aValue, aNode);
		
		var partsNode = dbm.singletons.dbmXmlObjectEncoder.encodeValue(aValue._parts, aNode); //METODO: fix so that it doesn't have to access private variable
		XmlModifier.createNamespacedAttribute(partsNode, dbm.xmlNamespaces.dbmData, "data", "name", "parts");
		XmlModifier.createNamespacedAttribute(partsNode, dbm.xmlNamespaces.dbmData, "data", "parentApplyType", "timeline/applyParts");
	};
	
	staticFunctions.create = function() {
		var newTimelineEncoder = ClassReference._createAndInitClass(ClassReference);
		
		newTimelineEncoder.addVariableToEncode("startTime");
		newTimelineEncoder.addVariableToEncode("endTime");
		newTimelineEncoder.addVariableToEncode("startApplyTime");
		newTimelineEncoder.addVariableToEncode("endApplyTime");
		newTimelineEncoder.addPropertyToEncode("startValue");
		
		return newTimelineEncoder;
	};
});