dbm.runTempFunction(function() {
	
	var ArrayGenerator = dbm.importClass("com.developedbyme.utils.native.array.ArrayGenerator");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	var MersenneTwister = dbm.importClass("com.developedbyme.utils.random.MersenneTwister");
	
	var GoogleTranslateReader = dbm.importClass("com.developedbyme.thirdparty.google.translate.GoogleTranslateReader");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var randomGenerator = MersenneTwister.create();
		randomGenerator.initByUint(32);
		
		var name = dbm.singletons["dbmPageManager"].getQueryStringParameter("name");
		var word = dbm.singletons["dbmPageManager"].getQueryStringParameter("word");
		console.log(name, word);
		
		var orderedArray = new Array();
		ArrayGenerator.createArrayFromCharCodes(65, 91, orderedArray);
		var unorderedArray = ArrayFunctions.copyArray(orderedArray);
		ArrayFunctions.controlledRandomizeArray(unorderedArray, 3*unorderedArray.length, randomGenerator);
		
		console.log(orderedArray, unorderedArray);
		
		if(word != null) {
			var realWord = "";
			var wordLength = 0.5*word.length;
			for(var i = 0; i < wordLength; i++) {
				var index = ArrayFunctions.indexOfInArray(unorderedArray, word[2*i]);
				realWord += orderedArray[index];
			}
			console.log(realWord);
			
			var readString = "Hi";
			if(name != null) {
				readString += " " + name;
			}
			readString += " can you spell " + realWord.toLowerCase();
			console.log(readString);
			
			var textReader = GoogleTranslateReader.create(dbm.getDocument(), true, readString);
			console.log(textReader);
			textReader.play();
		}
		else {
			
		}
	});
});

