/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.random.NonceGenerator", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.random.NonceGenerator");
	
	//Self reference
	var NonceGenerator = dbm.importClass("com.developedbyme.utils.random.NonceGenerator");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	var GlobalVariables = dbm.importClass("com.developedbyme.core.globalobjects.GlobalVariables");
	
	staticFunctions.DEFAULT_CHARACTERS = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
	
	staticFunctions.generateNonce = function(aLength, aRandomNumberGenerator, aCharacters) {
		//console.log("com.developedbyme.utils.random.NonceGenerator::generateNonce");
		
		aCharacters = VariableAliases.valueWithDefault(aCharacters, ClassReference.DEFAULT_CHARACTERS);
		if(!VariableAliases.isSet(aRandomNumberGenerator)) {
			aRandomNumberGenerator = GlobalVariables.SHARED_RANDOM_NUMBER_GENERATOR;
			//METODO: check for null
		}
		
		var returnString = "";
		var charactersLength = aCharacters.length;
		for(var i = 0; i < aLength; i++) {
			var currentValue = Math.floor(charactersLength*aRandomNumberGenerator.generateRealClosedOpen());
			returnString += aCharacters[currentValue];
		}
		
		return returnString;
	};
});