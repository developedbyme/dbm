/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A timeline that animates a value.
 */
dbm.registerClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	//"use strict";
	
	//Self reference
	var Timeline = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Depenedencies
	var SetValueTimelinePart = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.SetValueTimelinePart");
	var InterpolationTimelinePart = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.InterpolationTimelinePart");
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	var JavascriptObjectTypes = dbm.importClass("com.developedbyme.constants.JavascriptObjectTypes");
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline::_init");
		
		this.superCall();
		
		this.startTime = 0;
		this.endTime = 1;
		this.startApplyTime = -Infinity;
		this.endApplyTime = Infinity;
		
		this._parts = new Array();
		this._currentPartIndex = 0;
		
		this._startValue = this.createProperty("startValue", null);
		this._partChange = this.createGhostProperty("partChange");
		this._anyChange = this.addProperty("anyChange", AnyChangeMultipleInputProperty.create());
		this._anyChange.connectInput(this._startValue);
		this._anyChange.connectInput(this._partChange);
		
		this._referenceTime = null;
		
		return this;
	};
	
	objectFunctions._internalFunctionality_setReferenceTime = function(aReferenceTimeProperty) {
		this._referenceTime = aReferenceTimeProperty;
	};
	
	objectFunctions._internalFunctionality_getParts = function() {
		return this._parts;
	};
	
	objectFunctions.getPartsStartTime = function() {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline::getPartsStartTime");
		if(this._parts.length === 0) {
			return -Infinity;
		}
		
		return this._parts[0].startApplyTime;
	};
	
	objectFunctions.getPartsEndTime = function() {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline::getPartsEndTime");
		if(this._parts.length === 0) {
			return Infinity;
		}
		
		return this._parts[this._parts.length-1].endApplyTime;
	};
	
	objectFunctions.getValueByParameter = function(aParameter) {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline::getValueByParameter");
		if(this._parts.length === 0) {
			return this._startValue.getValue();
		}
		while(true) {
			
			var currentPart = this._parts[this._currentPartIndex];
			if(currentPart === null || currentPart === undefined) {
				return this._startValue.getValue();
			}
			//console.log(this._currentPartIndex, aParameter >= currentPart.startApplyTime && aParameter < currentPart.endApplyTime, aParameter, currentPart.startApplyTime, currentPart.endApplyTime);
			if(aParameter >= currentPart.startApplyTime && aParameter < currentPart.endApplyTime) {
				//console.log(aParameter);
				//console.log(currentPart.getValueAt(aParameter));
				return currentPart.getValueAt(aParameter);
			}
			else if(aParameter < currentPart.startApplyTime) {
				if(this._currentPartIndex === 0) {
					return this._startValue.getValue();
				}
				this._currentPartIndex--;
			}
			else {
				if(this._currentPartIndex === this._parts.length-1 || aParameter < this._parts[this._currentPartIndex+1].startApplyTime) {
					return currentPart.getValueAt(currentPart.endApplyTime);
				}
				this._currentPartIndex++;
			}
		}
	};
	
	objectFunctions.getTangentByParameter = function(aParameter) {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline::getTangentByParameter");
		if(this._parts.length === 0) {
			return 0;
		}
		while(true) {
			var currentPart = this._parts[this._currentPartIndex];
			//console.log(this._currentPartIndex, aParameter >= currentPart.startApplyTime && aParameter < currentPart.endApplyTime, aParameter, currentPart.startApplyTime, currentPart.endApplyTime);
			if(aParameter >= currentPart.startApplyTime && aParameter < currentPart.endApplyTime) {
				//console.log(aParameter);
				//console.log(currentPart.getValueAt(aParameter));
				return currentPart.getTangentAt(aParameter);
			}
			else if(aParameter < currentPart.startApplyTime) {
				if(this._currentPartIndex === 0) {
					return 0;
				}
				this._currentPartIndex--;
			}
			else {
				if(this._currentPartIndex === this._parts.length-1 || aParameter < this._parts[this._currentPartIndex+1].startApplyTime) {
					return 0;
				}
				this._currentPartIndex++;
			}
		}
	};
	
	objectFunctions.getValueAt = function(aTime) {
		if(aTime === this.endTime || this.startTime === this.endTime) {
			return this.getValueByParameter(1);
		}
		else if(aTime === this.startTime) {
			return this.getValueByParameter(0);
		}
		return this.getValueByParameter((aTime-this.startTime)/(this.endTime-this.startTime));
	};
	
	objectFunctions.getTangentAt = function(aTime) {
		if(aTime === this.endTime || this.startTime === this.endTime) {
			return this.getTangentByParameter(1);
		}
		else if(aTime === this.startTime) {
			return this.getTangentByParameter(0);
		}
		return this.getTangentByParameter((aTime-this.startTime)/(this.endTime-this.startTime));
	};
	
	objectFunctions.setStartValue = function(aStartValue) {
		this._startValue.setValue(aStartValue);
		this._partChange.setAsDirty();
		
		return this;
	};
	
	objectFunctions._stopPartsAt = function(aTime) {
		var currentArray = this._parts;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPart = currentArray[i];
			if(currentPart.endApplyTime > aTime) {
				if(currentPart.startApplyTime <= aTime) {
					currentPart.endApplyTime = aTime;
					currentArray.splice(i+1, currentArrayLength);
				}
				else {
					currentArray.splice(i, currentArrayLength);
				}
				break;
			}
		}
		this._currentPartIndex = Math.max(0, Math.min(this._currentPartIndex, currentArray.length-1));
	};
	
	objectFunctions.setValue = function(aValue, aDelay) {
		
		aDelay = VariableAliases.valueWithDefault(aDelay, 0);
		
		if(isNaN(aDelay)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "setValue", "Time is NaN, can't animate " + aValue + ", " + aDelay + ".");
			return this;
		}
		
		var currentTime = this._referenceTime.getValue();
		var newPart = SetValueTimelinePart.create(aValue, currentTime+aDelay, 0);
		this.addPart(newPart);
		
		return this;
	};
	
	objectFunctions.setValueAt = function(aValue, aTime) {
		
		if(isNaN(aTime)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "setValueAt", "Time is NaN, can't animate " + aValue + ", " + aTime + ".");
			return this;
		}
		
		var newPart = SetValueTimelinePart.create(aValue, aTime, 0);
		this.addPart(newPart);
		
		return this;
	};
	
	objectFunctions.animateValue = function(aValue, aTime, aInterpolation, aDelay) {
		
		aDelay = VariableAliases.valueWithDefault(aDelay, 0);
		
		if(isNaN(aTime) || isNaN(aDelay)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "animateValue", "Time is NaN, can't animate " + aValue + ", " + aTime + ", " + aInterpolation + ", " + aDelay + ".");
			return this;
		}
		
		var currentTime = this._referenceTime.getValue();
		var startValue = this.getValueAt(currentTime+aDelay);
		
		this.animateValueAt(aValue, aTime, aInterpolation, currentTime+aDelay);
		
		return this;
	};
	
	objectFunctions.animateValueAt = function(aValue, aTime, aInterpolation, aStartTime) {
		
		if(isNaN(aTime) || isNaN(aStartTime)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "animateValueAt", "Time is NaN, can't animate " + aValue + ", " + aTime + ", " + aInterpolation + ", " + aStartTime + ".");
			return this;
		}
		
		var startValue = this.getValueAt(aStartTime);
		
		if(typeof(aInterpolation) === JavascriptObjectTypes.TYPE_STRING) {
			aInterpolation = dbm.singletons.dbmAnimationManager.getInterpolationObject(aInterpolation);
		}
		else if(aInterpolation === null) {
			aInterpolation = dbm.singletons.dbmAnimationManager.getInterpolationObject(InterpolationTypes.LINEAR);
		}
		
		var newPart = InterpolationTimelinePart.create(startValue, aValue, aInterpolation, aStartTime, aTime);
		this.addPart(newPart);
		
		return this;
	};
	
	objectFunctions.addPart = function(aPart) {
		this._stopPartsAt(aPart.startApplyTime);
		this._parts.push(aPart);
		this._partChange.setAsDirty();
	};
	
	objectFunctions.setParts = function(aParts) {
		this.clear();
		this._parts = aParts;
	};
	
	objectFunctions.clear = function() {
		this._parts.splice(0, this._parts.length);
		this._partChange.setAsDirty();
		this._currentPartIndex = 0;
	};
	
	objectFunctions.clearAt = function(aTime) {
		this._stopPartsAt(aTime);
		this._partChange.setAsDirty();
	};
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyArrayIfExists(this._parts);
		
		this.superCall();
	};
	
	/**
	 * Checks if a variable is owned by this object. Part of the destroy function.
	 *
	 * @param	aName	The name of the variable.
	 *
	 * @return	Boolean	True if this object is the owner of a variable.
	 */
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		
		switch(aName) {
			case "_referenceTime":
				return false;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._parts = null;
		this._currentPartIndex = null;
		
		this._startValue = null;
		this._partChange = null;
		this._anyChange = null;
		this._referenceTime = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aStartValue) {
		var newTimeline = (new ClassReference()).init();
		newTimeline.setStartValue(aStartValue);
		return newTimeline;
	};
});