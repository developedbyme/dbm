/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.math.transformation.FocusLengthFromFovNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.math.transformation.FocusLengthFromFovNode");
	
	var FocusLengthFromFovNode = dbm.importClass("dbm.flow.nodes.math.transformation.FocusLengthFromFovNode");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.math.transformation.FocusLengthFromFovNode::_init");
		
		this.superCall();
		
		this._fov = this.createProperty("fov", 0.25*Math.PI);
		this._viewLength = this.createProperty("viewLength", 640);
		this._focusLength = this.createProperty("focusLength", 0);
		
		this.createUpdateFunction("default", this._update, [this._fov, this._viewLength], [this._focusLength]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.math.transformation.FocusLengthFromFovNode::_update");
		
		var fov = this._fov.getValueWithoutFlow();
		var viewLength = this._viewLength.getValueWithoutFlow();
		
		this._focusLength.setValueWithFlow(0.5*viewLength*Math.tan(0.5*(Math.PI-fov)), aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._fov = null;
		this._viewLength = null;
		this._focusLength = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aFov, aViewLength) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("fov", aFov);
		newNode.setPropertyInputWithoutNull("viewLength", aViewLength);
		return newNode;
	};
});