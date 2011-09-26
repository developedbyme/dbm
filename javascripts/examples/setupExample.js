dbm.runTempFunction(function() {
	
	var BaseObject = dbm.importClass("com.developedbyme.core.BaseObject");
	
	var startFunction = function() {
		console.log("startFunction");
		
		var baseObject = new BaseObject();
		baseObject.init();
		
		console.log(baseObject);
		console.log(baseObject.init);
		
		console.log(dbm.singletons.dbmIdManager.getNewId("test"));
	};
	
	dbm.addStartFunction(startFunction);
});