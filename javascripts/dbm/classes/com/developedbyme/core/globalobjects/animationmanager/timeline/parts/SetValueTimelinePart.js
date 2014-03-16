/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.SetValueTimelinePart", "com.developedbyme.core.globalobjects.animationmanager.timeline.parts.TimelinePartBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.SetValueTimelinePart");	
	
	var SetValueTimelinePart = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.SetValueTimelinePart");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.SetValueTimelinePart::_init");
		
		this.superCall();
		
		this.value = null;
				
		return this;
	};
	
	objectFunctions.setValue = function(aValue) {
		this.value = aValue;
		
		return this;
	};
	
	objectFunctions.getValueByParameter = function(aParameter) {
		return this.value;
	};
	
	objectFunctions.getTangentByParameter = function(aParameter) {
		return 0;
	};
	
	staticFunctions.create = function(aValue, aStartTime, aLength) {
		var newPart = (new ClassReference()).init();
		
		newPart.setValue(aValue).setTimes(aStartTime, aStartTime+aLength);
		
		return newPart;
	};
});