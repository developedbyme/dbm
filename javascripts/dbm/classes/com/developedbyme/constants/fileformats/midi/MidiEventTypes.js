dbm.registerClass("com.developedbyme.constants.fileformats.midi.MidiEventTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.fileformats.midi.MidiEventTypes");
	//"use strict";
	
	var MidiEventTypes = dbm.importClass("com.developedbyme.constants.fileformats.midi.MidiEventTypes");
	
	staticFunctions.SYSTEM_EXCLUSIVE = 0xF0;
	staticFunctions.SYSTEM_EXCLUSIVE_CONTINUATION = 0xF7;
	staticFunctions.METADATA = 0xFF;
});