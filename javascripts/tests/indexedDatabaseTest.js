dbm.runTempFunction(function() {
	
	var IndexedDatabase = dbm.importClass("dbm.utils.data.storage.database.IndexedDatabase");
	var IndexedDatabaseStructure = dbm.importClass("dbm.utils.data.storage.database.IndexedDatabaseStructure");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var IndexedDatabaseEventIds = dbm.importClass("dbm.constants.htmlevents.IndexedDatabaseEventIds");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var structure = IndexedDatabaseStructure.create();
		structure.createTable("Test", "id", true);
		structure.createTable("Test2", "id2", false);
		var database = IndexedDatabase.create("Test", structure);
		
		var setDataFunction = function() {
			/*
			var operation = database.insertToTable("Test", {"someData": "Hello world!"});
			console.log(operation);
			
			var operation = database.countTable("Test");
			console.log(operation);
			
			var operation = database.selectFromTable("Test", 1);
			console.log(operation);
			*/
			
			var operation = database.selectRangeFromTable("Test", 0, -1);
			console.log(operation);
		}
		
		database.getExtendedEvent().addCommandToEvent(IndexedDatabaseEventIds.SUCCESS, CallFunctionCommand.createCommand(this, setDataFunction, []));
		
		database.open();
		
		console.log(database);
		
		
	});
});

