dbm.registerClass("com.developedbyme.utils.file.parsers.MidiFileParser", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.file.parsers.MidiFileParser");
	
	var MidiFileParser = dbm.importClass("com.developedbyme.utils.file.parsers.MidiFileParser");
	
	var MidiFile = dbm.importClass("com.developedbyme.utils.file.formats.midi.MidiFile");
	var MidiTrack = dbm.importClass("com.developedbyme.utils.file.formats.midi.MidiTrack");
	
	var DataEvent = dbm.importClass("com.developedbyme.utils.file.formats.midi.events.DataEvent");
	var MetadataEvent = dbm.importClass("com.developedbyme.utils.file.formats.midi.events.MetadataEvent");
	var ChannelEvent = dbm.importClass("com.developedbyme.utils.file.formats.midi.events.ChannelEvent");
	
	var MidiEventTypes = dbm.importClass("com.developedbyme.constants.fileformats.midi.MidiEventTypes");
	var MidiMetadataTypes = dbm.importClass("com.developedbyme.constants.fileformats.midi.MidiMetadataTypes");
	var MidiChannelEventTypes = dbm.importClass("com.developedbyme.constants.fileformats.midi.MidiChannelEventTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.file.parsers.MidiFileParser::_init");
		
		this.superCall();
		
		return this;
	};
	
	staticFunctions.parseTrack = function(aStreamReader, aTrackLength) {
		
		var endPosition = aStreamReader.getPosition()+aTrackLength;
		
		var returnTrack = MidiTrack.create();
		var lastType;
		
		var debugCounter = 0;
		while(aStreamReader.getPosition() < endPosition) {
			if(debugCounter++ > 10000) {
				//METODO: error message
				break;
			}
			var timeOffset = aStreamReader.readVariableLengthUint();
			var type = aStreamReader.readUint8();
			//console.log(timeOffset, type.toString(16));
			switch(type) {
				case MidiEventTypes.METADATA:
					var metaType = aStreamReader.readUint8();
					var dataLength = aStreamReader.readVariableLengthUint();
					var data = null;
					switch(metaType) {
						case MidiMetadataTypes.SEQUENCE_NUMBER:
							if(dataLength != 2) {
								//METODO: error
							}
							data = aStreamReader.readUint16();
							break;
						//Text events
						case MidiMetadataTypes.TEXT:
						case MidiMetadataTypes.COPYRIGHT:
						case MidiMetadataTypes.SEQUENCE_OR_TRACK_NAME:
						case MidiMetadataTypes.INSTRUMENT_NAME:
						case MidiMetadataTypes.LYRIC:
						case MidiMetadataTypes.MARKER:
						case MidiMetadataTypes.CUE_POINT:
							data = aStreamReader.readUtf8String(dataLength);
							break;
						case MidiMetadataTypes.MIDI_CHANNEL_PREFIX:
							if(dataLength != 2) {
								//METODO: error
							}
							data = aStreamReader.readUint8();
							break;
						case MidiMetadataTypes.END_OF_TRACK:
							if(dataLength != 0) {
								//METODO: error
							}
							break;
						case MidiMetadataTypes.SET_TEMPO:
							if(dataLength != 3) {
								//METODO: error
							}
							data = aStreamReader.readUint(3);
							break;
						case MidiMetadataTypes.SMPTE_OFFSET:
							if(dataLength != 5) {
								//METODO: error
							}
							data = new Object();
							var frameRateHourByte = aStreamReader.readUint8();
							switch(frameRateHourByte & 0x60) {
								case 0x00:
									data["frameRate"] = 24;
									break;
								case 0x20:
									data["frameRate"] = 25;
									break;
								case 0x40:
									data["frameRate"] = 29;
									break;
								case 0x60:
									data["frameRate"] = 30;
									break;
								default:
									//METODO: error message
									break;
							}
							data["hour"] = frameRateHourByte & 0x1f;
							data["minute"] = aStreamReader.readUint8();
							data["second"] = aStreamReader.readUint8();
							data["frame"] = aStreamReader.readUint8();
							data["subframe"] = aStreamReader.readUint8();
							break;
						case MidiMetadataTypes.TIME_SIGNATURE:
							data = new Object();
							data["numerator"] = aStreamReader.readUint8();
							data["denominator"] = Math.pow(2, aStreamReader.readUint8());
							data["metronomeClicks"] = aStreamReader.readUint8();
							data["numberOf32Notes"] = aStreamReader.readUint8();
							break;
						case MidiMetadataTypes.KEY_SIGNATURE:
							if(dataLength != 2) {
								//METODO: error
							}
							data = new Object();
							data["key"] = aStreamReader.readInt8();
							data["minor"] = aStreamReader.readUint8();
							break;
						case MidiMetadataTypes.SEQUENCE_SPECIFIC:
							data = aStreamReader.readData(dataLength);
							break;
						default:
							//METODO: error message
							data = aStreamReader.readData(dataLength);
							break;
					}
					returnTrack.addEvent(MetadataEvent.create(timeOffset, type, metaType, data));
					break;
				case MidiEventTypes.SYSTEM_EXCLUSIVE:
				case MidiEventTypes.SYSTEM_EXCLUSIVE_CONTINUATION:
					dataLength = aStreamReader.readVariableLengthUint();
					data = aStreamReader.readData(dataLength);
					returnTrack.addEvent(DataEvent.create(timeOffset, type, data));
					break;
				//Unrecognized codes
				case 0xF1:
				case 0xF2:
				case 0xF3:
				case 0xF4:
				case 0xF5:
				case 0xF6:
				case 0xFA:
				case 0xFB:
				case 0xFC:
				case 0xFD:
				case 0xFE:
					//METODO: error message
					break;
				//MIDI events
				default:
					var firstParameter;
					if ((type & 0x80) == 0) {
						firstParameter = type;
						type = lastType;
					}
					else {
						firstParameter = aStreamReader.readUint8();
					}
					var midiType = type & 0xF0;
					var channel = type & 0x0F;
					data = ChannelEvent.create(timeOffset, type, midiType, channel);
					switch(midiType) {
						case MidiChannelEventTypes.NOTE_OFF:
							data.data = {"noteNumber": firstParameter, "velocity": aStreamReader.readUint8()};
							break;
						case MidiChannelEventTypes.NOTE_ON:
							data.data = {"noteNumber": firstParameter, "velocity": aStreamReader.readUint8()};
							break;
						case MidiChannelEventTypes.NOTE_AFTER_TOUCH:
							data.data = {"noteNumber": firstParameter, "pressure": aStreamReader.readUint8()};
							break;
						case MidiChannelEventTypes.CONTROLLER_MODE_CHANGE:
							data.data = {"type": firstParameter, "value": aStreamReader.readUint8()};
							break;
						case MidiChannelEventTypes.PROGRAM_CHANGE:
							data.data = {"programId": firstParameter};
							break;
						case MidiChannelEventTypes.CHANNEL_AFTER_TOUCH:
							data.data = {"pressure": firstParameter};
							break;
						case MidiChannelEventTypes.PITCH_BEND:
							data.data = {"lsb": firstParameter, "msb": aStreamReader.readUint8()};
							break;
						default:
							//METODO: error message
							break;
					}
					returnTrack.addEvent(data);
					break;
			}
			
			lastType = type;
		}
		
		aStreamReader.seek(endPosition); //MENOTE: this is just for security
		return returnTrack;
	};
	
	staticFunctions.parseFile = function(aStreamReader) {
		
		aStreamReader.seek(0); //MENOTE: should this be here or might you want to start in another format
		
		var headerId = aStreamReader.readUtf8String(4);
		if(headerId !== "MThd") {
			//METODO: error message
			return null;
		}
		var headerLength = aStreamReader.readUint32();
		if(headerLength !== 6) {
			//METODO: error message
			return null;
		}
		
		var newMidiFile = MidiFile.create();
		
		var formatType = aStreamReader.readUint16();
		var numberOfTracks = aStreamReader.readUint16();
		var timeDivision = aStreamReader.readUint16();
		
		newMidiFile.setupFormat(formatType, numberOfTracks, timeDivision);
		
		for(var i = 0; i < numberOfTracks; i++) {
			var trackId = aStreamReader.readUtf8String(4);
			if(trackId !== "MTrk") {
				//METODO: error message
				return null;
			}
			var trackLength = aStreamReader.readUint32();
			var newTrack = ClassReference.parseTrack(aStreamReader, trackLength);
			newMidiFile.setTrack(i, newTrack);
		}
		
		return newMidiFile;
	};
});