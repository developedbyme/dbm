dbm.runTempFunction(function() {
	
	var ProcessGroup = dbm.importClass("dbm.utils.process.ProcessGroup");
	var WaitProcess = dbm.importClass("dbm.utils.process.WaitProcess");
	var ExtendedEventProcess = dbm.importClass("dbm.utils.process.ExtendedEventProcess");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var ProcessStatusTypes = dbm.importClass("dbm.constants.status.ProcessStatusTypes");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
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
	});
});