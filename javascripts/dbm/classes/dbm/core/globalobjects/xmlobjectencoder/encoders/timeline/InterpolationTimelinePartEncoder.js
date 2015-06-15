/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.xmlobjectencoder.encoders.timeline.InterpolationTimelinePartEncoder", "dbm.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.timeline.InterpolationTimelinePartEncoder");
	
	//Self reference
	var InterpolationTimelinePartEncoder = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encoders.timeline.InterpolationTimelinePartEncoder");
	
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
		//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.timeline.InterpolationTimelinePartEncoder::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._encodeValue = function(aValue, aNode) {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.timeline.InterpolationTimelinePartEncoder::_encodeValue");
		
		this.superCall(aValue, aNode);
		
		var partsNode = dbm.singletons.dbmXmlObjectEncoder.encodeValue(dbm.singletons.dbmAnimationManager.identifyInterpolationObject(aValue.interpolationObject), aNode);
		partsNode.name = "interpolationObject";
		partsNode.parentApplyType = "timeline/setInterpolationObject";
	};
	
	staticFunctions.create = function() {
		var newInterpolationTimelinePartEncoder = ClassReference._createAndInitClass(ClassReference);
		
		newInterpolationTimelinePartEncoder.addVariablesToEncode(["startTime", "endTime", "startApplyTime", "endApplyTime", "startValue", "endValue"]);
		
		return newInterpolationTimelinePartEncoder;
	};
});