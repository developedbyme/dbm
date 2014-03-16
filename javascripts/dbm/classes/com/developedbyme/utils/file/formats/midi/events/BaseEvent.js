/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.file.formats.midi.events.BaseEvent", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.file.formats.midi.events.BaseEvent");
	
	var BaseEvent = dbm.importClass("com.developedbyme.utils.file.formats.midi.events.BaseEvent");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.file.formats.midi.events.BaseEvent::_init");
		
		this.superCall();
		
		this.timeOffset = 0;
		this.type = null;
		
		return this;
	};
	
	objectFunctions.setupType = function(aTimeOffset, aType) {
		this.timeOffset = aTimeOffset;
		this.type = aType;
		
		return this;
	};
	
	staticFunctions.create = function(aTimeOffset, aType) {
		var newBaseEvent = (new ClassReference()).init();
		
		newBaseEvent.setupType(aTimeOffset, aType);
		
		return newBaseEvent;
	};
});