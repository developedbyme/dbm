/**
 * Controller for a 3d canvas.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.canvas.3d.CanvasController3d", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.3d.CanvasController3d");
	
	var CanvasController3d = dbm.importClass("com.developedbyme.utils.canvas.3d.CanvasController3d");
	
	var CanvasLayer3d = dbm.importClass("com.developedbyme.utils.canvas.3d.CanvasLayer3d");
	var TreeStructure = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructure");
	var TreeStructureItem = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItem");
	var TreeStructureItemLink = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItemLink");
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	var Matrix = dbm.importClass("com.developedbyme.core.data.matrices.Matrix");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	/**
	 * Constructor.
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.canvas.3d.CanvasController3d::init");
		
		this.superCall();
		
		this._numberOfLinksToResolve = 10;
		this._minScale = 0.001;
		
		this._canvas = this.createProperty("canvas", null);
		this._clearBeforeDrawing = true;
		this._display = this.createGhostProperty("display");
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create(this._objectProperty));
		
		this._hierarchy = TreeStructure.create();
		this._hierarchy.ownsData = true;
		this._hierarchy.getRoot().ownsData = true;
		this.addDestroyableObject(this._hierarchy);
		var rootLayer = CanvasLayer3d.create();
		this._hierarchy.getRoot().data = rootLayer;
		rootLayer._linkRegistration_setTreeStructureItem(this._hierarchy.getRoot());
		
		this._identityMatrix = Matrix.create(4, 4);
		this._identityMatrix.setValue(0, 0, 1);
		this._identityMatrix.setValue(1, 1, 1);
		this._identityMatrix.setValue(2, 2, 1);
		this._identityMatrix.setValue(3, 3, 1);
		
		this._camera = this.createProperty("camera", null);
		this._camera.setAlwaysUpdateFlow(true);
		
		this.createUpdateFunction("default", this._updateFlow, [this._graphicsUpdate, this._canvas, this._camera], [this._display]);
		
		return this;
	};
	
	objectFunctions.getRootLayer = function() {
		return this._hierarchy.getRoot().data;
	};
	
	objectFunctions.getLayer = function(aPath) {
		var currentItem = this._hierarchy.getItemByPath(aPath);
		if(currentItem.data == null) {
			var newLayer = CanvasLayer3d.create();
			currentItem.data = newLayer;
			newLayer._linkRegistration_setTreeStructureItem(currentItem);
			this._graphicsUpdate.connectInput(newLayer.getProperty("graphicsUpdate"));
		}
		return currentItem.data;
	};
	
	objectFunctions.createLink = function(aFrom, aTo) {
		//console.log("com.developedbyme.utils.canvas.3d.CanvasController3d::createLink");
		var tempArray = aFrom.split("/");
		
		var newLink = TreeStructureItemLink.create(tempArray.pop(), aTo);
		
		this._hierarchy.addItem(newLink, tempArray.join("/"));
	};
	
	objectFunctions.createVertexShader = function(aCode) {
		var currentContext = this._getContext(this._canvas.getValue());
		var shader = currentContext.createShader(currentContext.VERTEX_SHADER);
		
		currentContext.shaderSource(shader, aCode);
		currentContext.compileShader(shader);
		if (!currentContext.getShaderParameter(shader, currentContext.COMPILE_STATUS)) {
			//METODO: error message currentContext.getShaderInfoLog(shader);
			return null;
		}
		
		return shader;
	};
	
	objectFunctions.createFragmentShader = function(aCode) {
		var currentContext = this._getContext(this._canvas.getValue());
		var shader = currentContext.createShader(currentContext.FRAGMENT_SHADER);
		
		currentContext.shaderSource(shader, aCode);
		currentContext.compileShader(shader);
		if (!currentContext.getShaderParameter(shader, currentContext.COMPILE_STATUS)) {
			//METODO: error message currentContext.getShaderInfoLog(shader);
			return null;
		}
		
		return shader;
	};
	
	objectFunctions.createShaderProgram = function(aVertexShader, aFragmentShader) {
		var currentContext = this._getContext(this._canvas.getValue());
		
		var shaderProgram = currentContext.createProgram();
		currentContext.attachShader(shaderProgram, aVertexShader);
		currentContext.attachShader(shaderProgram, aFragmentShader);
		currentContext.linkProgram(shaderProgram);

		if(!currentContext.getProgramParameter(shaderProgram, currentContext.LINK_STATUS)) {
			//METODO: error message
			return null;
		}
		
		return shaderProgram;
	};
	
	objectFunctions.createTexture = function(aImage) {
		var currentContext = this._getContext(this._canvas.getValue());
		
		var newTexture = currentContext.createTexture();
		currentContext.bindTexture(currentContext.TEXTURE_2D, newTexture);
		currentContext.pixelStorei(currentContext.UNPACK_FLIP_Y_WEBGL, true);
		currentContext.texImage2D(currentContext.TEXTURE_2D, 0, currentContext.RGBA, currentContext.RGBA, currentContext.UNSIGNED_BYTE, aImage);
		currentContext.texParameteri(currentContext.TEXTURE_2D, currentContext.TEXTURE_MAG_FILTER, currentContext.NEAREST);
		currentContext.texParameteri(currentContext.TEXTURE_2D, currentContext.TEXTURE_MIN_FILTER, currentContext.NEAREST);
		currentContext.bindTexture(currentContext.TEXTURE_2D, null);
		
		return newTexture;
	};
	
	objectFunctions.createBuffer = function(aBufferType, aDataArray, aDrawType) {
		var currentContext = this.getContext();
		
		var buffer = currentContext.createBuffer();
		currentContext.bindBuffer(aBufferType, buffer);
		currentContext.bufferData(aBufferType, new Float32Array(aDataArray), aDrawType);
		
		return buffer;
	};
	
	objectFunctions.addCamera = function(aPath, aCamera) {
		var currentItem = this._hierarchy.getItemByPath(aPath);
		if(currentItem.data != null) {
			//METODO: warning message
		}
		
		currentItem.data = aCamera;
		aCamera._linkRegistration_setTreeStructureItem(currentItem);
		this._graphicsUpdate.connectInput(aCamera.getProperty("graphicsUpdate"));
		
		return aCamera;
	};
	
	objectFunctions._getContext = function(aCanvas) {
		//console.log("com.developedbyme.utils.canvas.3d.CanvasController3d::_getContext");
		//console.log(aCanvas);
		var currentContext = aCanvas.getContext("webgl");
		if(currentContext == null) {
			currentContext = aCanvas.getContext("experimental-webgl");
		}
		return currentContext;
	};
	
	objectFunctions.getContext = function() {
		var canvas = this._canvas.getValue();
		return this._getContext(canvas);
	};
	
	objectFunctions.draw = function() {
		//console.log("com.developedbyme.utils.canvas.3d.CanvasController3d::draw");
		
		var canvas = this._canvas.getValue();
		var currentContext = this._getContext(canvas);
		var currentLayer = this.getRootLayer();
		var camera =  this._camera.getValue();
		
		currentContext.viewportWidth = canvas.width;
		currentContext.viewportHeight = canvas.height;
		currentContext.viewport(0, 0, canvas.width, canvas.height);
		
		currentContext.clearColor(0.0, 0.0, 0.0, 1.0);
		currentContext.enable(currentContext.DEPTH_TEST);
		
		//METODO: set correct perspective matrix
		var perspectiveMatrix = (camera != null) ? camera.getProjectionMatrix() : this._identityMatrix;
		var transforamtionMatrix = (camera != null) ? camera.getCameraTransformationMatrix() : this._identityMatrix;
		
		if(this._clearBeforeDrawing) {
			currentContext.clear(currentContext.COLOR_BUFFER_BIT | currentContext.DEPTH_BUFFER_BIT);
		}
		currentLayer.draw(currentContext, transforamtionMatrix, perspectiveMatrix, this._numberOfLinksToResolve);
		//console.log("//com.developedbyme.utils.canvas.3d.CanvasController3d::draw");
	};
	
	objectFunctions._updateFlow = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.utils.canvas.3d.CanvasController3d::_updateFlow");
		this.draw();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._canvas = null;
		this._display = null;
		this._graphicsUpdate = null;
		
		this._hierarchy = null;
		
		this.superCall();
	};
	
	/**
	 * Traces out the full structure.
	 */
	objectFunctions.debugTraceStructure = function(aResolveLinksLevel) {
		//console.log("debugTraceStructure");
		
		aResolveLinksLevel = VariableAliases.valueWithDefault(aResolveLinksLevel, 10);
		
		this._hierarchy.debugTraceStructure(aResolveLinksLevel);
	}; //End function debugTraceStructure
	
	objectFunctions.debugTraceVersion = function() {
		//console.log("debugTraceVersion");
		var canvas = this._canvas.getValue();
		var currentContext = this._getContext(canvas);
		console.log(currentContext.getParameter(currentContext.VERSION), currentContext.getParameter(currentContext.SHADING_LANGUAGE_VERSION));
	};
	
	staticFunctions.create = function(aCanvas) {
		//console.log("create");
		//console.log(aCanvas);
		var newCanvasController3d = (new ClassReference()).init();
		newCanvasController3d.getProperty("canvas").setValue(aCanvas);
		return newCanvasController3d;
	};
});