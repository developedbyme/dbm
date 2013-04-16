dbm.registerClass("com.developedbyme.utils.audio.midiplayer.MidiPlayer", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.audio.midiplayer.MidiPlayer");
	
	var MidiPlayer = dbm.importClass("com.developedbyme.utils.audio.midiplayer.MidiPlayer");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var MidiNote = dbm.importClass("com.developedbyme.utils.audio.midiplayer.MidiNote");
	var ChannelEvent = dbm.importClass("com.developedbyme.utils.file.formats.midi.events.ChannelEvent");
	
	var MidiChannelEventTypes = dbm.importClass("com.developedbyme.constants.fileformats.midi.MidiChannelEventTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.audio.midiplayer.MidiPlayer::_init");
		
		this.superCall();
		
		this._notes = new Array();
		
		return this;
	};
	
	objectFunctions._getIndexForNote = function(aArray, aChannel, aPitch) {
		var currentArray = aArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			if(currentObject.channel === aChannel && currentObject.pitch === aPitch) {
				return i;
			}
		}
		//METODO: error message
		return -1;
	};
	
	objectFunctions.addTrack = function(aTrack) {
		console.log("com.developedbyme.utils.audio.midiplayer.MidiPlayer::addTrack");
		
		var currentTime = 0;
		var playingNotes = new Array();
		
		var currentArray = aTrack.getEvents();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentEvent = currentArray[i];
			currentTime += currentEvent.timeOffset;
			if(currentEvent instanceof ChannelEvent) {
				console.log(currentEvent.midiType.toString(16), currentTime, currentEvent.data);
				switch(currentEvent.midiType) {
					case MidiChannelEventTypes.NOTE_ON:
						if(currentEvent.data.velocity !== 0) {
							var newNote = MidiNote.create();
							//METODO: set instrument id
							newNote.channel = currentEvent.channel;
							newNote.pitch = currentEvent.data.noteNumber;
							newNote.setStartTime(currentTime, currentEvent.data.velocity);
							playingNotes.push(newNote);
							this._notes.push(newNote);
							break;
						}
						//MENOTE: flow through, 0 velocity is note off
					case MidiChannelEventTypes.NOTE_OFF:
						var removeIndex = this._getIndexForNote(playingNotes, currentEvent.channel, currentEvent.data.noteNumber);
						console.log(removeIndex);
						if(removeIndex !== -1) {
							var currentNote = playingNotes[removeIndex];
							playingNotes.splice(removeIndex, 1);
							currentNote.setEndTime(currentTime, currentEvent.data.velocity);
						}
						else {
							//METODO: error message
						}
						break;
					case MidiChannelEventTypes.NOTE_AFTER_TOUCH:
						break;
					case MidiChannelEventTypes.CONTROLLER_MODE_CHANGE:
						break;
					case MidiChannelEventTypes.PROGRAM_CHANGE:
						break;
					case MidiChannelEventTypes.CHANNEL_AFTER_TOUCH:
						break;
					case MidiChannelEventTypes.PITCH_BEND:
						break;
					default:
						//METODO: error message
						break;
				}
			}
		}
		
		return this;
	};
	
	objectFunctions.addFile = function(aFile) {
		
		var currentArray = aFile.getTracks();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			this.addTrack(currentArray[i]);
		}
		
		return this;
	}
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("com.developedbyme.utils.audio.midiplayer.MidiPlayer::setAllReferencesToNull");
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newMidiPlayer = (new ClassReference()).init();
		
		return newMidiPlayer;
	};
});