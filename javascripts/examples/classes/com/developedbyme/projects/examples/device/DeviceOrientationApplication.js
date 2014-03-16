/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.projects.examples.device.DeviceOrientationApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.projects.examples.device.DeviceOrientationApplication");
	
	//Self reference
	var DeviceOrientationApplication = dbm.importClass("com.developedbyme.projects.examples.device.DeviceOrientationApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var DeviceOrientation = dbm.importClass("com.developedbyme.utils.device.DeviceOrientation");
	var TextElement = dbm.importClass("com.developedbyme.gui.text.TextElement");
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.device.DeviceOrientationApplication::_init");
		
		this.superCall();
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.projects.examples.device.DeviceOrientationApplication::_createPage");
		
		var deviceOrientation = DeviceOrientation.create();
		deviceOrientation.startUpdating();
		
		var body = dbm.getDocument().body;
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(dbm.getDocument());
		
		var alphaHolder = htmlCreator.createDiv(null, htmlCreator.createText("Alpha: "));
		body.appendChild(alphaHolder);
		var printAlphaText = TextElement.create(alphaHolder, true, deviceOrientation.getProperty("alphaValue"));
		printAlphaText.getProperty("display").startUpdating();
		
		var betaHolder = htmlCreator.createDiv(null, htmlCreator.createText("Beta: "));
		body.appendChild(betaHolder);
		var printBetaText = TextElement.create(betaHolder, true, deviceOrientation.getProperty("betaValue"));
		printBetaText.getProperty("display").startUpdating();
		
		var gammaHolder = htmlCreator.createDiv(null, htmlCreator.createText("Gamma: "));
		body.appendChild(gammaHolder);
		var printGammaText = TextElement.create(gammaHolder, true, deviceOrientation.getProperty("gammaValue"));
		printGammaText.getProperty("display").startUpdating();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});