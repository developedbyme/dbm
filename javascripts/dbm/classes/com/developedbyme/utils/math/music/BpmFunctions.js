dbm.registerClass("com.developedbyme.utils.math.music.BpmFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.math.music.BpmFunctions");
	
	var BpmFunctions = dbm.importClass("com.developedbyme.utils.math.music.BpmFunctions");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var NoteLengths = dbm.importClass("com.developedbyme.utils.math.music.NoteLengths");
	
	staticFunctions.getBeatLength = function(aBpm, aNoteLength) {
		
		aNoteLength = VariableAliases.valueWithDefault(aNoteLength, NoteLengths.QUARTER_NOTE);
		
		return 60*4*aNoteLength/aBpm;
	};
});