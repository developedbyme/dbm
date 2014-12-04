dbm.runTempFunction(function() {
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	var ProcessExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ProcessExtendedEventIds");
	
	var AudioApiPlayer = dbm.importClass("dbm.utils.audio.audioapiplayer.AudioApiPlayer");
	var Sequencer = dbm.importClass("dbm.utils.audio.audioapiplayer.sequencer.Sequencer");
	
	var BpmFunctions = dbm.importClass("dbm.utils.math.music.BpmFunctions");
	var NoteLengths = dbm.importClass("dbm.utils.math.music.NoteLengths");
	
	dbm.addStartFunction(function() {
		//console.log("startFunction");
		
		//var fileName = "../audio/soundwaves/AKWF/AKWF_bw_perfectwaves/AKWF_sin.wav";
		//var fileName = "../audio/soundwaves/AKWF/AKWF_dbass/AKWF_dbass_0012.wav";
		//var fileName = "../audio/soundwaves/AKWF/AKWF_overtone/AKWF_overtone_0005.wav";
		//var fileName = "../audio/soundwaves/AKWF/AKWF_hvoice/AKWF_hvoice_0005.wav";
		//var fileName = "../audio/soundwaves/AKWF/AKWF_0004/AKWF_0306.wav";
		//var fileName = "../audio/soundwaves/AKWF/AKWF_0002/AKWF_0114.wav";
		//var fileName = "../audio/soundwaves/AKWF/AKWF_epiano/AKWF_epiano_0001.wav";
		//var fileName = "../audio/soundwaves/AKWF/AKWF_bw_sawrounded/AKWF_R_asym_saw_07.wav";
		//var fileName = "../audio/soundwaves/AKWF/AKWF_birds/AKWF_birds_0001.wav";
		var fileName = "../audio/soundwaves/AKWF/AKWF_0012/AKWF_1101.wav";
		
		var audioDecoded = function(aPlayer, aDecoder) {
			//console.log("audioDecoded");
			
			var buffer = aDecoder.getBuffer();
			
			var bpm = 240;
			var eightNoteLength = BpmFunctions.getBeatLength(bpm, NoteLengths.EIGHTH_NOTE);
			
			var note1 = aPlayer.createNote(buffer, true, 1, eightNoteLength);
			note1.connectOutput(aPlayer.getMainOutput());
			
			var note2 = aPlayer.createNote(buffer, true, 2, eightNoteLength);
			note2.connectOutput(aPlayer.getMainOutput());
			
			var note2h = aPlayer.createNote(buffer, true, 8, 0.5*eightNoteLength);
			note2h.connectOutput(aPlayer.getMainOutput());
			
			var sequencer = Sequencer.create(BpmFunctions.getBeatLength(bpm, 2));
			aPlayer.addUpdater(sequencer);
			
			sequencer.createSequencerNote(note1, 0*eightNoteLength);
			sequencer.createSequencerNote(note2, 1*eightNoteLength);
			sequencer.createSequencerNote(note1, 2*eightNoteLength);
			sequencer.createSequencerNote(note1, 4*eightNoteLength);
			sequencer.createSequencerNote(note1, 6*eightNoteLength);
			
			sequencer.createSequencerNote(note2, 8*eightNoteLength);
			sequencer.createSequencerNote(note1, 9*eightNoteLength);
			sequencer.createSequencerNote(note2, 10*eightNoteLength);
			
			sequencer.createSequencerNote(note2h, 12*eightNoteLength);
			sequencer.createSequencerNote(note2h, 13*eightNoteLength);
			sequencer.createSequencerNote(note2h, 14*eightNoteLength);
			
			aPlayer.start();
		}
		
		var fileLoaded = function() {
			//console.log("loaded");
			
			var audioApiPlayer = AudioApiPlayer.create();
			
			var decoder = audioApiPlayer.createAudioDataDecoder(dbm.singletons.dbmAssetRepository.getAssetData(fileName));
			decoder.getExtendedEvent().addCommandToEvent(ProcessExtendedEventIds.DONE, CallFunctionCommand.createCommand(this, audioDecoded, [audioApiPlayer, decoder]));
			decoder.startProcess();
		}
		
		var wavLoader = dbm.singletons.dbmAssetRepository.getAsset(fileName);
		wavLoader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, fileLoaded, []));
		wavLoader.load();
	});
});