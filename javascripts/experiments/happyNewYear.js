dbm.runTempFunction(function() {
	
	var HappyNewYearController = dbm.importClass("dbm.projects.experiments.happynewyear.HappyNewYearController");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var LoadingSequence = dbm.importClass("dbm.core.globalobjects.assetrepository.loaders.LoadingSequence");
	
	var FlowUpdateChainCreator = dbm.importClass("dbm.core.globalobjects.flowmanager.update.FlowUpdateChainCreator");
	
	var NumberFunctions = dbm.importClass("dbm.utils.native.number.NumberFunctions");
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var fileName = "../assets/experiments/happyNewYear/generalTimeZones.xml#timeZones";
		var prePrepareSound = "../assets/experiments/happyNewYear/sounds/beep-8.mp3";
		var prepareSound = "../assets/experiments/happyNewYear/sounds/beep-6.mp3";
		var normalSound = "../assets/experiments/happyNewYear/sounds/beep-1.mp3";
		var failSound = "../assets/experiments/happyNewYear/sounds/beep-5.mp3";
		var hornSound = "../assets/experiments/happyNewYear/sounds/caddy-horn.mp3";
		
		var fileLoaded = function(aLoader) {
			console.log("fileLoaded");
			
			var dataNode = aLoader.getData();
			
			var controller = HappyNewYearController.create();
			
			controller.parseTimeZoneXml(dataNode);
			
			controller.addSound("pre-prepare", prePrepareSound);
			controller.addSound("prepare", prepareSound);
			controller.addSound("normal", normalSound);
			controller.addSound("fail", failSound);
			controller.addSound("horn", hornSound);
			
			//var timeUpdateProperty = dbm.singletons.dbmAnimationManager._globalTimeNode.getProperty("time");
			//var flowUpdateChains2 = FlowUpdateChainCreator.createAllChainsForInputConnection(timeUpdateProperty);
			//timeUpdateProperty.setCachedDependentNodeChains(flowUpdateChains2);
			//console.log(flowUpdateChains2);
			//
			//dbm.singletons.dbmFlowManager.cacheUpdatedProperties();
		}
		
		var loaderGroup = LoadingSequence.create();
		loaderGroup.addAssetsByPath(fileName, prePrepareSound, prepareSound, normalSound, failSound, hornSound);
		
		var dataLoader = dbm.singletons.dbmAssetRepository.getAsset(fileName);
		dataLoader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, fileLoaded, [dataLoader]));
		loaderGroup.load();
		
	});
});