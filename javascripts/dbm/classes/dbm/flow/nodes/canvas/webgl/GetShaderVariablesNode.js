/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.canvas.webgl.GetShaderVariablesNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.canvas.webgl.GetShaderVariablesNode");
	
	var GetShaderVariablesNode = dbm.importClass("dbm.flow.nodes.canvas.webgl.GetShaderVariablesNode");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var KeyTypeValueObject = dbm.importClass("dbm.core.data.generic.KeyTypeValueObject");
	var ArrayHolder = dbm.importClass("dbm.utils.data.ArrayHolder");
	
	var ShaderVariableTypes = dbm.importClass("dbm.constants.webgl.ShaderVariableTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.canvas.webgl.GetShaderVariablesNode::_init");
		
		this.superCall();
		
		this._context = this.createProperty("context", null);
		this._shader = this.createProperty("shader", null);
		
		this._shaderVariables = ArrayHolder.create(true);
		this.addDestroyableObject(this._shaderVariables);
		
		this._defaultUpdate = this.createUpdateFunction("default", this._update, [this._context, this._shader], []);
		
		return this;
	};
	
	objectFunctions.addVariable = function(aVariableName, aType) {
		
		var newProperty = this.createProperty(aVariableName);
		
		var newKeyValue = KeyTypeValueObject.create(aVariableName, aType, newProperty);
		
		this._shaderVariables.array.push(newKeyValue);
		
		this._defaultUpdate.addOutputConnection(newProperty);
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.canvas.webgl.GetShaderVariablesNode::_update");
		
		var context = this._context.getValueWithoutFlow();
		var shader = this._shader.getValueWithoutFlow();
		
		var currentArray = this._shaderVariables.array;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentKeyValue = currentArray[i];
			var type = currentKeyValue.type;
			var returnValue = null;
			switch(type) {
				case ShaderVariableTypes.ATTRIBUTE:
					returnValue = context.getAttribLocation(shader, currentKeyValue.name);
					if(returnValue === -1) {
						ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_update", "Attribute " + currentKeyValue.name + " doesn't exist.");
					}
					break;
				case ShaderVariableTypes.UNIFORM:
					returnValue = context.getUniformLocation(shader, currentKeyValue.name);
					if(returnValue === null) {
						ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_update", "Uniform " + currentKeyValue.name + " doesn't exist.");
					}
					break;
				default:
					ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_update", "No type named " + type + ".");
					continue;
			}
			//console.log(currentKeyValue.name, type, returnValue);
			currentKeyValue.value.setValueWithFlow(returnValue, aFlowUpdateNumber);
		}
		
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._context = null;
		this._shader = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aContext, aShader) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("context", aContext);
		newNode.setPropertyInputWithoutNull("shader", aShader);
		return newNode;
	};
});