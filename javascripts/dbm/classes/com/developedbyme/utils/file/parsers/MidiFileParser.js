dbm.registerClass("com.developedbyme.utils.file.parsers.MidiFileParser", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.file.parsers.MidiFileParser");
	
	var MidiFileParser = dbm.importClass("com.developedbyme.utils.file.parsers.MidiFileParser");
	
	var MidiFile = dbm.importClass("com.developedbyme.utils.file.formats.MidiFile");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.file.parsers.MidiFileParser::_init");
		
		this.superCall();
		
		return this;
	};
	
	staticFunctions.parseTrack = function(aStreamReader, aTrackLength) {
		
		var endPosition = aStreamReader.getPosition()+aTrackLength;
		
		//while(aStreamReader.getPosition() < endPosition) {
			var currentOffset = aStreamReader.readVariableLengthUint();
			var type = aStreamReader.readUint8();
			console.log(currentOffset, type.toString(16));
		//}
		
		aStreamReader.seek(endPosition); //MEDEBUG
		return null; //MEDEBUG
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
			console.log(trackId);
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