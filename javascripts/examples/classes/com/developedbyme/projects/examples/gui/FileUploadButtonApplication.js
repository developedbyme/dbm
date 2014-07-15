/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.projects.examples.gui.FileUploadButtonApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var FileUploadButtonApplication = dbm.importClass("com.developedbyme.projects.examples.gui.FileUploadButtonApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var FileUploadButton = dbm.importClass("com.developedbyme.gui.buttons.FileUploadButton");
	var TextElement = dbm.importClass("com.developedbyme.gui.text.TextElement");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.gui.FileUploadButtonApplication::_init");
		
		this.superCall();
		
		this._button = null;
		this._text = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.projects.examples.gui.FileUploadButtonApplication::_createPage");
		
		this._button = FileUploadButton.createDiv(dbm.getDocument(), true, {"style": "width: 300px; height: 50px; background-color: #FF0000;"});
		this._button.addAutoLoadCommand();
		this._button.activate();
		
		this._text = TextElement.create(dbm.getDocument(), true, this._button.getProperty("fileContents"));
		this._text.getProperty("display").startUpdating();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});