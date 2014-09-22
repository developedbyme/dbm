/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.points.AdjustPointsInPointSetNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.points.AdjustPointsInPointSetNode");
	//"use strict";
	
	var AdjustPointsInPointSetNode = dbm.importClass("com.developedbyme.flow.nodes.points.AdjustPointsInPointSetNode");
	
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	var KeyValuePropertyPair = dbm.importClass("com.developedbyme.flow.data.KeyValuePropertyPair");
	var ArrayHolder = dbm.importClass("com.developedbyme.utils.data.ArrayHolder");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.points.AdjustPointsInPointSetNode::_init");
		
		this.superCall();
		
		this._anyUpdate = this.addProperty("anyUpdate", AnyChangeMultipleInputProperty.create());
		this._outputPointSet = this.createProperty("outputPointSet", null);
		
		this._pointAdjustments = ArrayHolder.create(true);
		this.addDestroyableObject(this._pointAdjustments);
		
		this.createUpdateFunction("default", this._update, [this._anyUpdate], [this._outputPointSet]);
		
		return this;
	};
	
	objectFunctions.setOutputPointSet = function(aPointSet) {
		this._outputPointSet.setValue(aPointSet);
		
		return this;
	};
	
	objectFunctions.addPointAdjustment = function(aIndex, aPoint) {
		var newKeyValuePair = KeyValuePropertyPair.create(aIndex, aPoint);
		this._anyUpdate.connectInput(newKeyValuePair.keyValue);
		this._anyUpdate.connectInput(newKeyValuePair.dataValue);
		newKeyValuePair.dataValue.setAlwaysUpdateFlow();
		this._pointAdjustments.array.push(newKeyValuePair);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.points.AdjustPointsInPointSetNode::_update");
		
		var outputPointSet = this._outputPointSet.getValueWithoutFlow();
		
		var currentArray = this._pointAdjustments.array;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentReplacement = currentArray[i];
			var index = currentReplacement.keyValue.getValueWithoutFlow();
			var point = currentReplacement.dataValue.getValueWithoutFlow();
			outputPointSet.pointsArray[index] = point;
		}
		
		this._outputPointSet.setFlowAsUpdated(aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._outputPointSet = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newNode = (new ClassReference()).init();
		return newNode;
	};
});