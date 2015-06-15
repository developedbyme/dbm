/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("Application", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("Application");
	//"use strict";
	
	//Self reference
	var Application = dbm.importClass("Application");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var AudioApiPlayer = dbm.importClass("dbm.utils.audio.audioapiplayer.AudioApiPlayer");
	var FixedPositionsSequencerController = dbm.importClass("dbm.utils.audio.audioapiplayer.sequencer.FixedPositionsSequencerController");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var BpmFunctions = dbm.importClass("dbm.utils.math.music.BpmFunctions");
	var NoteLengths = dbm.importClass("dbm.utils.math.music.NoteLengths");
	var ScaleFunctions = dbm.importClass("dbm.utils.audio.audioapiplayer.notes.ScaleFunctions");
	var ChromaticScaleFunctions = dbm.importClass("dbm.utils.math.music.scales.ChromaticScaleFunctions");
	
	//Constants
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	var ProcessExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ProcessExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		console.log("Application::_init");
		
		this.superCall();
		
		//this._fileName = "../audio/soundwaves/AKWF/AKWF_bw_perfectwaves/AKWF_sin.wav";
		//this._fileName = "../audio/soundwaves/AKWF/AKWF_dbass/AKWF_dbass_0012.wav";
		//this._fileName = "../audio/soundwaves/AKWF/AKWF_overtone/AKWF_overtone_0005.wav";
		//this._fileName = "../audio/soundwaves/AKWF/AKWF_hvoice/AKWF_hvoice_0005.wav";
		//this._fileName = "../audio/soundwaves/AKWF/AKWF_0004/AKWF_0306.wav";
		//this._fileName = "../audio/soundwaves/AKWF/AKWF_0002/AKWF_0114.wav";
		this._fileName = "../../../audio/soundwaves/AKWF/AKWF_epiano/AKWF_epiano_0001.wav";
		//this._fileName = "../audio/soundwaves/AKWF/AKWF_bw_sawrounded/AKWF_R_asym_saw_07.wav";
		//this._fileName = "../audio/soundwaves/AKWF/AKWF_birds/AKWF_birds_0001.wav";
		//this._fileName = "../audio/soundwaves/AKWF/AKWF_0012/AKWF_1101.wav";
		
		this._assetsLoader.addAssetByPath(this._fileName);
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("Application::_createPage");
		
		var audioApiPlayer = AudioApiPlayer.createWithMasterGainAndDynamicProcessor();
		audioApiPlayer.getNode(AudioApiPlayer.MASTER_GAIN_NODE_NAME).gain.value = 0.3;
		
		var decoder = audioApiPlayer.createAudioDataDecoder(dbm.singletons.dbmAssetRepository.getAssetData(this._fileName));
		decoder.getExtendedEvent().addCommandToEvent(ProcessExtendedEventIds.DONE, CallFunctionCommand.createCommand(this, this._startPlaying, [audioApiPlayer, decoder]));
		decoder.startProcess();
	};
	
	objectFunctions._startPlaying = function(aPlayer, aDecoder) {
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
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("Application::setAllReferencesToNull");
		
		this.superCall();
	};
});