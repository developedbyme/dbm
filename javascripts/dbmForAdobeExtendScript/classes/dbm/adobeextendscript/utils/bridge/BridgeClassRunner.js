/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.adobeextendscript.utils.bridge.BridgeClassRunner", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.adobeextendscript.utils.bridge.BridgeClassRunner");
	//"use strict";
	
	//Self reference
	var BridgeClassRunner = dbm.importClass("dbm.adobeextendscript.utils.bridge.BridgeClassRunner");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.adobeextendscript.utils.bridge.BridgeClassRunner::_init");
		
		this.superCall();
		
		this._target = null;
		this._class = null;
		this._data = null;
		this._communicationType = "adobeBridgeTalk";
		
		this._communicationTypePath = "configuration/communicationType";
		this._inputPath = "configuration/bridge/inputValue";
		this._outputPath = "configuration/bridge/outputValue";
		
		this._call = null;
		this._timeoutLength = 100;
		
		return this;
	};
	
	objectFunctions.setTarget = function(aTarget) {
		this._target = aTarget;
		
		return this;
	};
	
	objectFunctions.setupCall = function(aClass, aData) {
		this._class = aClass;
		this._data = aData;
		
		return this;
	};
	
	objectFunctions.perform = function() {
		this._performCall();
	};
	
	objectFunctions._performCall = function() {
		//console.log("dbm.adobeextendscript.utils.bridge.BridgeClassRunner::_performCall");
		
		if(!BridgeTalk.isRunning(this._target)) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.MAJOR, this, "_performCall", "Target " + this._target + " isn't running.");
			return;
		}
		
		this._call = new BridgeTalk();
		this._call.target = this._target;
		
		var dataSourceString = (VariableAliases.isSet(this._data)) ? this._data.toSource() : "null";
		//console.log(dataSourceString);
		
		var generatedScript = "var dbm = null; var global = new Object();var console = new Object();" + "\n";
		generatedScript += "console.dir = function(){};console.log = function(){var joinArray = new Array();$.writeln(joinArray.join.apply(arguments, [\", \"]));};console.debug = function(){};console.info = function(){};console.warn = function(){var joinArray = new Array();$.writeln(\"WARNING: \" + joinArray.join.apply(arguments, [\", \"]));};console.error = function(){var joinArray = new Array();$.writeln(\"ERROR: \" + joinArray.join.apply(arguments, [\", \"]));};console.trace = function(){};" + "\n";
		generatedScript += "(function() {" + "\n";
		generatedScript += "	var javasciptsFolder = \"" + dbm._javascriptsFolder + "\";" + "\n";
		generatedScript += "	var classPath = \"" + this._class + "\";" + "\n";
		generatedScript += "	var importScript = function(aFilePath) {var dbmFile = new File(javasciptsFolder + \"/\" + aFilePath);dbmFile.open(\"r\");var fullText = dbmFile.read();dbmFile.close();eval(fullText);};" + "\n";
		generatedScript += "	importScript(\"dbmForAdobeExtendScript/dbmForAdobeExtendScript.js\");" + "\n";
		generatedScript += "	dbm = global.dbm;" + "\n";
		generatedScript += "	importScript(\"dbm/classes/com/developedbyme/core/globalobjects/classmanager/ClassManager.js\");" + "\n";
		generatedScript += "	dbm.setup(null, null, javasciptsFolder, \"" + dbm._classesFolder + "\");" + "\n";
		var specificFolders = dbm._specificClassesFolders;
		for(var objectName in specificFolders) {
			generatedScript += "	dbm.addSpecificClassesFolder(\"" + objectName + "\", \"" + specificFolders[objectName] + "\");" + "\n";
		}
		generatedScript += "	importScript(\"dbmForAdobeExtendScript/setup/defaultSetup.js\");" + "\n";
		
		generatedScript += "	dbm.addStartFunction(function() {" + "\n";
		generatedScript += "		dbm.importClass(classPath);" + "\n";
		generatedScript += "		dbm.addStartFunction(function() {" + "\n";
		generatedScript += "			dbm.singletons.dbmDataManager.setData(\"" + this._communicationTypePath + "\", \"" + this._communicationType + "\");" + "\n";
		generatedScript += "			dbm.singletons.dbmDataManager.setData(\"" + this._inputPath + "\", " + dataSourceString + ");" + "\n";
		generatedScript += "			var RunningClass = dbm.importClass(classPath);" + "\n";
		generatedScript += "			var runningInstance = (new RunningClass()).init();" + "\n";
		generatedScript += "			runningInstance.start();" + "\n";
		generatedScript += "		});" + "\n";
		generatedScript += "		dbm.restartLoading();" + "\n";
		generatedScript += "	});" + "\n";
		generatedScript += "	dbm.startLoading();" + "\n";
		generatedScript += "	var returnData = dbm.singletons.dbmDataManager.getData(\"" + this._outputPath + "\");" + "\n";
		generatedScript += "	var returnDataSourceString = (returnData !== null && returnData !== undefined) ? returnData.toSource() : \"null\";" + "\n";
		generatedScript += "	return returnDataSourceString;" + "\n";
		generatedScript += "})()";
		
		//console.log(generatedScript);
		this._call.body = generatedScript;
		this._call.onResult = function(aResponseData) {
			console.log("Call response");
			console.log(aResponseData.body);
			console.log(typeof(aResponseData.body));
		}
		this._call.onError = function(aError) {
			console.error("Call failed");
			console.log(aError.headers["Error-Code"]);
			console.log(aError.body);
		}
		BridgeTalk.bringToFront(this._target);
		this._call.send(this._timeoutLength);
		console.log(this._call);
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		/*
		switch(aName) {
			case LoadingExtendedEventIds.SAVED:
				return true;
		}
		*/
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aTarget, aClass, aData) {
		//console.log("dbm.adobeextendscript.utils.bridge.BridgeClassRunner::create");
		
		var newBridgeClassRunner = (new ClassReference()).init();
		newBridgeClassRunner.setTarget(aTarget);
		newBridgeClassRunner.setupCall(aClass, aData);
		
		return newBridgeClassRunner;
	};
});