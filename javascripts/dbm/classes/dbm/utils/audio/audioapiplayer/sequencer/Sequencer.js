/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.audio.audioapiplayer.sequencer.Sequencer", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.audio.audioapiplayer.sequencer.Sequencer");
	
	var Sequencer = dbm.importClass("dbm.utils.audio.audioapiplayer.sequencer.Sequencer");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var SequencerNote = dbm.importClass("dbm.utils.audio.audioapiplayer.sequencer.SequencerNote");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.audio.audioapiplayer.sequencer.Sequencer::_init");
		
		this.superCall();
		
		this._notes = new Array();
		this._length = 1;
		this._startTime = 0;
		this._currentTime = -1;
		this._prepareTime = 0.25;
		
		return this;
	};
	
	objectFunctions.setLength = function(aLength) {
		//console.log("dbm.utils.audio.audioapiplayer.sequencer.Sequencer::setLength");
		//console.log(aLength);
		if(isNaN(aLength) || (aLength <= 0)) {
			//METODO: error message
			return this;
		}
		
		var oldLength = this._length;
		
		this._length = aLength;
		this._currentTime = this._length*(this._currentTime/oldLength);
		
		return this;
	};
	
	objectFunctions.createSequencerNote = function(aNote, aPosition) {
		var newNote = SequencerNote.create(aNote, aPosition);
		newNote.setLastPlayedLoopFromCurrentTime(Math.max(0, this._currentTime+this._prepareTime), this._length);
		this._notes.push(newNote);
		return newNote;
	};
	
	objectFunctions.removeSequencerNote = function(aSequencerNote) {
		var noteIndex = ArrayFunctions.indexOfInArray(this._notes, aSequencerNote);
		if(noteIndex === -1) {
			//METODO: error message
			return;
		}
		this._notes.splice(noteIndex, 1);
	};
	
	objectFunctions.update = function(aContext, aCurrentTime, aContextStartTime) {
		//console.log("dbm.utils.audio.audioapiplayer.sequencer.Sequencer::update");
		//console.log(aCurrentTime);
		
		this._currentTime = aCurrentTime-this._startTime;
		
		var currentArray = this._notes;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentNote = currentArray[i];
			var nextPlayTime = currentNote.getNextPlayTime(this._length);
			if(nextPlayTime < this._currentTime) {
				//MENOTE: can this miss any notes? Should the prepare time be here?
				currentNote.setLastPlayedLoopFromCurrentTime(this._currentTime-this._prepareTime, this._length);
			}
			if(nextPlayTime <= this._currentTime+this._prepareTime) {
				currentNote.playNote(nextPlayTime-this._startTime+aContextStartTime);
				currentNote.setLastPlayedLoopFromCurrentTime(nextPlayTime, this._length);
			}
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("dbm.utils.audio.audioapiplayer.sequencer.Sequencer::setAllReferencesToNull");
		
		this.superCall();
	};
	
	staticFunctions.create = function(aLength) {
		var newSequencer = (new ClassReference()).init();
		newSequencer.setLength(aLength);
		return newSequencer;
	};
});