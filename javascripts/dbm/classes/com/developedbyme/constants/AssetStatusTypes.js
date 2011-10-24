dbm.registerClass("com.developedbyme.constants.AssetStatusTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.AssetStatusTypes");
	
	var AssetStatusTypes = dbm.importClass("com.developedbyme.constants.AssetStatusTypes");
	
	staticFunctions.NOT_LOADED = 0;
	staticFunctions.LOADED = 1;
	staticFunctions.LOADING = 2;
	staticFunctions.ERROR = -1;
	
});