dbm.registerClass("com.developedbyme.utils.file.formats.MidiFile", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.file.formats.MidiFile");
	
	var MidiFile = dbm.importClass("com.developedbyme.utils.file.formats.MidiFile");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.file.formats.MidiFile::_init");
		
		this.superCall();
		
		this._formatType = null;
		this._numberOfTracks = null;
		this._timeDivision = null;
		
		this._tracks = null;
		
		return this;
	};
	
	objectFunctions.setupFormat = function(aFormatType, aNumberOfTracks, aTimeDivision) {
		this._formatType = aFormatType;
		this._numberOfTracks = aNumberOfTracks;
		this._timeDivision = aTimeDivision;
		
		this._tracks = new Array(this._numberOfTracks);
		
		return this;
	};
	
	objectFunctions.setTrack = function(aIndex, aData) {
		this._tracks[aIndex] = aData;
		
		return this;
	};
	
	staticFunctions.create = function() {
		var newMidiFile = (new ClassReference()).init();
		
		return newMidiFile;
	};
});