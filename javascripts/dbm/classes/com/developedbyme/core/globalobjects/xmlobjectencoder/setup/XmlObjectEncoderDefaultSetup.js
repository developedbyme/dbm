/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Default setup for the global xml object encoder.
 */
dbm.registerClass("com.developedbyme.core.globalobjects.xmlobjectencoder.setup.XmlObjectEncoderDefaultSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.setup.XmlObjectEncoderDefaultSetup");
	//"use strict";
	
	//Self reference
	var XmlObjectEncoderDefaultSetup = dbm.importClass("com.developedbyme.core.globalobjects.xmlobjectencoder.setup.XmlObjectEncoderDefaultSetup");
	
	//Error report
	
	//Dependencies
	var TimelineEncoder = dbm.importClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.timeline.TimelineEncoder");
	var InterpolationTimelinePartEncoder = dbm.importClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.timeline.InterpolationTimelinePartEncoder");
	var EncodingBaseObject = dbm.importClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject");
	
	//Utils
	
	//Constants
	
	/**
	 * Sets up the default encoders.
	 */
	staticFunctions.setup = function() {
		ClassReference.setupTimeline();
	};
	
	/**
	 * Sets up encoders for timeline encoders.
	 */
	staticFunctions.setupTimeline = function() {
		var timelineEncoder = TimelineEncoder.create();
		dbm.singletons.dbmXmlObjectEncoder.addClassEncoder("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline", timelineEncoder);
		
		var interpolationTimelinePartEncoder = InterpolationTimelinePartEncoder.create();
		dbm.singletons.dbmXmlObjectEncoder.addClassEncoder("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.InterpolationTimelinePart", interpolationTimelinePartEncoder);
		
		var setValueTimelinePartEncoder = EncodingBaseObject.create();
		setValueTimelinePartEncoder.addVariablesToEncode(["startTime", "endTime", "startApplyTime", "endApplyTime", "value"]);
		dbm.singletons.dbmXmlObjectEncoder.addClassEncoder("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.SetValueTimelinePart", setValueTimelinePartEncoder);
		
	};
});