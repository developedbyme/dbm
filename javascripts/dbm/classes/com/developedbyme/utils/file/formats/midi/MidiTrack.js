/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.file.formats.midi.MidiTrack", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.file.formats.midi.MidiTrack");
	
	var MidiTrack = dbm.importClass("com.developedbyme.utils.file.formats.midi.MidiTrack");
	
	var MidiEventTypes = dbm.importClass("com.developedbyme.constants.fileformats.midi.MidiEventTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.file.formats.midi.MidiTrack::_init");
		
		this.superCall();
		
		this._events = new Array();
		
		return this;
	};
	
	objectFunctions.getMetadata = function(aType) {
		
		var currentArray = this._events;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentEvent = currentArray[i];
			//console.log(currentEvent.type, MidiEventTypes.METADATA, currentEvent.metadataType, aType);
			if(currentEvent.type === MidiEventTypes.METADATA && currentEvent.metadataType === aType) {
				return currentEvent.data;
			}
		}
		//METODO: error message
		return null;
	};
	
	objectFunctions.addEvent = function(aEvent) {
		
		this._events.push(aEvent);
		
		return this;
	};
	
	objectFunctions.getEvents = function() {
		return this._events;
	};
	
	staticFunctions.create = function() {
		var newMidiTrack = (new ClassReference()).init();
		
		return newMidiTrack;
	};
});