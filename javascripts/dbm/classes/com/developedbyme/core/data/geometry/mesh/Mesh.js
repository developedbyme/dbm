/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A mesh of faces.
 */
dbm.registerClass("com.developedbyme.core.data.geometry.mesh.Mesh", "com.developedbyme.core.data.points.PointSet", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.geometry.mesh.Mesh");
	
	//Self reference
	var Mesh = dbm.importClass("com.developedbyme.core.data.geometry.mesh.Mesh");
	
	//Error report
	
	//Dependencies
	var Face = dbm.importClass("com.developedbyme.core.data.geometry.mesh.Face");
	var Edge = dbm.importClass("com.developedbyme.core.data.geometry.mesh.Edge");
	
	//Utils
	var TypedArrayFunctions = dbm.importClass("com.developedbyme.utils.native.typedarray.TypedArrayFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.data.geometry.mesh.Mesh::_init");
		
		this.superCall();
		
		this.faces = new Array();
		this._edges = new Array();
		
		this.setType = "mesh";
		
		return this;
	};
	
	objectFunctions.getEdge = function(aVertexIndex1, aVertexIndex2) {
		
		var firstIndex;
		var secondIndex;
		if(aVertex1 < aVertex2) {
			firstIndex = aVertex1;
			secondIndex = aVertex2-aVertex1-1;
		}
		else {
			firstIndex = aVertex2;
			secondIndex = aVertex1-aVertex2-1;
		}
		
		var firstArray;
		if(VariableAliases.isSet(this._edges[firstIndex])) {
			firstArray = this._edges[firstIndex];
		}
		else {
			firstArray = new Array();
			this._edges[firstIndex] = firstArray;
		}
		
		var returnValue = firstArray[secondIndex];
		if(!VariableAliases.isSet(returnValue)) {
			returnValue = Edge.create();
			firstArray[secondIndex] = returnValue;
		}
		
		return returnValue;
	};
	
	objectFunctions.addFaceToEdge = function(aFace, aVertexIndex1, aVertexIndex2) {
		this.getEdge(aVertexIndex1, aVertexIndex2).addFace(aFace);
	};
	
	objectFunctions.createVertecies = function(aPoints) {
		var currentArray = aPoints;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPointIndex = i;
			this.pointsArray.push(currentArray[currentPointIndex]);
		}
	};
	
	objectFunctions.createFace = function(aVertexIndex1, aVertexIndex2, aVertexIndex3) {
		var newFace = Face.create(this, aVertexIndex1, aVertexIndex2, aVertexIndex3);
		this.faces.push(newFace);
		return newFace;
	};
	
	staticFunctions.create = function() {
		//console.log("com.developedbyme.core.data.geometry.mesh.Mesh::create (static)");
		var newMesh = (new Mesh()).init();
		
		return newMesh;
	};
});