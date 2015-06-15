/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.audio.audioapiplayer.notes.Note", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.audio.audioapiplayer.notes.Note");
	
	var Note = dbm.importClass("dbm.utils.audio.audioapiplayer.notes.Note");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.audio.audioapiplayer.notes.Note::_init");
		
		this.superCall();
		
		this._context = null;
		this._connectedOutput = null;
		this._source = null;
		this._duration = 0;
		
		return this;
	};
	
	objectFunctions.setup = function(aContext, aSource, aDuration) {
		
		aDuration = VariableAliases.valueWithDefault(aDuration, -1);
		
		this._context = aContext;
		this._source = aSource;
		this._duration = (aDuration !== -1) ? aDuration : this._source.buffer.duration*this._source.playbackRate.value;
		
		return this;
	};
	
	objectFunctions.connectOutput = function(aOutput) {
		this._connectedOutput = aOutput;
		
		return this;
	};
	
	objectFunctions.playAt = function(aTime) {
		
		this._source.connect(this._connectedOutput);
		this._source.start(aTime);
		
		if(this._source.loop) {
			this._source.stop(aTime+this._duration);
		}
		
		this._source = this._createNewSource(); //MENOTE: sources can only be played once
		
		return this;
	};
	
	objectFunctions._createNewSource = function() {
		var newSource = this._context.createBufferSource();
		newSource.buffer = this._source.buffer;
		newSource.loop = this._source.loop;
		newSource.playbackRate.value = this._source.playbackRate.value;
		
		return newSource;
	};
	
	objectFunctions.duplicate = function() {
		var newNote = ClassReference.create(this._context, this._createNewSource(), this._duration);
		newNote.connectOutput(this._connectedOutput);
		return newNote;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("dbm.utils.audio.audioapiplayer.notes.Note::setAllReferencesToNull");
		
		this._connectedOutput = null;
		this._context = null;
		this._source = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aContext, aSource, aDuration) {
		var newNote = (new ClassReference()).init();
		newNote.setup(aContext, aSource, aDuration);
		return newNote;
	};
	
	staticFunctions.getBestLoopPoint = function(aSource, aTargetedDuration) {
		var loopLength = aSource.buffer.duration*aSource.playbackRate.value;
		var times = Math.round(aTargetedDuration/loopLength);
		console.log(aSource.buffer.duration, aSource.playbackRate.value, times, loopLength*times);
		return loopLength*times;
	};
});