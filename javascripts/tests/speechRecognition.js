dbm.runTempFunction(function() {
	
	var SpeechRecognitionProcessor = dbm.importClass("dbm.utils.speech.SpeechRecognitionProcessor");
	
	var startFunction = function() {
		console.log("startFunction");
		
		var newSpeechRecognitionProcessor = SpeechRecognitionProcessor.create();
		console.log(newSpeechRecognitionProcessor);
		
		newSpeechRecognitionProcessor.start();
	};
	
	dbm.addStartFunction(startFunction);
});