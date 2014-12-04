/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.canvas.webgl.CreateBuffersFromMeshNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.canvas.webgl.CreateBuffersFromMeshNode");
	
	var CreateBuffersFromMeshNode = dbm.importClass("dbm.flow.nodes.canvas.webgl.CreateBuffersFromMeshNode");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var CreateBufferNode = dbm.importClass("dbm.flow.nodes.canvas.webgl.CreateBufferNode");
	var CreateFloat32ArrayNode = dbm.importClass("dbm.flow.nodes.canvas.webgl.CreateFloat32ArrayNode");
	var CreateUint16ArrayNode = dbm.importClass("dbm.flow.nodes.canvas.webgl.CreateUint16ArrayNode");
	
	var VertexPacker = dbm.importClass("dbm.utils.geometry.bufferpackers.VertexPacker");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.canvas.webgl.CreateBuffersFromMeshNode::_init");
		
		this.superCall();
		
		this._context = this.createProperty("context", null);
		this._mesh = this.createProperty("mesh", null);
		this._mesh.setAlwaysUpdateFlow(true);
		
		this._vertexArray = this.createProperty("vertexArray", null);
		this._vertexArray.setAlwaysUpdateFlow(true);
		this._uvArray = this.createProperty("uvArray", null);
		this._uvArray.setAlwaysUpdateFlow(true);
		this._indexArray = this.createProperty("indexArray", null);
		this._indexArray.setAlwaysUpdateFlow(true);
		
		this._createVertexArrayNode = CreateFloat32ArrayNode.create(this._vertexArray);
		this.addDestroyableObject(this._createVertexArrayNode);
		this._createUvArrayNode = CreateFloat32ArrayNode.create(this._uvArray);
		this.addDestroyableObject(this._createUvArrayNode);
		this._createIndexArrayNode = CreateUint16ArrayNode.create(this._indexArray);
		this.addDestroyableObject(this._createIndexArrayNode);
		
		this._createVertexBufferNode = CreateBufferNode.create(this._context, this._createVertexArrayNode.getProperty("outputArray"));
		this.addDestroyableObject(this._createVertexBufferNode);
		this._createUvBufferNode = CreateBufferNode.create(this._context, this._createUvArrayNode.getProperty("outputArray"));
		this.addDestroyableObject(this._createUvBufferNode);
		this._createIndexBufferNode = CreateBufferNode.create(this._context, this._createIndexArrayNode.getProperty("outputArray"));
		this.addDestroyableObject(this._createIndexBufferNode);
		
		this._vertexBuffer = this.createProperty("vertexBuffer", this._createVertexBufferNode.getProperty("buffer"));
		this._uvBuffer = this.createProperty("uvBuffer", this._createUvBufferNode.getProperty("buffer"));
		this._indexBuffer = this.createProperty("indexBuffer", this._createIndexBufferNode.getProperty("buffer"));
		
		this._vertexBufferLength = this.createProperty("vertexBufferLength", 0);
		this._uvBufferLength = this.createProperty("uvBufferLength", 0);
		this._indexBufferLength = this.createProperty("indexBufferLength", 0);
		
		this.createUpdateFunction("default", this._update, [this._context, this._mesh], [this._vertexArray, this._uvArray, this._indexArray, this._vertexBufferLength, this._uvBufferLength, this._indexBufferLength]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.canvas.webgl.CreateBuffersFromMeshNode::_update");
		
		var mesh = this._mesh.getValueWithoutFlow();
		
		this._vertexArray.setValueWithFlow(mesh.points, aFlowUpdateNumber);
		this._vertexBufferLength.setValueWithFlow(mesh.points.length, aFlowUpdateNumber);
		
		this._uvArray.setValueWithFlow(mesh.uvPoints, aFlowUpdateNumber);
		this._uvBufferLength.setValueWithFlow(mesh.uvPoints.length, aFlowUpdateNumber);
		
		var indexArray = VertexPacker.packFaces(mesh);
		this._indexArray.setValueWithFlow(indexArray, aFlowUpdateNumber);
		this._indexBufferLength.setValueWithFlow(indexArray.length, aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._context = null;
		this._mesh = null;
		
		this._vertexArray = null;
		this._uvArray = null;
		this._indexArray = null;
		
		this._createVertexArrayNode = null;
		this._createUvArrayNode = null;
		this._createIndexArrayNode = null;
		
		this._createVertexBufferNode = null;
		this._createUvBufferNode = null;
		this._createIndexBufferNode = null;
		
		this._vertexBuffer = null;
		this._uvBuffer = null;
		this._indexBuffer = null;
		
		this._vertexBufferLength = null;
		this._uvBufferLength = null;
		this._indexBufferLength = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aContext, aMesh) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("context", aContext);
		newNode.setPropertyInputWithoutNull("mesh", aMesh);
		return newNode;
	};
});