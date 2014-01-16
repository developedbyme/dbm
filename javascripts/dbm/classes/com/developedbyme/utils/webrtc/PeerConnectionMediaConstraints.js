dbm.registerClass("com.developedbyme.utils.webrtc.PeerConnectionMediaConstraints", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.webrtc.PeerConnectionMediaConstraints");
	
	var PeerConnectionMediaConstraints = dbm.importClass("com.developedbyme.utils.webrtc.PeerConnectionMediaConstraints");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.webrtc.PeerConnectionMediaConstraints::_init");
		
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
		console.log("com.developedbyme.utils.webrtc.PeerConnectionMediaConstraints::create");
		
		var newPeerConection = (new ClassReference()).init();
		
		return newPeerConection;
	};
});