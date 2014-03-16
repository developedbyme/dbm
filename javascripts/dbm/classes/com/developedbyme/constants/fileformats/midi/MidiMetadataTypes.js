/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.constants.fileformats.midi.MidiMetadataTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.fileformats.midi.MidiMetadataTypes");
	//"use strict";
	
	var MidiMetadataTypes = dbm.importClass("com.developedbyme.constants.fileformats.midi.MidiMetadataTypes");
	
	staticFunctions.SEQUENCE_NUMBER = 0x00;
	staticFunctions.TEXT = 0x01;
	staticFunctions.COPYRIGHT = 0x02;
	staticFunctions.SEQUENCE_OR_TRACK_NAME = 0x03;
	staticFunctions.INSTRUMENT_NAME = 0x04;
	staticFunctions.LYRIC = 0x05;
	staticFunctions.MARKER = 0x06;
	staticFunctions.CUE_POINT = 0x07;
	staticFunctions.MIDI_CHANNEL_PREFIX = 0x20;
	staticFunctions.END_OF_TRACK = 0x2f;
	staticFunctions.SET_TEMPO = 0x51;
	staticFunctions.SMPTE_OFFSET = 0x54;
	staticFunctions.TIME_SIGNATURE = 0x58;
	staticFunctions.KEY_SIGNATURE = 0x59;
	staticFunctions.SEQUENCE_SPECIFIC = 0x7f;
});