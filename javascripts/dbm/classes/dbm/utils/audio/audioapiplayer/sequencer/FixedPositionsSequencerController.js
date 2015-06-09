/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.audio.audioapiplayer.sequencer.FixedPositionsSequencerController", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.audio.audioapiplayer.sequencer.FixedPositionsSequencerController");
	
	var FixedPositionsSequencerController = dbm.importClass("dbm.utils.audio.audioapiplayer.sequencer.FixedPositionsSequencerController");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var Sequencer = dbm.importClass("dbm.utils.audio.audioapiplayer.sequencer.Sequencer");
	var MultidimensionalArrayHolder = dbm.importClass("dbm.utils.data.MultidimensionalArrayHolder");
	
	var BpmFunctions = dbm.importClass("dbm.utils.math.music.BpmFunctions");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.audio.audioapiplayer.sequencer.FixedPositionsSequencerController::_init");
		
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
		//console.log("dbm.utils.audio.audioapiplayer.sequencer.FixedPositionsSequencerController::setup");
		
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
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "addNotes", "Number of notes are greater than number of pitches.");
			currentArrayLength = this._numberOfPitches;
		}
		for(var i = 0; i < currentArrayLength; i++) {
			this._notes.setValue(aTrackIndex, i, currentArray[i]);
		}
		
		return this;
	};
	
	objectFunctions.startPlayingNote = function(aTrackIndex, aPosition, aPitch) {
		//console.log("dbm.utils.audio.audioapiplayer.sequencer.FixedPositionsSequencerController::startPlayingNote");
		var currentSequencerNote = this._sequencerLayout.getValue(aTrackIndex, aPosition, aPitch);
		if(VariableAliases.isSet(currentSequencerNote)) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "startPlayingNote", "Sequencer note already playing.");
			return;
		}
		var newNote = this._sequencer.createSequencerNote(this._notes.getValue(aTrackIndex, aPitch), this._noteTime*aPosition);
		this._sequencerLayout.setValue(aTrackIndex, aPosition, aPitch, newNote);
	};
	
	objectFunctions.stopPlayingNote = function(aTrackIndex, aPosition, aPitch) {
		var currentSequencerNote = this._sequencerLayout.getValue(aTrackIndex, aPosition, aPitch);
		if(!VariableAliases.isSet(currentSequencerNote)) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "stopPlayingNote", "Sequencer note is not playing.");
			return;
		}
		this._sequencer.removeSequencerNote(currentSequencerNote);
		this._sequencerLayout.setValue(aTrackIndex, aPosition, aPitch, null);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("dbm.utils.audio.audioapiplayer.sequencer.FixedPositionsSequencerController::setAllReferencesToNull");
		
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