/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.examples.basic.xmlencoding.EncodeTimelineApplication2", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var EncodeTimelineApplication2 = dbm.importClass("dbm.projects.examples.basic.xmlencoding.EncodeTimelineApplication2");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var Timeline = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.Timeline");
	var AnimationCurveTimelinePart = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.parts.AnimationCurveTimelinePart");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("dbm.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var XmlCreator = dbm.importClass("dbm.utils.xml.XmlCreator");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	var InterpolationTypes = dbm.importClass("dbm.constants.InterpolationTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.basic.xmlencoding.EncodeTimelineApplication2::_init");
		
		this.superCall();
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.examples.basic.xmlencoding.EncodeTimelineApplication2::_createPage");
		
		var timeline = Timeline.create(2);
		timeline.addPart(
			AnimationCurveTimelinePart.create(
				dbm.singletons.dbmCurveCreator.createCurveFromDoubleSeparatedString(3, true, "0,0; 0.3,0.6; 0.7,0.3; 1,1;"),
				0,
				4
			)
		);
		
		var encodedXml = dbm.singletons.dbmXmlObjectEncoder.encodeXmlFromObject(timeline);
		console.log(encodedXml);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});