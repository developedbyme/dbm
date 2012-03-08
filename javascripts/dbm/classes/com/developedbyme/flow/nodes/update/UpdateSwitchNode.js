dbm.registerClass("com.developedbyme.flow.nodes.update.UpdateSwitchNode", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.update.UpdateSwitchNode");
	
	var UpdateSwitchNode = dbm.importClass("com.developedbyme.flow.nodes.update.UpdateSwitchNode");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var JavascriptEventIds = dbm.importClass("com.developedbyme.constants.JavascriptEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.update.UpdateSwitchNode::_init");
		
		this.superCall();
		
		this._ticker = this.createProperty("ticker", false);
		this._shouldUpdate = this.createProperty("shouldUpdate", false);
		this._update = this.createGhostProperty("update");
		
		this._propertiesToUpdate = new Array();
		
		this.createUpdateFunction("default", this._update, [this._shouldUpdate, this._ticker], [this._update]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		
		var shouldUpdate = this._shouldUpdate.getValueWithoutFlow();
		
		if(shouldUpdate) {
			var currentArray = this._propertiesToUpdate;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentProperty = currentArray[i];
				currentProperty.update();
			}
		}
		
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._shouldUpdate = null;
		this._update = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		
		var newUpdateSwitchNode = (new ClassReference()).init();
		return newUpdateSwitchNode;
	};
});