/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.audio.midiplayer.MidiNote", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.audio.midiplayer.MidiNote");
	
	var MidiNote = dbm.importClass("com.developedbyme.utils.audio.midiplayer.MidiNote");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.audio.midiplayer.MidiNote::_init");
		
		this.superCall();
		
		this.startTime = -1;
		this.endTime = -1;
		
		this.extendedStartTime = -1;
		this.extendedEndTime = -1;
		
		this.startVelocity = -1;
		this.endVelocity = -1;
		
		this.instrumentId = -1;
		this.channel = -1;
		this.pitch = -1;
		
		return this;
	};
	
	objectFunctions.setStartTime = function(aTime, aVelocity) {
		this.startTime = aTime;
		this.startVelocity = aVelocity;
		this.extendedStartTime = aTime; //METODO: set this correctly
	};
	
	objectFunctions.setEndTime = function(aTime, aVelocity) {
		this.endTime = aTime;
		this.endVelocity = aVelocity;
		this.extendedEndTime = aTime; //METODO: set this correctly
	};
	
	objectFunctions._stateChanged = function() {
		
	};
	
	objectFunctions.getState = function(aTime) {
		//console.log("com.developedbyme.utils.audio.midiplayer.MidiNote::getState");
		
		return -1; //MEDEBUG
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("com.developedbyme.utils.audio.midiplayer.MidiNote::setAllReferencesToNull");
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newMidiNote = (new ClassReference()).init();
		
		return newMidiNote;
	};
});