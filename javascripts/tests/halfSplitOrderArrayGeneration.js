dbm.runTempFunction(function() {
	
	var ArrayGenerator = dbm.importClass("dbm.utils.native.array.ArrayGenerator");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	var startFunction = function() {
		console.log("startFunction");
		
		for(var i = 1; i < 129; i++) {
			var currentArray = ArrayGenerator.createHalfSplitOrderArray(i);
			var hasDuplicates = ArrayFunctions.hasDuplicates(currentArray);
			console.log(hasDuplicates, currentArray);
		}
		
	};
	
	dbm.addStartFunction(startFunction);
});