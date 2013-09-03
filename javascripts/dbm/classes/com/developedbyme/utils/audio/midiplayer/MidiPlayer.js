dbm.registerClass("com.developedbyme.utils.audio.midiplayer.MidiPlayer", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.audio.midiplayer.MidiPlayer");
	
	var MidiPlayer = dbm.importClass("com.developedbyme.utils.audio.midiplayer.MidiPlayer");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var MidiNote = dbm.importClass("com.developedbyme.utils.audio.midiplayer.MidiNote");
	var ChannelEvent = dbm.importClass("com.developedbyme.utils.file.formats.midi.events.ChannelEvent");
	
	var PlaybackNode = dbm.importClass("com.developedbyme.flow.nodes.time.PlaybackNode");
	var Timeline = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	var CommandTimerNode = dbm.importClass("com.developedbyme.flow.nodes.animation.CommandTimerNode");
	
	var MidiEventTypes = dbm.importClass("com.developedbyme.constants.fileformats.midi.MidiEventTypes");
	var MidiChannelEventTypes = dbm.importClass("com.developedbyme.constants.fileformats.midi.MidiChannelEventTypes");
	var MidiMetadataTypes = dbm.importClass("com.developedbyme.constants.fileformats.midi.MidiMetadataTypes");
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	var LogCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.debug.LogCommand");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.audio.midiplayer.MidiPlayer::_init");
		
		this.superCall();
		
		this._endTime = 0;
		this._lastTempo = 0;
		this._lastTempoChangeTime = 0;
		this._lastTempoChangePosition = 0;
		this._notes = new Array();
		this._playback = PlaybackNode.create();
		this._playback.setPropertyInput("inputTime", dbm.singletons.dbmAnimationManager.globalTimeProperty); //METODO: adjust so you can set this
		this._speedTimeline = Timeline.create(0);
		this._speedTimeline.setValueAt(0, 0);
		this._speedTimeline.getProperty("time").connectInput(this._playback.getProperty("outputTime"));
		this._notesPlaybackCommand = CommandTimerNode.create(this._speedTimeline.getProperty("outputValue"));
		
		return this;
	};
	
	objectFunctions.play = function() {
		this._playback.play();
		this._notesPlaybackCommand.getProperty("currentPosition").startUpdating();
		return this;
	};
	
	objectFunctions.pause = function() {
		this._playback.pause();
		this._notesPlaybackCommand.getProperty("currentPosition").stopUpdating();
		return this;
	};
	
	objectFunctions.rewind = function() {
		this._playback.rewind();
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
	
	objectFunctions.addTrack = function(aTrack, aTicksPerQuarterNote) {
		console.log("com.developedbyme.utils.audio.midiplayer.MidiPlayer::addTrack");
		
		var currentInstrument = -1;
		var currentTime = 0;
		var playingNotes = new Array();
		
		var currentArray = aTrack.getEvents();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentEvent = currentArray[i];
			currentTime += currentEvent.timeOffset;
			if(currentEvent instanceof ChannelEvent) {
				switch(currentEvent.midiType) {
					case MidiChannelEventTypes.NOTE_ON:
						if(currentEvent.data.velocity !== 0) {
							var newNote = MidiNote.create();
							newNote.instrumentId = currentInstrument;
							newNote.channel = currentEvent.channel;
							newNote.pitch = currentEvent.data.noteNumber;
							newNote.setStartTime(currentTime, currentEvent.data.velocity);
							playingNotes.push(newNote);
							this._notes.push(newNote);
							this._notesPlaybackCommand.addCommandAt(LogCommand.createCommand("Start", newNote.instrumentId, newNote.pitch), LogCommand.createCommand("Unstart", newNote.instrumentId, newNote.pitch), currentTime);
							break;
						}
						//MENOTE: flow through, 0 velocity is note off
					case MidiChannelEventTypes.NOTE_OFF:
						var removeIndex = this._getIndexForNote(playingNotes, currentEvent.channel, currentEvent.data.noteNumber);
						if(removeIndex !== -1) {
							var currentNote = playingNotes[removeIndex];
							playingNotes.splice(removeIndex, 1);
							currentNote.setEndTime(currentTime, currentEvent.data.velocity);
							this._notesPlaybackCommand.addCommandAt(LogCommand.createCommand("Stop", newNote.instrumentId, newNote.pitch), LogCommand.createCommand("Unstop", newNote.instrumentId, newNote.pitch), currentTime);
						}
						else {
							//METODO: error message
						}
						break;
					case MidiChannelEventTypes.NOTE_AFTER_TOUCH:
						console.log(currentEvent.midiType.toString(16), currentTime, currentEvent.data);
						//METODO
						break;
					case MidiChannelEventTypes.CONTROLLER_MODE_CHANGE:
						console.log(currentEvent.midiType.toString(16), currentTime, currentEvent.data);
						//METODO
						break;
					case MidiChannelEventTypes.PROGRAM_CHANGE:
						currentInstrument = currentEvent.data.programId;
						break;
					case MidiChannelEventTypes.CHANNEL_AFTER_TOUCH:
						console.log(currentEvent.midiType.toString(16), currentTime, currentEvent.data);
						//METODO
						break;
					case MidiChannelEventTypes.PITCH_BEND:
						console.log(currentEvent.midiType.toString(16), currentTime, currentEvent.data);
						//METODO
						break;
					default:
						//METODO: error message
						break;
				}
			}
			else if(currentEvent.type === MidiEventTypes.METADATA) {
				console.log(currentEvent.metadataType, currentTime, currentEvent);
				switch(currentEvent.metadataType) {
					case MidiMetadataTypes.SET_TEMPO:
						if(this._lastTempoChangePosition !== currentTime) {
							//METODO
						}
						this._lastTempo = aTicksPerQuarterNote/(0.000001*currentEvent.data);
						break;
					case MidiMetadataTypes.END_OF_TRACK:
						this._endTime = Math.max(this._endTime, currentTime);
						break;
					default:
						//MENOTE: do nothing
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
			this.addTrack(currentArray[i], aFile._timeDivision); //MENOTE: expose time division publicly
		}
		
		var animationTime = (this._endTime-this._lastTempoChangePosition)/this._lastTempo;
		this._speedTimeline.animateValueAt(this._endTime, animationTime, InterpolationTypes.LINEAR, this._lastTempoChangeTime);
		console.log(this._endTime, animationTime, this._lastTempoChangePosition, this._lastTempo);
		this._playback.setPropertyInput("maxTime", animationTime+this._lastTempoChangeTime);
		
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