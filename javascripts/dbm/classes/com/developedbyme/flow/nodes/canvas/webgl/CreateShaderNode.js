dbm.registerClass("com.developedbyme.flow.nodes.canvas.webgl.CreateShaderNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.canvas.webgl.CreateShaderNode");
	
	var CreateShaderNode = dbm.importClass("com.developedbyme.flow.nodes.canvas.webgl.CreateShaderNode");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.canvas.webgl.CreateShaderNode::init");
		
		this.superCall();
		
		this._context = this.createProperty("context", null);
		this._shaderType = this.createProperty("shaderType", null);
		this._code = this.createProperty("code", null);
		this._shader = this.createProperty("shader", null);
		
		this.createUpdateFunction("default", this._update, [this._context, this._shaderType, this._code], [this._shader]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.canvas.webgl.CreateShaderNode::_update");
		
		var currentContext = this._context.getValueWithoutFlow();
		
		var currentShader = this._shader.getValueWithoutFlow();
		if(currentShader != null) {
			//METODO: this might not be the case
			currentContext.deleteShader(currentShader);
		}
		
		var shader = currentContext.createShader(this._shaderType.getValueWithoutFlow());
		
		currentContext.shaderSource(shader, this._code.getValueWithoutFlow());
		currentContext.compileShader(shader);
		if (!currentContext.getShaderParameter(shader, currentContext.COMPILE_STATUS)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_update", "Could not create shader. " + currentContext.getShaderInfoLog(shader));
			currentContext.deleteShader(shader);
			this._shader.setValueWithFlow(null, aFlowUpdateNumber);
			return;
		}
		
		this._shader.setValueWithFlow(shader, aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._context = null;
		this._shaderType = null;
		this._code = null;
		this._shader = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aContext, aShaderType, aCode) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("context", aContext);
		newNode.setPropertyInputWithoutNull("shaderType", aShaderType);
		newNode.setPropertyInputWithoutNull("code", aCode);
		return newNode;
	};
});