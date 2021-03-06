dbm.runTempFunction(function() {
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	
	var BinaryStreamReader = dbm.importClass("dbm.utils.file.BinaryStreamReader");
	var MidiFileParser = dbm.importClass("dbm.utils.file.parsers.MidiFileParser");
	
	var MidiPlayer = dbm.importClass("dbm.utils.audio.midiplayer.MidiPlayer");
	
	var MidiMetadataTypes = dbm.importClass("dbm.constants.fileformats.midi.MidiMetadataTypes");
	
	dbm.addStartFunction(function() {
		//console.log("startFunction");
		var fileName = "../audio/midi/example.mid";
		
		var fileLoaded = function() {
			//console.log("loaded");
			
			var binaryStreamReader = BinaryStreamReader.create(dbm.singletons.dbmAssetRepository.getAssetData(fileName));
			console.log(binaryStreamReader);
			
			console.log(binaryStreamReader.readUtf8String(4));
			
			var midiFile = MidiFileParser.parseFile(binaryStreamReader);
			console.log(midiFile);
			
			var currentArray = midiFile.getTracks();
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentObject = currentArray[i];
				console.log(currentObject.getMetadata(MidiMetadataTypes.SEQUENCE_OR_TRACK_NAME), currentObject);
			}
			
			var player = MidiPlayer.create();
			player.addFile(midiFile);
			
			console.log(player);
			
			player.play();
		}
		
		var midLoader = dbm.singletons.dbmAssetRepository.getAsset(fileName);
		midLoader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, fileLoaded, []));
		midLoader.load();
	});
});