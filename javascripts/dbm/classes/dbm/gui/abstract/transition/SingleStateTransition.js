/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.abstract.transition.SingleStateTransition", "dbm.gui.abstract.transition.TransitionBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.abstract.transition.SingleStateTransition");
	
	//Self reference
	var SingleStateTransition = dbm.importClass("dbm.gui.abstract.transition.SingleStateTransition");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var TransationStateTypes = dbm.importClass("dbm.constants.TransationStateTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.gui.abstract.transition.SingleStateTransition::_init");
		
		this.superCall();
		
		this._activeState = null;
		
		return this;
	};
	
	objectFunctions.animateOnState = function(aName, aTime, aInterpolationType, aDelay) {
		
		if(this._activeState === aName) {
			return;
		}
		
		if(this._activeState !== null) {
			this._performAnimateState(this._activeState, TransationStateTypes.OFF, TransationStateTypes.OFF_TRANSITION, 1, aTime, aInterpolationType, aDelay);
		}
		
		this._activeState = aName;
		this.superCall(aName, aTime, aInterpolationType, aDelay);
	};
	
	objectFunctions.animateOffState = function(aName, aTime, aInterpolationType, aDelay) {
		
		if(this._activeState !== aName) {
			//METODO: error message
			return;
		}
		
		this._activeState = null;
		this.superCall(aName, aTime, aInterpolationType, aDelay);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._activeState = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aStateNames) {
		var newSingleStateTransition = (new SingleStateTransition()).init();
		
		var currentArray = aStateNames;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			newSingleStateTransition.createState(currentArray[i]);
		}
		
		return newSingleStateTransition;
	};
});