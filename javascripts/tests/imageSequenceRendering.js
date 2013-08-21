dbm.runTempFunction(function() {
	
	var ImageSequenceRenderingApplication = dbm.importClass("com.developedbyme.projects.tests.imagesequencerendering.ImageSequenceRenderingApplication");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var DomManipulationFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomManipulationFunctions");
	var NumberFunctions = dbm.importClass("com.developedbyme.utils.native.number.NumberFunctions");
	
	var LoadingSequence = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.loaders.LoadingSequence");
	
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var addFiles = function(aPath, aNumberOfFiles, aPadding, aHolderArray, aLoader) {
			var filePaths = new Array(aNumberOfFiles);
			for(var i = 0; i < aNumberOfFiles; i++) {
				var currentPath = aPath + NumberFunctions.getPaddedNumber(i, aPadding) + ".jpg";
				filePaths[i] = currentPath;
				aLoader.addAssetByPath(currentPath);
			}
			aHolderArray.push(filePaths);
		} ;
		
		var filesArray = new Array();
		var loader = LoadingSequence.create();
		
		addFiles("../assets/experiments/imageSequencePlayer/512/1A_4_256/1A_4_256_", 36, 0, filesArray, loader);
		addFiles("../assets/experiments/imageSequencePlayer/512/1B_4_256/1B_4_256_", 10, 0, filesArray, loader);
		addFiles("../assets/experiments/imageSequencePlayer/512/2A_4_256/2A_4_256_", 36, 0, filesArray, loader);
		addFiles("../assets/experiments/imageSequencePlayer/512/2B_4_256/2B_4_256_", 71, 0, filesArray, loader);
		addFiles("../assets/experiments/imageSequencePlayer/512/2C_4_256/2C_4_256_", 71, 0, filesArray, loader);
		addFiles("../assets/experiments/imageSequencePlayer/512/2D_4_256/2D_4_256_", 36, 0, filesArray, loader);
		
		var filesLoaded = function() {
			console.log("filesLoaded");
			
			var application = ImageSequenceRenderingApplication.create(dbm.getDocument().body, filesArray.length, 512, 288, filesArray);
			application.start();
		}
		
		loader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, filesLoaded, []));
		loader.load();
	});
});