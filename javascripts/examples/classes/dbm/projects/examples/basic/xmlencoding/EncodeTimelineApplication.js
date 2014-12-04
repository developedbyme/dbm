/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.examples.basic.xmlencoding.EncodeTimelineApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var EncodeTimelineApplication = dbm.importClass("dbm.projects.examples.basic.xmlencoding.EncodeTimelineApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var Timeline = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.Timeline");
	
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
		//console.log("dbm.projects.examples.basic.xmlencoding.EncodeTimelineApplication::_init");
		
		this.superCall();
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.examples.basic.xmlencoding.EncodeTimelineApplication::_createPage");
		
		var timeline = Timeline.create(2);
		timeline.setValueAt(4, 2);
		timeline.setValueAt(4.5, 3);
		timeline.animateValueAt(5, 2, InterpolationTypes.QUADRATIC, 3.7);
		timeline.animateValueAt(1, 7, InterpolationTypes.INVERTED_QUADRATIC, 4.1);
		
		var encodedXml = dbm.singletons.dbmXmlObjectEncoder.encodeXmlFromObject(timeline);
		console.log(encodedXml);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});