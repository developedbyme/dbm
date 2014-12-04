dbm.runTempFunction(function() {
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	var ProcessExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ProcessExtendedEventIds");
	
	var AudioApiPlayer = dbm.importClass("dbm.utils.audio.audioapiplayer.AudioApiPlayer");
	var FixedPositionsSequencerController = dbm.importClass("dbm.utils.audio.audioapiplayer.sequencer.FixedPositionsSequencerController");
	
	var BpmFunctions = dbm.importClass("dbm.utils.math.music.BpmFunctions");
	var NoteLengths = dbm.importClass("dbm.utils.math.music.NoteLengths");
	var ScaleFunctions = dbm.importClass("dbm.utils.audio.audioapiplayer.notes.ScaleFunctions");
	var ChromaticScaleFunctions = dbm.importClass("dbm.utils.math.music.scales.ChromaticScaleFunctions");
	
	dbm.addStartFunction(function() {
		//console.log("startFunction");
		
		//var fileName = "../audio/soundwaves/AKWF/AKWF_bw_perfectwaves/AKWF_sin.wav";
		//var fileName = "../audio/soundwaves/AKWF/AKWF_dbass/AKWF_dbass_0012.wav";
		//var fileName = "../audio/soundwaves/AKWF/AKWF_overtone/AKWF_overtone_0005.wav";
		//var fileName = "../audio/soundwaves/AKWF/AKWF_hvoice/AKWF_hvoice_0005.wav";
		//var fileName = "../audio/soundwaves/AKWF/AKWF_0004/AKWF_0306.wav";
		//var fileName = "../audio/soundwaves/AKWF/AKWF_0002/AKWF_0114.wav";
		var fileName = "../audio/soundwaves/AKWF/AKWF_epiano/AKWF_epiano_0001.wav";
		//var fileName = "../audio/soundwaves/AKWF/AKWF_bw_sawrounded/AKWF_R_asym_saw_07.wav";
		//var fileName = "../audio/soundwaves/AKWF/AKWF_birds/AKWF_birds_0001.wav";
		//var fileName = "../audio/soundwaves/AKWF/AKWF_0012/AKWF_1101.wav";
		
		var audioDecoded = function(aPlayer, aDecoder) {
			//console.log("audioDecoded");
			
			var buffer = aDecoder.getBuffer();
			
			var bpm = 120;
			var eightNoteLength = BpmFunctions.getBeatLength(bpm, NoteLengths.EIGHTH_NOTE);
			
			var instruments = ["instrument1", "instrument2", "instrument3"];
			
			var sequenceController = FixedPositionsSequencerController.create(bpm, NoteLengths.EIGHTH_NOTE, instruments, 16, 8);
			aPlayer.addUpdater(sequenceController.getSequencer());
			
			var notes = ScaleFunctions.createScale(aPlayer.getContext(), aPlayer.getMainOutput(), buffer, true, eightNoteLength, true, ChromaticScaleFunctions.DIATONIC_SCALE_WITH_OCTAVE);
			
			var instrumentIndex1 = sequenceController.getTrackIndex(instruments[0]);
			sequenceController.addNotes(instrumentIndex1, notes);
			
			sequenceController.startPlayingNote(instrumentIndex1, 0, 0);
			//sequenceController.startPlayingNote(instrumentIndex1, 2, 0);
			//sequenceController.startPlayingNote(instrumentIndex1, 4, 0);
			//sequenceController.startPlayingNote(instrumentIndex1, 6, 0);
			//sequenceController.startPlayingNote(instrumentIndex1, 8, 0);
			//sequenceController.startPlayingNote(instrumentIndex1, 10, 0);
			//sequenceController.startPlayingNote(instrumentIndex1, 12, 0);
			//sequenceController.startPlayingNote(instrumentIndex1, 14, 0);
			sequenceController.startPlayingNote(instrumentIndex1, 2, 1);
			sequenceController.startPlayingNote(instrumentIndex1, 4, 2);
			sequenceController.startPlayingNote(instrumentIndex1, 6, 3);
			sequenceController.startPlayingNote(instrumentIndex1, 8, 4);
			sequenceController.startPlayingNote(instrumentIndex1, 10, 5);
			sequenceController.startPlayingNote(instrumentIndex1, 12, 6);
			sequenceController.startPlayingNote(instrumentIndex1, 14, 7);
			
			aPlayer.start();
		}
		
		var fileLoaded = function() {
			//console.log("loaded");
			
			var audioApiPlayer = AudioApiPlayer.createWithMasterGainAndDynamicProcessor();
			audioApiPlayer.getNode(AudioApiPlayer.MASTER_GAIN_NODE_NAME).gain.value = 0.3;
			
			var decoder = audioApiPlayer.createAudioDataDecoder(dbm.singletons.dbmAssetRepository.getAssetData(fileName));
			decoder.getExtendedEvent().addCommandToEvent(ProcessExtendedEventIds.DONE, CallFunctionCommand.createCommand(this, audioDecoded, [audioApiPlayer, decoder]));
			decoder.startProcess();
		}
		
		var wavLoader = dbm.singletons.dbmAssetRepository.getAsset(fileName);
		wavLoader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, fileLoaded, []));
		wavLoader.load();
	});
});