/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.speech.SpeechRecognitionProcessor", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.speech.SpeechRecognitionProcessor");
	
	var SpeechRecognitionProcessor = dbm.importClass("com.developedbyme.utils.speech.SpeechRecognitionProcessor");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var SpeechRecognitionEventIds = dbm.importClass("com.developedbyme.constants.htmlevents.SpeechRecognitionEventIds");
	
	staticFunctions._SPEECH_RECOGNITION = "speechRecognition";
	staticFunctions.DEFAULT_LANGUAGE = "en-US";
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.speech.SpeechRecognitionProcessor::_init");
		
		this.superCall();
		
		this._speechRecognition = this._createSpeechRecognition();
		
		this.getExtendedEvent().linkJavascriptEvent(this._speechRecognition, SpeechRecognitionEventIds.AUDIO_START, SpeechRecognitionEventIds.AUDIO_START, ClassReference._SPEECH_RECOGNITION, true, true);
		this.getExtendedEvent().linkJavascriptEvent(this._speechRecognition, SpeechRecognitionEventIds.SOUND_START, SpeechRecognitionEventIds.SOUND_START, ClassReference._SPEECH_RECOGNITION, true, true);
		this.getExtendedEvent().linkJavascriptEvent(this._speechRecognition, SpeechRecognitionEventIds.SPEECH_START, SpeechRecognitionEventIds.SPEECH_START, ClassReference._SPEECH_RECOGNITION, true, true);
		this.getExtendedEvent().linkJavascriptEvent(this._speechRecognition, SpeechRecognitionEventIds.SPEECH_END, SpeechRecognitionEventIds.SPEECH_END, ClassReference._SPEECH_RECOGNITION, true, true);
		this.getExtendedEvent().linkJavascriptEvent(this._speechRecognition, SpeechRecognitionEventIds.SOUND_END, SpeechRecognitionEventIds.SOUND_END, ClassReference._SPEECH_RECOGNITION, true, true);
		this.getExtendedEvent().linkJavascriptEvent(this._speechRecognition, SpeechRecognitionEventIds.AUDIO_END, SpeechRecognitionEventIds.AUDIO_END, ClassReference._SPEECH_RECOGNITION, true, true);
		this.getExtendedEvent().linkJavascriptEvent(this._speechRecognition, SpeechRecognitionEventIds.RESULT, SpeechRecognitionEventIds.RESULT, ClassReference._SPEECH_RECOGNITION, true, true);
		this.getExtendedEvent().linkJavascriptEvent(this._speechRecognition, SpeechRecognitionEventIds.NO_MATCH, SpeechRecognitionEventIds.NO_MATCH, ClassReference._SPEECH_RECOGNITION, true, true);
		this.getExtendedEvent().linkJavascriptEvent(this._speechRecognition, SpeechRecognitionEventIds.ERROR, SpeechRecognitionEventIds.ERROR, ClassReference._SPEECH_RECOGNITION, true, true);
		this.getExtendedEvent().linkJavascriptEvent(this._speechRecognition, SpeechRecognitionEventIds.START, SpeechRecognitionEventIds.START, ClassReference._SPEECH_RECOGNITION, true, true);
		this.getExtendedEvent().linkJavascriptEvent(this._speechRecognition, SpeechRecognitionEventIds.END, SpeechRecognitionEventIds.END, ClassReference._SPEECH_RECOGNITION, true, true);
		
		this.getExtendedEvent().addCommandToEvent(SpeechRecognitionEventIds.RESULT, CallFunctionCommand.createCommand(this, this._speechRecognitionResult, [GetVariableObject.createSelectDataCommand()]));
		
		this._finalText = this.createProperty("finalText", "");
		this._interimText = this.createProperty("interimText", "");
		
		return this;
	};
	
	objectFunctions._createSpeechRecognition = function() {
		if(window.SpeechRecognition !== undefined) {
			return new (window.SpeechRecognition)();
		}
		else if(window.webkitSpeechRecognition !== undefined) {
			return new (window.webkitSpeechRecognition)();
		}
		//METODO: error message
		return null;
	};
	
	objectFunctions.setup = function(aLanguage, aContinuous, aInterimResults, aMaxAlternatives) {
		
		this._speechRecognition.lang = aLanguage;
		this._speechRecognition.continuous = aContinuous;
		this._speechRecognition.interimResults = aInterimResults;
		this._speechRecognition.maxAlternatives = aMaxAlternatives;
		
		return this;
	};
	
	objectFunctions.start = function() {
		
		this._speechRecognition.start();
		this.getExtendedEvent().activateJavascriptEventLink(ClassReference._SPEECH_RECOGNITION);
		
		return this;
	};
	
	objectFunctions.stop = function() {
		
		this._speechRecognition.stop();
		
		//METODO: remove events after end event
		this.getExtendedEvent().deactivateJavascriptEventLink(ClassReference._SPEECH_RECOGNITION);
		
		return this;
	};
	
	objectFunctions.abort = function() {
		
		this._speechRecognition.abort();
		this.getExtendedEvent().deactivateJavascriptEventLink(ClassReference._SPEECH_RECOGNITION);
		
		return this;
	};
	
	objectFunctions._speechRecognitionResult = function(aEvent) {
		console.log("com.developedbyme.utils.speech.SpeechRecognitionProcessor::_speechRecognitionResult");
		console.log(aEvent);
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case SpeechRecognitionEventIds.AUDIO_START:
			case SpeechRecognitionEventIds.SOUND_START:
			case SpeechRecognitionEventIds.SPEECH_START:
			case SpeechRecognitionEventIds.SPEECH_END:
			case SpeechRecognitionEventIds.SOUND_END:
			case SpeechRecognitionEventIds.AUDIO_END:
			case SpeechRecognitionEventIds.RESULT:
			case SpeechRecognitionEventIds.NO_MATCH:
			case SpeechRecognitionEventIds.ERROR:
			case SpeechRecognitionEventIds.START:
			case SpeechRecognitionEventIds.END:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("com.developedbyme.utils.speech.SpeechRecognitionProcessor::setAllReferencesToNull");
		
		this._speechRecognition = null;
		
		this._finalText = null;
		this._interimText = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aLanguage, aContinuous, aInterimResults, aMaxAlternatives) {
		
		aLanguage = VariableAliases.valueWithDefault(aContinuous, ClassReference.DEFAULT_LANGUAGE);
		aContinuous = VariableAliases.valueWithDefault(aContinuous, true);
		aInterimResults = VariableAliases.valueWithDefault(aInterimResults, true);
		aMaxAlternatives = VariableAliases.valueWithDefault(aInterimResults, aMaxAlternatives, 1);
		
		var newSpeechRecognitionProcessor = (new ClassReference()).init();
		newSpeechRecognitionProcessor.setup(aLanguage, aContinuous, aInterimResults, aMaxAlternatives);
		return newSpeechRecognitionProcessor;
	};
});