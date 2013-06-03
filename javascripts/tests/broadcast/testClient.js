dbm.runTempFunction(function() {
	
	var DbmBroadcastClient = dbm.importClass("com.developedbyme.broadcast.client.DbmBroadcastClient");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var testClient = DbmBroadcastClient.create("test", "default", "http://127.0.0.1/path/to/initialCall");
		
		console.log(testClient);
	});
});