/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.file.formats.midi.MidiFile", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.file.formats.midi.MidiFile");
	
	var MidiFile = dbm.importClass("dbm.utils.file.formats.midi.MidiFile");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.file.formats.midi.MidiFile::_init");
		
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
	
	objectFunctions.getNumberOfTracks = function() {
		return this._numberOfTracks;
	};
	
	objectFunctions.getTracks = function() {
		return this._tracks;
	};
	
	staticFunctions.create = function() {
		var newMidiFile = (new ClassReference()).init();
		
		return newMidiFile;
	};
});