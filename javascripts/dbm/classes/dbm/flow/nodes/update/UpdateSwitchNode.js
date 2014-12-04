/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.update.UpdateSwitchNode", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.update.UpdateSwitchNode");
	
	var UpdateSwitchNode = dbm.importClass("dbm.flow.nodes.update.UpdateSwitchNode");
	
	var ArrayHolder = dbm.importClass("dbm.utils.data.ArrayHolder");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.update.UpdateSwitchNode::_init");
		
		this.superCall();
		
		this._ticker = this.createProperty("ticker", 0);
		this._shouldUpdate = this.createProperty("shouldUpdate", false);
		this._updateProperty = this.createGhostProperty("update");
		
		this._propertiesToUpdate = ArrayHolder.create(false);
		this.addDestroyableObject(this._propertiesToUpdate);
		
		this.createUpdateFunction("default", this._update, [this._shouldUpdate, this._ticker], [this._updateProperty]);
		
		return this;
	};
	
	objectFunctions.addUpdateProperty = function(aProprety) {
		this._propertiesToUpdate.array.push(aProprety);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		
		var shouldUpdate = this._shouldUpdate.getValueWithoutFlow();
		
		if(shouldUpdate) {
			var currentArray = this._propertiesToUpdate.array;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentProperty = currentArray[i];
				currentProperty.update();
			}
		}
		
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._ticker = null;
		this._shouldUpdate = null;
		this._updateProperty = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aShouldUpdate, aTicker) {
		
		var newUpdateSwitchNode = (new ClassReference()).init();
		
		newUpdateSwitchNode.setPropertyInputWithoutNull("shouldUpdate", aShouldUpdate);
		newUpdateSwitchNode.setPropertyInputWithoutNull("ticker", aTicker);
		
		return newUpdateSwitchNode;
	};
	
	staticFunctions.createWithGlobalTicker = function(aShouldUpdate) {
		
		var newUpdateSwitchNode = (new ClassReference()).init();
		
		newUpdateSwitchNode.setPropertyInputWithoutNull("shouldUpdate", aShouldUpdate);
		newUpdateSwitchNode.setPropertyInputWithoutNull("ticker", dbm.singletons.dbmAnimationManager.globalTimeProperty);
		
		return newUpdateSwitchNode;
	};
});