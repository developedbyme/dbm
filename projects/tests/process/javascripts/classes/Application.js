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
	var ProcessGroup = dbm.importClass("dbm.utils.process.ProcessGroup");
	var WaitProcess = dbm.importClass("dbm.utils.process.WaitProcess");
	var ExtendedEventProcess = dbm.importClass("dbm.utils.process.ExtendedEventProcess");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	//Constants
	var ProcessStatusTypes = dbm.importClass("dbm.constants.status.ProcessStatusTypes");
	
	
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
		
		var processGroup = ProcessGroup.create();
		
		var firstProcess = ExtendedEventProcess.create(CallFunctionCommand.createCommand(console, console.log, ["Process 1"]));
		var secondProcess = ExtendedEventProcess.create(CallFunctionCommand.createCommand(console, console.log, ["Process 2"]));
		var thirdProcess = ExtendedEventProcess.create(CallFunctionCommand.createCommand(console, console.log, ["Process 3"]));
		var fourthProcess = ExtendedEventProcess.create(CallFunctionCommand.createCommand(console, console.log, ["Process 4"]));
		var waitProcess = WaitProcess.create(5);
		var fifthProcess = ExtendedEventProcess.create(CallFunctionCommand.createCommand(console, console.log, ["Process 5"]));
		
		processGroup.addNode(firstProcess);
		processGroup.addNode(secondProcess);
		processGroup.addNode(thirdProcess);
		processGroup.addNode(fourthProcess);
		processGroup.addNode(waitProcess);
		processGroup.addNode(fifthProcess);
		
		processGroup.addStartNode(firstProcess);
		processGroup.setDoneNode(fifthProcess);
		
		firstProcess.connectOutput(secondProcess, ProcessStatusTypes.DONE);
		secondProcess.connectOutput(thirdProcess, ProcessStatusTypes.DONE);
		thirdProcess.connectOutput(fourthProcess, ProcessStatusTypes.DONE);
		fourthProcess.connectOutput(waitProcess, ProcessStatusTypes.DONE);
		waitProcess.connectOutput(fifthProcess, ProcessStatusTypes.DONE);
		
		console.log(processGroup);
		processGroup.startProcess();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("Application::setAllReferencesToNull");
		
		this.superCall();
	};
});