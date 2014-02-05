dbm.registerClass("com.developedbyme.utils.math.music.NoteLengths", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.math.music.NoteLengths");
	
	var NoteLengths = dbm.importClass("com.developedbyme.utils.math.music.NoteLengths");
	
	//American names
	staticFunctions.WHOLE_NOTE = 1;
	staticFunctions.HALF_NOTE = 0.5;
	staticFunctions.QUARTER_NOTE = 0.25;
	staticFunctions.EIGHTH_NOTE = 0.125;
	staticFunctions.SIXTEENTH_NOTE = 0.625;
	
	//Brittish names
	staticFunctions.SEMIBREVE = 1;
	staticFunctions.MINIM = 0.5;
	staticFunctions.CROTCHET = 0.25;
	staticFunctions.QUAVER = 0.125;
	staticFunctions.SEMIQUAVER = 0.625;
	
	staticFunctions.dotNoteLength = function(aNoteLength) {
		return 1.5*aNoteLength;
	};
	
	staticFunctions.tupletLength = function(aNumberOfNotes, aPlayedOverNumberOfNotes, aNoteLength) {
		console.log("com.developedbyme.utils.math.music.NoteLengths::tupletLength");
		console.log(aNumberOfNotes, aPlayedOverNumberOfNotes, aNoteLength);
		return (aNoteLength*aPlayedOverNumberOfNotes)/aNumberOfNotes;
	};
});