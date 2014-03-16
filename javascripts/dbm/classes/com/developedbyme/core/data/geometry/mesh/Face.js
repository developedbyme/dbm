/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.data.geometry.mesh.Face", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.geometry.mesh.Face");
	
	var Face = dbm.importClass("com.developedbyme.core.data.geometry.mesh.Face");

	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.data.geometry.mesh.Face::_init");
		
		this.superCall();
		
		this.parentMesh = null;
		
		this.vertex1 = null;
		this.vertex2 = null;
		this.vertex3 = null;
		
		return this;
	};
	
	
	staticFunctions.create = function(aParentMesh, aVertex1, aVertex2, aVertex3) {
		//console.log("com.developedbyme.core.data.geometry.mesh.Face::create (static)");
		var newFace = (new Face()).init();
		newFace.parentMesh = aParentMesh;
		newFace.vertex1 = aVertex1;
		newFace.vertex2 = aVertex2;
		newFace.vertex3 = aVertex3;
		return newFace;
	};
});