/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.file.formats.midi.events.DataEvent", "dbm.utils.file.formats.midi.events.BaseEvent", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.file.formats.midi.events.DataEvent");
	
	var DataEvent = dbm.importClass("dbm.utils.file.formats.midi.events.DataEvent");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.file.formats.midi.events.DataEvent::_init");
		
		this.superCall();
		
		this.data = null;
		
		return this;
	};
	
	staticFunctions.create = function(aTimeOffset, aType, aData) {
		var newDataEvent = (new ClassReference()).init();
		
		newDataEvent.setupType(aTimeOffset, aType);
		newDataEvent.data = aData;
		
		return newDataEvent;
	};
});