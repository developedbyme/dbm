dbm.registerClass("com.developedbyme.constants.webgl.WebglFilterTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.webgl.WebglFilterTypes");
	
	var WebglFilterTypes = dbm.importClass("com.developedbyme.constants.webgl.WebglFilterTypes");
	
	staticFunctions.NEAREST = 0x2600;
	staticFunctions.LINEAR = 0x2601;
	
	staticFunctions.NEAREST_MIPMAP_NEAREST = 0x2700;
	staticFunctions.LINEAR_MIPMAP_NEAREST = 0x2701;
	staticFunctions.NEAREST_MIPMAP_LINEAR = 0x2702;
	staticFunctions.LINEAR_MIPMAP_LINEAR = 0x2703;
});