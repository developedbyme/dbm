/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.file.formats.midi.events.BaseEvent", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.file.formats.midi.events.BaseEvent");
	
	var BaseEvent = dbm.importClass("dbm.utils.file.formats.midi.events.BaseEvent");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.file.formats.midi.events.BaseEvent::_init");
		
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