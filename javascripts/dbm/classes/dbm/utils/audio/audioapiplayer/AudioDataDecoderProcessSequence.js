/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.audio.audioapiplayer.AudioDataDecoderProcessSequence", "dbm.utils.process.ProcessSequence", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.audio.audioapiplayer.AudioDataDecoderProcessSequence");
	
	var AudioDataDecoderProcessSequence = dbm.importClass("dbm.utils.audio.audioapiplayer.AudioDataDecoderProcessSequence");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var UpdateChain = dbm.importClass("dbm.core.globalobjects.updatemanager.objects.UpdateChain");
	
	var ProcessExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ProcessExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.audio.audioapiplayer.AudioDataDecoderProcessSequence::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.startProcess = function() {
		
		return  this;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case ProcessExtendedEventIds.DONE:
			case ProcessExtendedEventIds.ERROR:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("dbm.utils.audio.audioapiplayer.AudioDataDecoderProcessSequence::setAllReferencesToNull");
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newNode = (new ClassReference()).init();
		return newNode;
	};
});