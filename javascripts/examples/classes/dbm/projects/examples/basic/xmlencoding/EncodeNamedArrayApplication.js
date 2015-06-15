/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.examples.basic.xmlencoding.EncodeNamedArrayApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var EncodeNamedArrayApplication = dbm.importClass("dbm.projects.examples.basic.xmlencoding.EncodeNamedArrayApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	var Timeline = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.Timeline");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("dbm.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var XmlCreator = dbm.importClass("dbm.utils.xml.XmlCreator");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.basic.xmlencoding.EncodeNamedArrayApplication::_init");
		
		this.superCall();
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.examples.basic.xmlencoding.EncodeNamedArrayApplication::_createPage");
		
		var encodingObject = NamedArray.create(true);
		encodingObject.addObject("testNumber", 3);
		encodingObject.addObject("testString", "This is a string");
		encodingObject.addObject("testArray", [1, 2, 3]);
		
		var timeline = Timeline.create(2);
		timeline.setValueAt(4, 2);
		encodingObject.addObject("testTimeline", timeline);
		
		var encodedXml = dbm.singletons.dbmXmlObjectEncoder.encodeXmlFromObject(encodingObject);
		console.log(encodedXml);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});