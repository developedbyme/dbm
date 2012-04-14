dbm.registerClass("com.developedbyme.flow.nodes.canvas.webgl.CreateTextrueNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.canvas.webgl.CreateTextrueNode");
	
	var CreateTextrueNode = dbm.importClass("com.developedbyme.flow.nodes.canvas.webgl.CreateTextrueNode");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var WebglFilterTypes = dbm.importClass("com.developedbyme.constants.webgl.WebglFilterTypes");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.canvas.webgl.CreateTextrueNode::init");
		
		this.superCall();
		
		this._context = this.createProperty("context", null);
		this._image = this.createProperty("image", null);
		this._image.setAlwaysUpdateFlow(true);
		this._unpackFlipY = this.createProperty("unpackFlipY", true);
		this._magFilter = this.createProperty("magFilter", WebglFilterTypes.LINEAR);
		this._minFilter = this.createProperty("minFilter", WebglFilterTypes.LINEAR);
		this._generateMipmap = this.createProperty("generateMipmap", false);
		
		this.createUpdateFunction("default", this._update, [this._context, this._image, this._unpackFlipY, this._magFilter, this._minFilter, this._generateMipmap], [this._texture]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.canvas.webgl.CreateTextrueNode::_update");
		
		var currentContext = this._context.getValueWithoutFlow();
		
		var currentTexture = this._shader.getValueWithoutFlow();
		if(currentTexture != null) {
			//METODO: this might not be the case
			currentContext.deleteTexture(currentTexture);
		}
		
		var texture = currentContext.createTexture();
		currentContext.bindTexture(currentContext.TEXTURE_2D, texture);
		currentContext.pixelStorei(currentContext.UNPACK_FLIP_Y_WEBGL, this._unpackFlipY.getValueWithoutFlow());
		currentContext.texImage2D(currentContext.TEXTURE_2D, 0, currentContext.RGBA, currentContext.RGBA, currentContext.UNSIGNED_BYTE, this._image.getValueWithoutFlow());
		currentContext.texParameteri(currentContext.TEXTURE_2D, currentContext.TEXTURE_MAG_FILTER, this._magFilter.getValueWithoutFlow());
		currentContext.texParameteri(currentContext.TEXTURE_2D, currentContext.TEXTURE_MIN_FILTER, this._minFilter.getValueWithoutFlow());
		currentContext.bindTexture(currentContext.TEXTURE_2D, null);
		if(this._generateMipmap.getValueWithoutFlow()) {
			currentContext.generateMipmap(currentContext.TEXTURE_2D);
		}
		
		this._texture.setValueWithFlow(texture, aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._context = null;
		this._image = null;
		this._unpackFlipY = null;
		this._magFilter = null;
		this._minFilter = null;
		this._generateMipmap = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aContext, aImage, aUnpackFlipY, aMagFilter, aMinFilter) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("context", aContext);
		newNode.setPropertyInputWithoutNull("image", aImage);
		newNode.setPropertyInputWithoutNull("unpackFlipY", aUnpackFlipY);
		newNode.setPropertyInputWithoutNull("magFilter", aMagFilter);
		newNode.setPropertyInputWithoutNull("minFilter", aMinFilter);
		return newNode;
	};
});