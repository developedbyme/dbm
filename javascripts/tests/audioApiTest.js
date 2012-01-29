dbm.runTempFunction(function() {
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		//var fileName = "../audio/soundwaves/AKWF/AKWF_bw_perfectwaves/AKWF_sin.wav";
		//var fileName = "../audio/soundwaves/AKWF/AKWF_dbass/AKWF_dbass_0012.wav";
		//var fileName = "../audio/soundwaves/AKWF/AKWF_overtone/AKWF_overtone_0005.wav";
		var fileName = "../audio/soundwaves/AKWF/AKWF_hvoice/AKWF_hvoice_0005.wav";
		var fileName = "../audio/soundwaves/AKWF/AKWF_0004/AKWF_0306.wav";
		var fileName = "../audio/soundwaves/AKWF/AKWF_0002/AKWF_0114.wav";
		var fileName = "../audio/soundwaves/AKWF/AKWF_epiano/AKWF_epiano_0001.wav";
		var fileName = "../audio/soundwaves/AKWF/AKWF_bw_sawrounded/AKWF_R_asym_saw_07.wav";
		var fileName = "../audio/soundwaves/AKWF/AKWF_birds/AKWF_birds_0001.wav";
		var fileName = "../audio/soundwaves/AKWF/AKWF_0012/AKWF_1101.wav";
		
		var startFunction = function() {
			console.log("loaded");
			
			var audioContext = new webkitAudioContext();
			
			audioContext.decodeAudioData(dbm.singletons.dbmAssetRepository.getAssetData(fileName), function(aBuffer) {
				var sineSource =  audioContext.createBufferSource();
				sineSource.buffer = aBuffer;
				sineSource.loop = true;
				sineSource.playbackRate.setValueAtTime(1, 0);
				sineSource.playbackRate.linearRampToValueAtTime(2, 3);
				sineSource.noteOn(0); 
				
				var masterGain = audioContext.createGainNode();
				masterGain.gain.value = 0.5;
				masterGain.gain.setValueAtTime(0.5, 5);
				masterGain.gain.linearRampToValueAtTime(0, 8);
				sineSource.connect(masterGain);
				masterGain.connect(audioContext.destination);
				
				var updateTime = function(aTime) {
					console.log(aTime);
				}
				
				dbm.singletons.dbmUpdateManager.addUpdatedFunction(this, updateTime, "default");
				
			}, function Error() {});
		}
		
		var wavLoader = dbm.singletons.dbmAssetRepository.getAsset(fileName);
		wavLoader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, startFunction, []));
		wavLoader.load();
	});
});