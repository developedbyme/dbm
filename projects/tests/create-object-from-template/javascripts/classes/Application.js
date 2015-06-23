/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("Application", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("Application");
	//"use strict";
	
	//Self reference
	var Application = dbm.importClass("Application");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var ObjectFromFunctionCreator = dbm.importClass("dbm.core.globalobjects.templatemanager.objects.ObjectFromFunctionCreator");
	
	//Utils
	var DbmXmlEncoder = dbm.importClass("dbm.utils.xml.DbmXmlEncoder");
	var XmlCreator = dbm.importClass("dbm.utils.xml.XmlCreator");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		console.log("Application::_init");
		
		this.superCall();
		
		//this._addTemplate("main", "assets/templates.html#main");
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("Application::_createPage");
		
		//var templateResult = this._createControllerFromTemplate("main");
		//var mainController = templateResult.mainController;
		
		console.log("--- Test 1 ---");
		var templateFunctionObject = ObjectFromFunctionCreator.create({name: "name", randomValue: 3}, ["name"]);
		templateFunctionObject.insertArgumentByName("name", "name");
		
		console.log(templateFunctionObject);
		console.log(templateFunctionObject.createObject("new name"));
		
		console.log("--- Test 2 ---");
		var templateFunctionObject = ObjectFromFunctionCreator.create({name: "name", randomValue: 3, dataValues: [1, 2, 3]}, ["name", "secondValue"]);
		templateFunctionObject.insertArgumentByName("name", "name");
		templateFunctionObject.insertArgumentByName("secondValue", "dataValues/1");
		
		console.log(templateFunctionObject);
		console.log(templateFunctionObject.createObject("array test", 4));
		
		console.log("--- Test 3 ---");
		var templateFunctionObject = ObjectFromFunctionCreator.create({name: "name", randomValue: 3, dataValues: [1, {evenMoreComplexData: "This is the default value"}, 3]}, ["name", "secondValue"]);
		templateFunctionObject.insertArgumentByName("name", "name");
		templateFunctionObject.insertArgumentByName("secondValue", "dataValues/1/evenMoreComplexData", true);
		
		console.log(templateFunctionObject);
		console.log(templateFunctionObject.createObject("default test 1", "Value has been updated"));
		console.log(templateFunctionObject.createObject("default test 2"));
		console.log(XmlCreator.createStringFromXml(DbmXmlEncoder.encodeXmlFromObject(templateFunctionObject.createObject("default test 3", "Value has been updated"))));
		
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("Application::setAllReferencesToNull");
		
		this.superCall();
	};
});