/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Sets up the asset creator for use in a browse.
 */
dbm.registerClass("dbm.core.globalobjects.assetrepository.setup.DefaultAssetRepositoryBrowserSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.assetrepository.setup.DefaultAssetRepositoryBrowserSetup");
	//"use strict";
	
	//Self reference
	var DefaultAssetRepositoryBrowserSetup = dbm.importClass("dbm.core.globalobjects.assetrepository.setup.DefaultAssetRepositoryBrowserSetup");
	
	//Error report
	
	//Dependencies
	var PathAssetCreator = dbm.importClass("dbm.core.globalobjects.assetrepository.assetcreators.PathAssetCreator");
	var TransformedPathAssetCreator = dbm.importClass("dbm.core.globalobjects.assetrepository.assetcreators.TransformedPathAssetCreator");
	var ImageAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.ImageAsset");
	var XmlAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.XmlAsset");
	var TextAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.TextAsset");
	var JsonAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.JsonAsset");
	var AudioAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.AudioAsset");
	var VideoAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.VideoAsset");
	var ArrayBufferAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.ArrayBufferAsset");
	
	//Utils
	var ReplaceStringObject = dbm.importClass("dbm.utils.reevaluation.manipulationreevaluation.ReplaceStringObject");
	var SelectBaseObjectObject = dbm.importClass("dbm.utils.reevaluation.staticreevaluation.SelectBaseObjectObject");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var PseudoFileExtensions = dbm.importClass("dbm.constants.PseudoFileExtensions");
	
	/**
	 * Sets up the asset repository for browser use.
	 */
	staticFunctions.setup = function() {
		dbm.singletons.dbmAssetRepository.addAssetCreatorForTypes(PathAssetCreator.create(ImageAsset), ["jpg", "jpeg", "gif", "png","webp"]);
		dbm.singletons.dbmAssetRepository.addAssetCreatorForTypes(PathAssetCreator.create(XmlAsset), ["html", "xml", "xsl"]);
		dbm.singletons.dbmAssetRepository.addAssetCreatorForTypes(PathAssetCreator.create(TextAsset), ["text", "txt", "vert", "frag", "csv"]);
		dbm.singletons.dbmAssetRepository.addAssetCreatorForTypes(PathAssetCreator.create(JsonAsset), ["json"]);
		dbm.singletons.dbmAssetRepository.addAssetCreatorForTypes(PathAssetCreator.create(AudioAsset), ["mp3", "oga"]);
		dbm.singletons.dbmAssetRepository.addAssetCreatorForTypes(PathAssetCreator.create(VideoAsset), ["mp4", "ogv", "webm"]);
		dbm.singletons.dbmAssetRepository.addAssetCreatorForTypes(PathAssetCreator.create(ArrayBufferAsset), ["wav", "bin", "mid"]);
		
		dbm.singletons.dbmAssetRepository.addAssetCreatorForTypes(
			TransformedPathAssetCreator.create(
				AudioAsset,
				ReplaceStringObject.createCommand(
					SelectBaseObjectObject.createCommand(),
					PseudoFileExtensions.AUDIO,
					GetVariableObject.createCommand(dbm.singletons.dbmAssetRepository, "selectedAudioExtension")
				)
			),
			[PseudoFileExtensions.AUDIO]
		);
		dbm.singletons.dbmAssetRepository.addAssetCreatorForTypes(
			TransformedPathAssetCreator.create(
				VideoAsset,
				ReplaceStringObject.createCommand(
					SelectBaseObjectObject.createCommand(),
					PseudoFileExtensions.VIDEO,
					GetVariableObject.createCommand(dbm.singletons.dbmAssetRepository, "selectedVideoExtension")
				)
			),
			[PseudoFileExtensions.VIDEO]
		);
	}; //End function setup
});