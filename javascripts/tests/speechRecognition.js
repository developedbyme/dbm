dbm.runTempFunction(function() {
	
	var SpeechRecognitionProcessor = dbm.importClass("com.developedbyme.utils.speech.SpeechRecognitionProcessor");
	
	var startFunction = function() {
		console.log("startFunction");
		
		var newSpeechRecognitionProcessor = SpeechRecognitionProcessor.create();
		console.log(newSpeechRecognitionProcessor);
		
		newSpeechRecognitionProcessor.start();
	};
	
	dbm.addStartFunction(startFunction);
});