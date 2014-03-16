/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.audio.audioapiplayer.sequencer.FixedPositionsSequencerController", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.audio.audioapiplayer.sequencer.FixedPositionsSequencerController");
	
	var FixedPositionsSequencerController = dbm.importClass("com.developedbyme.utils.audio.audioapiplayer.sequencer.FixedPositionsSequencerController");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var Sequencer = dbm.importClass("com.developedbyme.utils.audio.audioapiplayer.sequencer.Sequencer");
	var MultidimensionalArrayHolder = dbm.importClass("com.developedbyme.utils.data.MultidimensionalArrayHolder");
	
	var BpmFunctions = dbm.importClass("com.developedbyme.utils.math.music.BpmFunctions");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.audio.audioapiplayer.sequencer.FixedPositionsSequencerController::_init");
		
		this.superCall();
		
		this._bpm = -1;
		this._noteLength = -1;
		this._noteTime = -1;
		this._numberOfPositions = -1;
		this._numberOfPitches = -1;
		
		this._sequencer = null;
		this._notes = null;
		this._sequencerLayout = null;
		this._tracks = null;
		
		return this;
	};
	
	objectFunctions.getSequencer = function() {
		return this._sequencer;
	};
	
	objectFunctions.setup = function(aBpm, aNoteLength, aTracks, aNumberOfPosition, aNumberOfPitches) {
		//console.log("com.developedbyme.utils.audio.audioapiplayer.sequencer.FixedPositionsSequencerController::setup");
		
		this._bpm = aBpm;
		this._noteLength = aNoteLength;
		this._noteTime = BpmFunctions.getBeatLength(this._bpm, this._noteLength);
		this._numberOfPositions = aNumberOfPosition;
		this._numberOfPitches = aNumberOfPitches;
		
		this._tracks = aTracks;
		
		this._sequencer = Sequencer.create(this._noteTime*aNumberOfPosition);
		this.addDestroyableObject(this._sequencer);
		this._sequencerLayout = MultidimensionalArrayHolder.create(aTracks.length, aNumberOfPosition, aNumberOfPitches);
		this.addDestroyableObject(this._sequencerLayout);
		this._notes = MultidimensionalArrayHolder.create(aTracks.length, aNumberOfPitches);
		this.addDestroyableObject(this._notes);
		
		return this;
	};
	
	objectFunctions.getTrackIndex = function(aName) {
		return ArrayFunctions.indexOfInArray(this._tracks, aName);
	};
	
	objectFunctions.addNotes = function(aTrackIndex, aNotes) {
		var currentArray = aNotes;
		var currentArrayLength = currentArray.length;
		if(currentArrayLength > this._numberOfPitches) {
			//METODO: error message
			currentArrayLength = this._numberOfPitches;
		}
		for(var i = 0; i < currentArrayLength; i++) {
			this._notes.setValue(aTrackIndex, i, currentArray[i]);
		}
		
		return this;
	};
	
	objectFunctions.startPlayingNote = function(aTrackIndex, aPosition, aPitch) {
		//console.log("com.developedbyme.utils.audio.audioapiplayer.sequencer.FixedPositionsSequencerController::startPlayingNote");
		var currentSequencerNote = this._sequencerLayout.getValue(aTrackIndex, aPosition, aPitch);
		if(currentSequencerNote !== null) {
			//METODO: warning message
			return;
		}
		var newNote = this._sequencer.createSequencerNote(this._notes.getValue(aTrackIndex, aPitch), this._noteTime*aPosition);
		this._sequencerLayout.setValue(aTrackIndex, aPosition, aPitch, newNote);
	};
	
	objectFunctions.stopPlayingNote = function(aTrackIndex, aPosition, aPitch) {
		var currentSequencerNote = this._sequencerLayout.getValue(aTrackIndex, aPosition, aPitch);
		if(currentSequencerNote === null) {
			//METODO: error message
			return;
		}
		this._sequencer.removeSequencerNote(currentSequencerNote);
		this._sequencerLayout.setValue(aTrackIndex, aPosition, aPitch, null);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("com.developedbyme.utils.audio.audioapiplayer.sequencer.FixedPositionsSequencerController::setAllReferencesToNull");
		
		this._sequencer = null;
		this._notes = null;
		this._sequencerLayout = null;
		this._tracks = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aBpm, aNoteLength, aTracks, aNumberOfPosition, aNumberOfPitches) {
		var newFixedPositionsSequencerController = (new ClassReference()).init();
		newFixedPositionsSequencerController.setup(aBpm, aNoteLength, aTracks, aNumberOfPosition, aNumberOfPitches);
		return newFixedPositionsSequencerController;
	};
});