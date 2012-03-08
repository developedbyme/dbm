dbm.registerClass("com.developedbyme.core.objectparts.IterativeUpdateFunction", "com.developedbyme.core.objectparts.UpdateFunction", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.IterativeUpdateFunction");
	//"use strict";
	
	var IterativeUpdateFunction = dbm.importClass("com.developedbyme.core.objectparts.IterativeUpdateFunction");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.objectparts.IterativeUpdateFunction::_init");
		
		this.superCall();
		
		this.name = null;
		
		this._flowUpdateNumber = 0;
		
		this._updateFunction = null;
		this._ownerObject = null;
		
		this._inputConnections = new Array();
		this._outputConnections = new Array();
		
		return this;
	};
	
	objectFunctions.fillWithDirtyInputConnections = function(aReturnArray) {
		//MENOTE: do nothing
	};
	
	staticFunctions.create = function(aOwnerObject, aIterativeUpdateFunction, aInputsArray, aOutputsArray) {
		var newIterativeUpdateFunction = (new IterativeUpdateFunction()).init();
		newIterativeUpdateFunction.setup(aOwnerObject, aIterativeUpdateFunction, aInputsArray, aOutputsArray);
		return newIterativeUpdateFunction;
	};
	
});