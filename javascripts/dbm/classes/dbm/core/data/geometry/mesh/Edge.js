/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * An edge of a face.
 */
dbm.registerClass("dbm.core.data.geometry.mesh.Edge", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.data.geometry.mesh.Edge");
	
	//Self reference
	var Edge = dbm.importClass("dbm.core.data.geometry.mesh.Edge");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.data.geometry.mesh.Edge::_init");
		
		this.superCall();
		
		this.faces = new Array();
		
		return this;
	};
	
	objectFunctions.addFace = function(aFace) {
		this.faces.push(aFace);
		
		return this;
	};
	
	objectFunctions.removeFace = function(aFace) {
		ArrayFunctions.removeFromArray(this.faces, aFace);
		
		return this;
	};
	
	staticFunctions.create = function() {
		//console.log("dbm.core.data.geometry.mesh.Edge::create (static)");
		var newEdge = (new Edge()).init();
		return newEdge;
	};
});