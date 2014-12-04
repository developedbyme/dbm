/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.webrtc.PeerConnectionMediaConstraints", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.webrtc.PeerConnectionMediaConstraints");
	
	var PeerConnectionMediaConstraints = dbm.importClass("dbm.utils.webrtc.PeerConnectionMediaConstraints");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.webrtc.PeerConnectionMediaConstraints::_init");
		
		this.superCall();
		
		this._dataObject = new Object();
		
		this._dataObject["audio"] = true;
		this._dataObject["video"] = true;
		
		return this;
	};
	
	objectFunctions.getDataObject = function() {
		return this._dataObject;
	};
	
	staticFunctions.create = function() {
		console.log("dbm.utils.webrtc.PeerConnectionMediaConstraints::create");
		
		var newPeerConection = (new ClassReference()).init();
		
		return newPeerConection;
	};
});