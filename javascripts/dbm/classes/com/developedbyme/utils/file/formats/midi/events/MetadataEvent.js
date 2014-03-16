/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.file.formats.midi.events.MetadataEvent", "com.developedbyme.utils.file.formats.midi.events.DataEvent", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.file.formats.midi.events.MetadataEvent");
	
	var MetadataEvent = dbm.importClass("com.developedbyme.utils.file.formats.midi.events.MetadataEvent");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.file.formats.midi.events.MetadataEvent::_init");
		
		this.superCall();
		
		this.metadataType = null;
		
		return this;
	};
	
	staticFunctions.create = function(aTimeOffset, aType, aMetadataType, aData) {
		var newMetadataEvent = (new ClassReference()).init();
		
		newMetadataEvent.setupType(aTimeOffset, aType);
		newMetadataEvent.metadataType = aMetadataType;
		newMetadataEvent.data = aData;
		
		return newMetadataEvent;
	};
});