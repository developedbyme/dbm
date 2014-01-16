dbm.registerClass("com.developedbyme.utils.webrtc.PeerConnectionConfiguration", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.webrtc.PeerConnectionConfiguration");
	
	var PeerConnectionConfiguration = dbm.importClass("com.developedbyme.utils.webrtc.PeerConnectionConfiguration");
	
	var WebRtcFunctions = dbm.importClass("com.developedbyme.utils.webrtc.WebRtcFunctions");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.webrtc.PeerConnectionConfiguration::_init");
		
		this.superCall();
		
		this._dataObject = new Object();
		this._iceServers = new Array();
		
		this._dataObject["iceServers"] = this._iceServers;
		
		return this;
	};
	
	objectFunctions.getDataObject = function() {
		return this._dataObject;
	};
	
	objectFunctions.addIceServer = function(aUrl) {
		this._iceServers.push({"url": aUrl});
		
		return this;
	};
	
	staticFunctions.create = function() {
		console.log("com.developedbyme.utils.webrtc.PeerConnectionConfiguration::create");
		
		var newPeerConection = (new ClassReference()).init();
		
		return newPeerConection;
	};
});