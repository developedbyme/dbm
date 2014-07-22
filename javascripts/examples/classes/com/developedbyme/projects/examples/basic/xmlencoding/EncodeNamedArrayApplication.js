/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.projects.examples.basic.xmlencoding.EncodeNamedArrayApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var EncodeNamedArrayApplication = dbm.importClass("com.developedbyme.projects.examples.basic.xmlencoding.EncodeNamedArrayApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var Timeline = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var XmlCreator = dbm.importClass("com.developedbyme.utils.xml.XmlCreator");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.basic.xmlencoding.EncodeNamedArrayApplication::_init");
		
		this.superCall();
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.projects.examples.basic.xmlencoding.EncodeNamedArrayApplication::_createPage");
		
		var encodingObject = NamedArray.create(true);
		encodingObject.addObject("testNumber", 3);
		encodingObject.addObject("testString", "This is a string");
		encodingObject.addObject("testArray", [1, 2, 3]);
		
		var timeline = Timeline.create(2);
		timeline.setValueAt(4, 2);
		encodingObject.addObject("testTimeline", timeline);
		
		var encodedXml = dbm.singletons.dbmXmlObjectEncoder.encodeXmlFromObject(encodingObject);
		console.log(encodedXml);
		console.log(XmlCreator.createStringFromXml(encodedXml));
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});