dbm.registerClass("com.developedbyme.constants.fileformats.midi.MidiChannelEventTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.fileformats.midi.MidiChannelEventTypes");
	//"use strict";
	
	var MidiChannelEventTypes = dbm.importClass("com.developedbyme.constants.fileformats.midi.MidiChannelEventTypes");
	
	staticFunctions.NOTE_OFF = 0x80;
	staticFunctions.NOTE_ON = 0x90;
	staticFunctions.NOTE_AFTER_TOUCH = 0xA0;
	staticFunctions.CONTROLLER = 0xB0;
	staticFunctions.PROGRAM_CHANGE = 0xC0;
	staticFunctions.CHANNEL_AFTER_TOUCH = 0xE0;
	staticFunctions.PITCH_BEND = 0xF0;
});