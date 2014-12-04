/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.examples.basic.xmlencoding.EncodeObjectApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var EncodeObjectApplication = dbm.importClass("dbm.projects.examples.basic.xmlencoding.EncodeObjectApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	
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
		//console.log("dbm.projects.examples.basic.xmlencoding.EncodeObjectApplication::_init");
		
		this.superCall();
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.examples.basic.xmlencoding.EncodeObjectApplication::_createPage");
		
		var encodingObject = {"testString": "Hello world", "testValue": 1.333, "testNull": null, "testArray": [1, 2, {"objectInArray": 3}]};
		
		var encodedXml = dbm.singletons.dbmXmlObjectEncoder.encodeXmlFromObject(encodingObject);
		console.log(encodedXml);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});