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
	
	//Utils
	var CssLanguageFunctions = dbm.importClass("dbm.utils.native.string.CssLanguageFunctions");
	var CssReferenceFunctions = dbm.importClass("dbm.utils.css.CssReferenceFunctions");
	
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
		
		var testStyleSheet = CssReferenceFunctions.getStyleSheetByPathOnDocument("styles/testGradient.css");
		console.log(testStyleSheet);
		
		var currentStyles = CssReferenceFunctions.getStyleDeclarationsBySelectorOnDocument(".testGradient");
		console.log(currentStyles);
		
		var gradientValue = currentStyles[0].getPropertyValue("background-image");
		var newGradient = CssLanguageFunctions.createGradientFromCss(gradientValue);
		
		console.log(gradientValue);
		console.log(newGradient);
		console.log(newGradient.getCssString());
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("Application::setAllReferencesToNull");
		
		this.superCall();
	};
});