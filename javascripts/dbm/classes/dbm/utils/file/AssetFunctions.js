/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.file.AssetFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.file.AssetFunctions");
	
	var AssetFunctions = dbm.importClass("dbm.utils.file.AssetFunctions");
	
	staticFunctions.changeAssetUrl = function(aAssetPath, aPath) {
		//console.log("dbm.utils.file.AssetFunctions::changeAssetUrl");
		//console.log(aAssetPath, aPath);
		
		var theAsset = dbm.singletons.dbmAssetRepository.getAsset(aAssetPath);
		theAsset.setUrl(aPath);
		
		return theAsset;
	};
	
	staticFunctions.changeAssetUrlToPost = function(aAssetPath, aPath, aData) {
		console.log("dbm.utils.file.AssetFunctions::changeAssetUrlToPost");
		console.log(aAssetPath, aPath, aData);
		
		var theAsset = dbm.singletons.dbmAssetRepository.getAsset(aAssetPath);
		theAsset.setUrl(aPath);
		theAsset.setupAsFormObjectPost(aData);
		console.log(theAsset);
		
		return theAsset;
	};
});