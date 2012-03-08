dbm.registerClass("com.developedbyme.flow.nodes.canvas.CreatePatternNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.canvas.CreatePatternNode");
	
	var CreatePatternNode = dbm.importClass("com.developedbyme.flow.nodes.canvas.CreatePatternNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.canvas.CreatePatternNode::_init");
		
		this.superCall();
		
		this._image = this.createProperty("image", null);
		this._image.setAlwaysUpdateFlow(true);
		this._canvas = this.createProperty("canvas", dbm.singletons.dbmHtmlDomManager.getTempCanvas());
		this._repeat = this.createProperty("repeat", "repeat");
		this._pattern = this.createProperty("pattern", null);
		this._pattern.setAlwaysUpdateFlow(true);
		
		this.createUpdateFunction("default", this._update, [this._image, this._canvas, this._repeat], [this._pattern]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.canvas.CreatePatternNode::_update");
		
		this._pattern.setValueWithFlow(this._canvas.getValueWithoutFlow().getContext("2d").createPattern(this._image.getValueWithoutFlow(), this._repeat.getValueWithoutFlow()), aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._image = null;
		this._canvas = null;
		this._repeat = null;
		this._pattern = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aImage, aRepeat, aCanvas) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("image", aImage);
		newNode.setPropertyInputWithoutNull("repeat", aRepeat);
		newNode.setPropertyInputWithoutNull("canvas", aCanvas);
		return newNode;
	};
});