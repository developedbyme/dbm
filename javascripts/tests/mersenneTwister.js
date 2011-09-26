dbm.runTempFunction(function() {
	
	var MersenneTwister = dbm.importClass("com.developedbyme.utils.random.MersenneTwister");
	
	var startFunction = function() {
		console.log("startFunction");
		
		var mersenneTwister = (new MersenneTwister()).init();
		mersenneTwister.test();
	};
	
	dbm.addStartFunction(startFunction);
});