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
	var Sequencer = dbm.importClass("dbm.utils.audio.audioapiplayer.sequencer.Sequencer");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var BpmFunctions = dbm.importClass("dbm.utils.math.music.BpmFunctions");
	var NoteLengths = dbm.importClass("dbm.utils.math.music.NoteLengths");
	
	//Constants
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	var ProcessExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ProcessExtendedEventIds");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		console.log("Application::_init");
		
		this.superCall();
		
		//this._fileName = "dbm-assets/audio/soundwaves/AKWF/AKWF_bw_perfectwaves/AKWF_sin.wav";
		//this._fileName = "dbm-assets/audio/soundwaves/AKWF/AKWF_dbass/AKWF_dbass_0012.wav";
		//this._fileName = "dbm-assets/audio/soundwaves/AKWF/AKWF_overtone/AKWF_overtone_0005.wav";
		//this._fileName = "dbm-assets/audio/soundwaves/AKWF/AKWF_hvoice/AKWF_hvoice_0005.wav";
		//this._fileName = "dbm-assets/audio/soundwaves/AKWF/AKWF_0004/AKWF_0306.wav";
		//this._fileName = "dbm-assets/audio/soundwaves/AKWF/AKWF_0002/AKWF_0114.wav";
		//this._fileName = "dbm-assets/audio/soundwaves/AKWF/AKWF_epiano/AKWF_epiano_0001.wav";
		//this._fileName = "dbm-assets/audio/soundwaves/AKWF/AKWF_bw_sawrounded/AKWF_R_asym_saw_07.wav";
		//this._fileName = "dbm-assets/audio/soundwaves/AKWF/AKWF_birds/AKWF_birds_0001.wav";
		this._fileName = "dbm-assets/audio/soundwaves/AKWF/AKWF_0012/AKWF_1101.wav";
		
		//this._addTemplate("main", "assets/templates.html#main");
		
		this._assetsLoader.addAssetByPath(this._fileName);
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("Application::_createPage");
		
		//var templateResult = this._createControllerFromTemplate("main");
		//var mainController = templateResult.mainController;
		
		//MENOTE: implement application here
		
		var audioApiPlayer = AudioApiPlayer.create();
		
		var decoder = audioApiPlayer.createAudioDataDecoder(dbm.singletons.dbmAssetRepository.getAssetData(this._fileName));
		decoder.getExtendedEvent().addCommandToEvent(ProcessExtendedEventIds.DONE, CallFunctionCommand.createCommand(this, this._startSequencer, [audioApiPlayer, decoder]));
		decoder.startProcess();
	};
	
	objectFunctions._startSequencer = function(aPlayer, aDecoder) {
		//console.log("Application::_startSequencer");
		
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
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("Application::setAllReferencesToNull");
		
		this.superCall();
	};
});