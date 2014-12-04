dbm.runTempFunction(function() {
	
	var MersenneTwister = dbm.importClass("dbm.utils.random.MersenneTwister");
	
	var startFunction = function() {
		console.log("startFunction");
		
		var mersenneTwister = (new MersenneTwister()).init();
		mersenneTwister.test();
	};
	
	dbm.addStartFunction(startFunction);
});