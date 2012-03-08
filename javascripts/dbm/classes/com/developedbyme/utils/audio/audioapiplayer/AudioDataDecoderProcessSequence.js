dbm.registerClass("com.developedbyme.utils.audio.audioapiplayer.AudioDataDecoderProcessSequence", "com.developedbyme.utils.process.ProcessSequence", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.audio.audioapiplayer.AudioDataDecoderProcessSequence");
	
	var AudioDataDecoderProcessSequence = dbm.importClass("com.developedbyme.utils.audio.audioapiplayer.AudioDataDecoderProcessSequence");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var UpdateChain = dbm.importClass("com.developedbyme.core.globalobjects.updatemanager.objects.UpdateChain");
	
	var ProcessExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ProcessExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.audio.audioapiplayer.AudioDataDecoderProcessSequence::_init");
		
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
		//console.log("com.developedbyme.utils.audio.audioapiplayer.AudioDataDecoderProcessSequence::setAllReferencesToNull");
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newNode = (new ClassReference()).init();
		return newNode;
	};
});