/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.MultiplePartsTimelinePart", "com.developedbyme.core.globalobjects.animationmanager.timeline.parts.TimelinePartBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.MultiplePartsTimelinePart");
	
	//Self reference
	var MultiplePartsTimelinePart = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.MultiplePartsTimelinePart");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	var ExtrapolationTypes = dbm.importClass("com.developedbyme.constants.ExtrapolationTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.MultiplePartsTimelinePart::_init");
		
		this.superCall();
		
		this.parts = new Array();
				
		return this;
	};
	
	objectFunctions.getValueByParameter = function(aParameter) {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.MultiplePartsTimelinePart::getValueByParameter");
		
		var currentParameter = aParameter;
		var currentArray = this.parts;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPart = currentArray[i];
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