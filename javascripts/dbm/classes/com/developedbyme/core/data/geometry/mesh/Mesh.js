dbm.registerClass("com.developedbyme.core.data.geometry.mesh.Mesh", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.geometry.mesh.Mesh");
	
	var Mesh = dbm.importClass("com.developedbyme.core.data.geometry.mesh.Mesh");
	
	var Face = dbm.importClass("com.developedbyme.core.data.geometry.mesh.Face");
	
	var TypedArrayFunctions = dbm.importClass("com.developedbyme.utils.native.typedarray.TypedArrayFunctions");

	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.data.geometry.mesh.Mesh::_init");
		
		this.superCall();
		
		this.faces = new Array();
		
		this.points = new Array();
		this.uvPoints = new Array();
		
		return this;
	};
	
	objectFunctions.getNumberOfPoints = function() {
		return this.points.length/3;
	};
	
	objectFunctions.createVertex = function(aX, aY, aZ, aU, aV) {
		var returnIndex = this.points.length/3;
		this.points.push(aX, aY, aZ);
		this.uvPoints.push(aU, aV);
		return returnIndex;
	};
	
	objectFunctions.createVertexes = function(aPoints, aUvPoints) {
		var currentArray = aPoints;
		var currentArrayLength = currentArray.length/3;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPointIndex = 3*i;
			this.points.push(currentArray[currentPointIndex], currentArray[currentPointIndex+1], currentArray[currentPointIndex+2]);
			var currentUvPointIndex = 2*i;
			if(aUvPoints.length > currentUvPointIndex+1) {
				this.uvPoints.push(currentArray[currentUvPointIndex], currentArray[currentUvPointIndex+1]);
			}
			else {
				this.uvPoints.push(0, 0);
			}
		}
	};
	
	objectFunctions.createFace = function(aVertex1, aVertex2, aVertex3) {
		var newFace = Face.create(this, aVertex1, aVertex2, aVertex3);
		this.faces.push(newFace);
		return newFace;
	};
	
	staticFunctions.create = function() {
		//console.log("com.developedbyme.core.data.geometry.mesh.Mesh::create (static)");
		var newMesh = (new Mesh()).init();
		
		return newMesh;
	};
});