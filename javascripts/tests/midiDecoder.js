dbm.runTempFunction(function() {
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	var ProcessExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ProcessExtendedEventIds");
	
	var BinaryStreamReader = dbm.importClass("com.developedbyme.utils.file.BinaryStreamReader");
	
	dbm.addStartFunction(function() {
		//console.log("startFunction");
		var fileName = "../audio/midi/example.mid";
		
		var fileLoaded = function() {
			//console.log("loaded");
			
			var binaryStreamReader = BinaryStreamReader.create(dbm.singletons.dbmAssetRepository.getAssetData(fileName));
			console.log(binaryStreamReader);
			
			console.log(binaryStreamReader.readUtf8String(4));
		}
		
		var midLoader = dbm.singletons.dbmAssetRepository.getAsset(fileName);
		midLoader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, fileLoaded, []));
		midLoader.load();
	});
});