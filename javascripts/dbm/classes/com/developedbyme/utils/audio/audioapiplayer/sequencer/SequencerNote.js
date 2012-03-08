dbm.registerClass("com.developedbyme.utils.audio.audioapiplayer.sequencer.SequencerNote", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.audio.audioapiplayer.sequencer.SequencerNote");
	
	var SequencerNote = dbm.importClass("com.developedbyme.utils.audio.audioapiplayer.sequencer.SequencerNote");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.audio.audioapiplayer.sequencer.SequencerNote::_init");
		
		this.superCall();
		
		this._note = null;
		this._lastPlayedLoop = -1;
		this._position = 0;
		
		return this;
	};
	
	objectFunctions.setup = function(aNote, aPosition) {
		this._note = aNote;
		this._position = aPosition;
		
		return this;
	};
	
	objectFunctions.getNextPlayTime = function(aLoopLength) {
		//console.log("com.developedbyme.utils.audio.audioapiplayer.sequencer.SequencerNote::getNextPlayTime");
		//console.log(aLoopLength, this._position, this._lastPlayedLoop, this._position+aLoopLength*(this._lastPlayedLoop+1));
		return this._position+aLoopLength*(this._lastPlayedLoop+1);
	};
	
	objectFunctions.setLastPlayedLoop = function(aLoop) {
		this._lastPlayedLoop = aLoop;
	};
	
	objectFunctions.playNote = function(aTime) {
		//console.log("com.developedbyme.utils.audio.audioapiplayer.sequencer.SequencerNote::playNote");
		this._note.playAt(aTime);
	};
	
	objectFunctions.setLastPlayedLoopFromCurrentTime = function(aCurrentTime, aLoopLength) {
		//console.log("com.developedbyme.utils.audio.audioapiplayer.sequencer.SequencerNote::setLastPlayedLoopFromCurrentTime");
		//console.log(aCurrentTime, this._position, aLoopLength);
		this._lastPlayedLoop = Math.floor((aCurrentTime-this._position)/aLoopLength);
	}
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("com.developedbyme.utils.audio.audioapiplayer.sequencer.SequencerNote::setAllReferencesToNull");
		
		this.superCall();
	};
	
	staticFunctions.create = function(aNote, aPosition) {
		var newSequencerNote = (new ClassReference()).init();
		newSequencerNote.setup(aNote, aPosition);
		return newSequencerNote;
	};
});