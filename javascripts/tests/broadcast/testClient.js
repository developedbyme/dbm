dbm.runTempFunction(function() {
	
	var DbmBroadcastClient = dbm.importClass("com.developedbyme.broadcast.client.DbmBroadcastClient");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var initialPath = "../assets/tests/broadcast/testClient.xml"; //"http://127.0.0.1/path/to/initialCall";
		var testClient = DbmBroadcastClient.create("test", "default", initialPath);
		
		testClient.start();
		
		console.log(testClient);
	});
});