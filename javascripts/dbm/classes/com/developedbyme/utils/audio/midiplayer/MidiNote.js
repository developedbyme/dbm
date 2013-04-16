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
		
		this.startTime = -1;
		this.endTime = -1;
		
		this.instrumentId = -1;
		this.channel = -1;
		this.pitch = -1;
		
		return this;
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