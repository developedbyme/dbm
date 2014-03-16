/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.file.formats.midi.events.ChannelEvent", "com.developedbyme.utils.file.formats.midi.events.DataEvent", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.file.formats.midi.events.ChannelEvent");
	
	var ChannelEvent = dbm.importClass("com.developedbyme.utils.file.formats.midi.events.ChannelEvent");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.file.formats.midi.events.ChannelEvent::_init");
		
		this.superCall();
		
		this.channel = -1;
		this.midiType = 0;
		
		return this;
	};
	
	staticFunctions.create = function(aTimeOffset, aType, aMidiType, aChannel) {
		var newChannelEvent = (new ClassReference()).init();
		
		newChannelEvent.setupType(aTimeOffset, aType);
		newChannelEvent.midiType = aMidiType;
		newChannelEvent.channel = aChannel;
		
		return newChannelEvent;
	};
});