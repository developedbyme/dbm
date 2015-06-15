/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.animationmanager.timeline.parts.MultiplePartsTimelinePart", "dbm.core.globalobjects.animationmanager.timeline.parts.TimelinePartBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.animationmanager.timeline.parts.MultiplePartsTimelinePart");
	
	//Self reference
	var MultiplePartsTimelinePart = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.parts.MultiplePartsTimelinePart");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var ExtrapolationTypes = dbm.importClass("dbm.constants.generic.ExtrapolationTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.animationmanager.timeline.parts.MultiplePartsTimelinePart::_init");
		
		this.superCall();
		
		this.parts = new Array();
				
		return this;
	};
	
	objectFunctions.getValueByParameter = function(aParameter) {
		//console.log("dbm.core.globalobjects.animationmanager.timeline.parts.MultiplePartsTimelinePart::getValueByParameter");
		//console.log(aParameter);
		
		var currentParameter = aParameter;
		var currentArray = this.parts;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPart = currentArray[i];
			//console.log(currentParameter, currentPart);
			currentParameter = currentPart.getValueByParameter(currentParameter);
		} 
		
		return currentParameter;
	};
	
	staticFunctions.create = function(aParts, aStartTime, aLength) {
		var newPart = (new ClassReference()).init();
		
		newPart.parts = aParts;
		newPart.setTimes(aStartTime, aStartTime+aLength);
		
		return newPart;
	};
});