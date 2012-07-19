dbm.runTempFunction(function() {
	
	var ProcessGroup = dbm.importClass("com.developedbyme.utils.process.ProcessGroup");
	var ExtendedEventProcess = dbm.importClass("com.developedbyme.utils.process.ExtendedEventProcess");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var ProcessStatusTypes = dbm.importClass("com.developedbyme.constants.ProcessStatusTypes");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var processGroup = ProcessGroup.create();
		
		var firstProcess = ExtendedEventProcess.create(CallFunctionCommand.createCommand(console, console.log, ["Process 1"]));
		var secondProcess = ExtendedEventProcess.create(CallFunctionCommand.createCommand(console, console.log, ["Process 2"]));
		var thirdProcess = ExtendedEventProcess.create(CallFunctionCommand.createCommand(console, console.log, ["Process 3"]));
		var fourthProcess = ExtendedEventProcess.create(CallFunctionCommand.createCommand(console, console.log, ["Process 4"]));
		var fifthProcess = ExtendedEventProcess.create(CallFunctionCommand.createCommand(console, console.log, ["Process 5"]));
		
		processGroup.addNode(firstProcess);
		processGroup.addNode(secondProcess);
		processGroup.addNode(thirdProcess);
		processGroup.addNode(fourthProcess);
		processGroup.addNode(fifthProcess);
		
		processGroup.addStartNode(firstProcess);
		processGroup.setDoneNode(fifthProcess);
		
		firstProcess.connectOutput(secondProcess, ProcessStatusTypes.DONE);
		secondProcess.connectOutput(thirdProcess, ProcessStatusTypes.DONE);
		thirdProcess.connectOutput(fourthProcess, ProcessStatusTypes.DONE);
		fourthProcess.connectOutput(fifthProcess, ProcessStatusTypes.DONE);
		
		console.log(processGroup);
		processGroup.startProcess();
	});
});