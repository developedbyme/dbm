/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.timeline.InterpolationTimelinePartEncoder", "com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.timeline.InterpolationTimelinePartEncoder");
	
	//Self reference
	var InterpolationTimelinePartEncoder = dbm.importClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.timeline.InterpolationTimelinePartEncoder");
	
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
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.timeline.InterpolationTimelinePartEncoder::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._encodeValue = function(aValue, aNode) {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.timeline.InterpolationTimelinePartEncoder::_encodeValue");
		
		this.superCall(aValue, aNode);
		
		var partsNode = dbm.singletons.dbmXmlObjectEncoder.encodeValue(dbm.singletons.dbmAnimationManager.identifyInterpolationObject(aValue.interpolationObject), aNode);
		XmlModifier.createNamespacedAttribute(partsNode, dbm.xmlNamespaces.dbmData, "data", "name", "interpolationObject");
		XmlModifier.createNamespacedAttribute(partsNode, dbm.xmlNamespaces.dbmData, "data", "parentApplyType", "timeline/setInterpolationObject");
	};
	
	staticFunctions.create = function() {
		var newInterpolationTimelinePartEncoder = ClassReference._createAndInitClass(ClassReference);
		
		newInterpolationTimelinePartEncoder.addVariablesToEncode(["startTime", "endTime", "startApplyTime", "endApplyTime", "startValue", "endValue"]);
		
		return newInterpolationTimelinePartEncoder;
	};
});