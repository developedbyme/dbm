dbm.runTempFunction(function() {
	
	var UuidGenerator = dbm.importClass("dbm.utils.id.UuidGenerator");
	
	var startFunction = function() {
		console.log("startFunction");
		
		var generator = (new UuidGenerator()).init();
		generator.randomGenerator.initByUint(1);
		
		for(var i = 0; i < 1000; i++) {
			console.log(generator.generateV4());
		}
	};
	
	dbm.addStartFunction(startFunction);
});