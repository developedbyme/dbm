dbm.registerClass("com.developedbyme.flow.nodes.canvas.webgl.CreateShaderProgramNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.canvas.webgl.CreateShaderProgramNode");
	
	var CreateShaderProgramNode = dbm.importClass("com.developedbyme.flow.nodes.canvas.webgl.CreateShaderProgramNode");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.canvas.webgl.CreateShaderProgramNode::_init");
		
		this.superCall();
		
		this._context = this.createProperty("context", null);
		this._vertexShader = this.createProperty("vertexShader", null);
		this._fragmentShader = this.createProperty("fragmentShader", null);
		this._shaderProgram = this.createProperty("shaderProgram", null);
		
		this.createUpdateFunction("default", this._update, [this._context, this._vertexShader, this._fragmentShader], [this._shaderProgram]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.canvas.webgl.CreateShaderProgramNode::_update");
		
		var currentContext = this._context.getValueWithoutFlow();
		
		var currentShaderProgram = this._shaderProgram.getValueWithoutFlow();
		if(currentShaderProgram !== null) {
			//METODO: this might not be the case
			currentContext.deleteProgram(currentShaderProgram);
		}
		
		var shaderProgram = currentContext.createProgram();
		currentContext.attachShader(shaderProgram, this._vertexShader.getValueWithoutFlow());
		currentContext.attachShader(shaderProgram, this._fragmentShader.getValueWithoutFlow());
		currentContext.linkProgram(shaderProgram);

		if(!currentContext.getProgramParameter(shaderProgram, currentContext.LINK_STATUS)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_update", "Could not create shader program.");
			currentContext.deleteProgram(shaderProgram);
			this._shaderProgram.setValueWithFlow(null, aFlowUpdateNumber);
			return null;
		}
		
		this._shaderProgram.setValueWithFlow(shaderProgram, aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._context = null;
		this._vertexShader = null;
		this._fragmentShader = null;
		this._shaderProgram = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aContext, aVertexShader, aFragmentShader) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("context", aContext);
		newNode.setPropertyInputWithoutNull("vertexShader", aVertexShader);
		newNode.setPropertyInputWithoutNull("fragmentShader", aFragmentShader);
		return newNode;
	};
});