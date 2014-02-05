dbm.registerClass("com.developedbyme.utils.geometry.bufferpackers.VertexPacker", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.geometry.bufferpackers.VertexPacker");
	
	var VertexPacker = dbm.importClass("com.developedbyme.utils.geometry.bufferpackers.VertexPacker");
	
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	
	var VectorFunctions = dbm.importClass("com.developedbyme.utils.math.VectorFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	staticFunctions.packFaces = function(aMesh) {
		
		var returnArray = new Array(3*aMesh.faces.length);
		
		var currentArray = aMesh.faces;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentFace = currentArray[i];
			returnArray[3*i]   = currentFace.vertex1;
			returnArray[3*i+1] = currentFace.vertex2;
			returnArray[3*i+2] = currentFace.vertex3;
		}
		
		return returnArray;
	};
});