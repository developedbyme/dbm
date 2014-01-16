dbm.registerClass("com.developedbyme.utils.webrtc.PeerConnection", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.webrtc.PeerConnection");
	
	var PeerConnection = dbm.importClass("com.developedbyme.utils.webrtc.PeerConnection");
	
	var PeerConnectionConfiguration = dbm.importClass("com.developedbyme.utils.webrtc.PeerConnectionConfiguration");
	var PeerConnectionMediaConstraints = dbm.importClass("com.developedbyme.utils.webrtc.PeerConnectionMediaConstraints");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var StaticCallbackLink = dbm.importClass("com.developedbyme.core.extendedevent.eventlink.StaticCallbackLink");
	
	var WebRtcFunctions = dbm.importClass("com.developedbyme.utils.webrtc.WebRtcFunctions");
	
	var WebRtcConnectionEventIds = dbm.importClass("com.developedbyme.constants.htmlevents.WebRtcConnectionEventIds");
	var WebRtcExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.WebRtcExtendedEventIds");
	var IceConnectionStateTypes = dbm.importClass("com.developedbyme.constants.webrtc.IceConnectionStateTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.webrtc.PeerConnection::_init");
		
		this.superCall();
		
		this._configuration = PeerConnectionConfiguration.create();
		this._mediaContraints = PeerConnectionMediaConstraints.create();
		
		this._nativeConnection = null;
		this._ownIceCandidates = new Array();
		this._remoteIceCandidates = new Array();
		
		this._offerCreatedCallbackEventLink = StaticCallbackLink.create(this.getExtendedEvent(), WebRtcExtendedEventIds.OFFER_CREATED);
		this.getExtendedEvent().addEventLink(this._offerCreatedCallbackEventLink, WebRtcExtendedEventIds.OFFER_CREATED, true);
		this._offerErrorCallbackEventLink = StaticCallbackLink.create(this.getExtendedEvent(), WebRtcExtendedEventIds.OFFER_ERROR);
		this.getExtendedEvent().addEventLink(this._offerErrorCallbackEventLink, WebRtcExtendedEventIds.OFFER_ERROR, true);
		
		this._answerCreatedCallbackEventLink = StaticCallbackLink.create(this.getExtendedEvent(), WebRtcExtendedEventIds.ANSWER_CREATED);
		this.getExtendedEvent().addEventLink(this._answerCreatedCallbackEventLink, WebRtcExtendedEventIds.ANSWER_CREATED, true);
		this._answerErrorCallbackEventLink = StaticCallbackLink.create(this.getExtendedEvent(), WebRtcExtendedEventIds.ANSWER_ERROR);
		this.getExtendedEvent().addEventLink(this._answerErrorCallbackEventLink, WebRtcExtendedEventIds.ANSWER_ERROR, true);
		
		this._localDescriptionSetCallbackEventLink = StaticCallbackLink.create(this.getExtendedEvent(), WebRtcExtendedEventIds.LOCAL_DESCRIPTION_SET);
		this.getExtendedEvent().addEventLink(this._localDescriptionSetCallbackEventLink, WebRtcExtendedEventIds.LOCAL_DESCRIPTION_SET, true);
		this._localDescriptionErrorCallbackEventLink = StaticCallbackLink.create(this.getExtendedEvent(), WebRtcExtendedEventIds.LOCAL_DESCRIPTION_ERROR);
		this.getExtendedEvent().addEventLink(this._localDescriptionErrorCallbackEventLink, WebRtcExtendedEventIds.LOCAL_DESCRIPTION_ERROR, true);
		
		this._remoteDescriptionSetCallbackEventLink = StaticCallbackLink.create(this.getExtendedEvent(), WebRtcExtendedEventIds.REMOTE_DESCRIPTION_SET);
		this.getExtendedEvent().addEventLink(this._remoteDescriptionSetCallbackEventLink, WebRtcExtendedEventIds.REMOTE_DESCRIPTION_SET, true);
		this._remoteDescriptionErrorCallbackEventLink = StaticCallbackLink.create(this.getExtendedEvent(), WebRtcExtendedEventIds.REMOTE_DESCRIPTION_ERROR);
		this.getExtendedEvent().addEventLink(this._remoteDescriptionErrorCallbackEventLink, WebRtcExtendedEventIds.REMOTE_DESCRIPTION_ERROR, true);
		
		this.getExtendedEvent().addCommandToEvent(WebRtcConnectionEventIds.ICE_CANDIDATE, CallFunctionCommand.createCommand(this, this._callback_iceCandidateReceived, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(WebRtcConnectionEventIds.ADD_STREAM, CallFunctionCommand.createCommand(this, this._callback_streamAdded, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(WebRtcConnectionEventIds.DATA_CHANNEL, CallFunctionCommand.createCommand(this, this._callback_channelAdded, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(WebRtcConnectionEventIds.REMOVE_STREAM, CallFunctionCommand.createCommand(this, this._callback_streamRemoved, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(WebRtcConnectionEventIds.NEGOTIATION_NEEDED, CallFunctionCommand.createCommand(this, this._callback_negotionationNeeded, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(WebRtcConnectionEventIds.ICE_CONNECTION_STATE_CHANGE, CallFunctionCommand.createCommand(this, this._callback_iceConnectionChanged, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(WebRtcConnectionEventIds.SIGNALING_STATE_CHANGE, CallFunctionCommand.createCommand(this, this._callback_signalingStateChanged, [GetVariableObject.createSelectDataCommand()]));
		
		this.getExtendedEvent().addCommandToEvent(WebRtcExtendedEventIds.OFFER_CREATED, CallFunctionCommand.createCommand(this, this.setLocalDescription, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(WebRtcExtendedEventIds.OFFER_ERROR, CallFunctionCommand.createCommand(this, this._callback_offerError, [GetVariableObject.createSelectDataCommand()]));
		
		this.getExtendedEvent().addCommandToEvent(WebRtcExtendedEventIds.ANSWER_CREATED, CallFunctionCommand.createCommand(this, this.setLocalDescription, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(WebRtcExtendedEventIds.ANSWER_ERROR, CallFunctionCommand.createCommand(this, this._callback_answerError, [GetVariableObject.createSelectDataCommand()]));
		
		this.getExtendedEvent().addCommandToEvent(WebRtcExtendedEventIds.LOCAL_DESCRIPTION_SET, CallFunctionCommand.createCommand(this, this._callback_localDescriptionSet, []));
		this.getExtendedEvent().addCommandToEvent(WebRtcExtendedEventIds.LOCAL_DESCRIPTION_ERROR, CallFunctionCommand.createCommand(this, this._callback_localDescriptionError, [GetVariableObject.createSelectDataCommand()]));
		
		this.getExtendedEvent().addCommandToEvent(WebRtcExtendedEventIds.REMOTE_DESCRIPTION_SET, CallFunctionCommand.createCommand(this, this._callback_remoteDescriptionSet, []));
		this.getExtendedEvent().addCommandToEvent(WebRtcExtendedEventIds.REMOTE_DESCRIPTION_ERROR, CallFunctionCommand.createCommand(this, this._callback_remoteDescriptionError, [GetVariableObject.createSelectDataCommand()]));
		
		return this;
	};
	
	objectFunctions.getConfiguration = function() {
		return this._configuration;
	};
	
	objectFunctions.connect = function() {
		
		var NativeClass = WebRtcFunctions.getPeerConnectionClass();
		
		var configuration = this._configuration.getDataObject();
		var mediaConstraints = {optional: [{"DtlsSrtpKeyAgreement": true}, {"RtpDataChannels": true}]}; //this._mediaContraints.getDataObject();
		
		//METODO: use media constraints
		this._nativeConnection = new NativeClass(configuration, mediaConstraints);
		
		this.getExtendedEvent().linkJavascriptEvent(this._nativeConnection, WebRtcConnectionEventIds.ICE_CANDIDATE, WebRtcConnectionEventIds.ICE_CANDIDATE, WebRtcConnectionEventIds.ICE_CANDIDATE, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._nativeConnection, WebRtcConnectionEventIds.ADD_STREAM, WebRtcConnectionEventIds.ADD_STREAM, WebRtcConnectionEventIds.ADD_STREAM, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._nativeConnection, WebRtcConnectionEventIds.DATA_CHANNEL, WebRtcConnectionEventIds.DATA_CHANNEL, WebRtcConnectionEventIds.DATA_CHANNEL, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._nativeConnection, WebRtcConnectionEventIds.REMOVE_STREAM, WebRtcConnectionEventIds.REMOVE_STREAM, WebRtcConnectionEventIds.REMOVE_STREAM, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._nativeConnection, WebRtcConnectionEventIds.NEGOTIATION_NEEDED, WebRtcConnectionEventIds.NEGOTIATION_NEEDED, WebRtcConnectionEventIds.NEGOTIATION_NEEDED, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._nativeConnection, WebRtcConnectionEventIds.ICE_CONNECTION_STATE_CHANGE, WebRtcConnectionEventIds.ICE_CONNECTION_STATE_CHANGE, WebRtcConnectionEventIds.ICE_CONNECTION_STATE_CHANGE, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._nativeConnection, WebRtcConnectionEventIds.SIGNALING_STATE_CHANGE, WebRtcConnectionEventIds.SIGNALING_STATE_CHANGE, WebRtcConnectionEventIds.SIGNALING_STATE_CHANGE, true).activate();
		
		this._nativeConnection.ondatachannel = function() {
			console.log(">>>>>");
		};
		
		return this;
	};
	
	objectFunctions.createOffer = function() {
		this._nativeConnection.createOffer(this._offerCreatedCallbackEventLink.getCallbackFunction(), this._offerErrorCallbackEventLink.getCallbackFunction());
		
		return this;
	};
	
	objectFunctions.createAnswer = function() {
		this._nativeConnection.createAnswer(this._answerCreatedCallbackEventLink.getCallbackFunction(), this._answerErrorCallbackEventLink.getCallbackFunction());
		
		return this;
	};
	
	objectFunctions.acceptOffer = function(aDescription) {
		
		this.getExtendedEvent().addCommandToEvent(WebRtcExtendedEventIds.REMOTE_DESCRIPTION_SET, CallFunctionCommand.createCommand(this, this.createAnswer, []).setAsRemovable());
		this.setRemoteDescription(aDescription);
		
		return this;
	};
	
	objectFunctions.createNewOfferWhenNegotiationIsNeeded = function() {
		console.log("com.developedbyme.utils.webrtc.PeerConnection::createNewOfferWhenNegotiationIsNeeded");
		
		this.getExtendedEvent().addCommandToEvent(WebRtcConnectionEventIds.NEGOTIATION_NEEDED, CallFunctionCommand.createCommand(this, this.createOffer, []));
		
		return this;
	};
	
	objectFunctions.createDataChannel = function(aName) {
		console.log("com.developedbyme.utils.webrtc.PeerConnection::createDataChannel");
		var newDataChannel = this._nativeConnection.createDataChannel(aName, {"reliable": true});
		
		console.log(newDataChannel);
		
		return newDataChannel;
	};
	
	objectFunctions.addStream = function(aStream) {
		console.log("com.developedbyme.utils.webrtc.PeerConnection::addStream");
		
		//METODO: add media constraints
		
		this._nativeConnection.addStream(aStream);
		
		return this;
	};
	
	objectFunctions.addRemoteIceCandidate = function(aCandidate) {
		console.log("com.developedbyme.utils.webrtc.PeerConnection::addRemoteIceCandidate");
		console.log(aCandidate);
		
		this._remoteIceCandidates.push(aCandidate);
		
		var iceCandidateTemplate = JSON.parse(JSON.stringify(aCandidate));
		console.log(iceCandidateTemplate);
		var iceCandidate = new RTCIceCandidate(iceCandidateTemplate);
		this._nativeConnection.addIceCandidate(iceCandidate);
		
		return this;
	};
	
	objectFunctions._callback_iceCandidateReceived = function(aEvent) {
		console.log("com.developedbyme.utils.webrtc.PeerConnection::_callback_iceCandidateReceived");
		console.log(aEvent, this);
		
		if(aEvent.candidate !== null) {
			this._ownIceCandidates.push(aEvent.candidate);
			if(this.getExtendedEvent().hasEvent(WebRtcExtendedEventIds.NEW_ICE_CANDIDATE)) {
				this.getExtendedEvent().perform(WebRtcExtendedEventIds.NEW_ICE_CANDIDATE, aEvent.candidate);
			}
		}
		else {
			if(this.getExtendedEvent().hasEvent(WebRtcExtendedEventIds.ALL_ICE_CANDIDATES_AVAILABLE)) {
				this.getExtendedEvent().perform(WebRtcExtendedEventIds.ALL_ICE_CANDIDATES_AVAILABLE, this._ownIceCandidates);
			}
		}
	};
	
	objectFunctions._callback_streamAdded = function(aEvent) {
		console.log("com.developedbyme.utils.webrtc.PeerConnection::_callback_streamAdded");
		
		//METODO
	};
	
	objectFunctions._callback_channelAdded = function(aEvent) {
		console.log("com.developedbyme.utils.webrtc.PeerConnection::_callback_channelAdded");
		
		//METODO
	};
	
	objectFunctions._callback_streamRemoved = function(aEvent) {
		console.log("com.developedbyme.utils.webrtc.PeerConnection::_callback_streamRemoved");
		
		//METODO
	};
	
	objectFunctions._callback_negotionationNeeded = function(aEvent) {
		console.log("com.developedbyme.utils.webrtc.PeerConnection::_callback_negotionationNeeded");
		
		//METODO
	};
	
	objectFunctions._callback_iceConnectionChanged = function(aEvent) {
		console.log("com.developedbyme.utils.webrtc.PeerConnection::_callback_iceConnectionChanged");
		console.log(this._nativeConnection.iceConnectionState);
		
		switch(this._nativeConnection.iceConnectionState) {
			case IceConnectionStateTypes.CONNECTED:
				if(this.getExtendedEvent().hasEvent(WebRtcExtendedEventIds.CONNECTED)) {
					this.getExtendedEvent().perform(WebRtcExtendedEventIds.CONNECTED);
				}
				break;
			default:
				//MENOTE: do nothing
				break;
		}
	};
	
	objectFunctions._callback_signalingStateChanged = function(aEvent) {
		console.log("com.developedbyme.utils.webrtc.PeerConnection::_callback_signalingStateChanged");
		console.log(this._nativeConnection.signalingState);
		
		//METODO
	};
	
	objectFunctions.setLocalDescription = function(aDescription) {
		console.log("com.developedbyme.utils.webrtc.PeerConnection::setLocalDescription");
		console.log(aDescription);
		
		this._nativeConnection.setLocalDescription(aDescription, this._localDescriptionSetCallbackEventLink.getCallbackFunction(), this._localDescriptionErrorCallbackEventLink.getCallbackFunction());
		
	};
	
	objectFunctions.setRemoteDescription = function(aDescription) {
		console.log("com.developedbyme.utils.webrtc.PeerConnection::setRemoteDescription");
		console.log(aDescription);
		
		var descriptionTemplate = JSON.parse(JSON.stringify(aDescription));
		console.log(descriptionTemplate);
		this._nativeConnection.setRemoteDescription(new RTCSessionDescription(descriptionTemplate), this._remoteDescriptionSetCallbackEventLink.getCallbackFunction(), this._remoteDescriptionErrorCallbackEventLink.getCallbackFunction());
		
	};
	
	objectFunctions._callback_localDescriptionSet = function() {
		console.log("com.developedbyme.utils.webrtc.PeerConnection::_callback_localDescriptionSet");
		
		//METODO
	};
	
	objectFunctions._callback_localDescriptionError = function(aEvent) {
		console.log("com.developedbyme.utils.webrtc.PeerConnection::_callback_localDescriptionError");
		
		//METODO
	};
	
	objectFunctions._callback_remoteDescriptionSet = function() {
		console.log("com.developedbyme.utils.webrtc.PeerConnection::_callback_remoteDescriptionSet");
		
		//METODO
	};
	
	objectFunctions._callback_remoteDescriptionError = function(aEvent) {
		console.log("com.developedbyme.utils.webrtc.PeerConnection::_callback_remoteDescriptionError");
		
		//METODO
	};
	
	objectFunctions._callback_offerError = function(aEvent) {
		console.log("com.developedbyme.utils.webrtc.PeerConnection::_callback_offerError");
		
		//METODO
	};
	
	objectFunctions._callback_answerError = function(aEvent) {
		console.log("com.developedbyme.utils.webrtc.PeerConnection::_callback_answerError");
		
		//METODO
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case WebRtcConnectionEventIds.ICE_CANDIDATE:
			case WebRtcConnectionEventIds.ADD_STREAM:
			case WebRtcConnectionEventIds.DATA_CHANNEL:
			case WebRtcConnectionEventIds.REMOVE_STREAM:
			case WebRtcConnectionEventIds.NEGOTIATION_NEEDED:
			case WebRtcConnectionEventIds.ICE_CONNECTION_STATE_CHANGE:
			case WebRtcConnectionEventIds.SIGNALING_STATE_CHANGE:
			case WebRtcExtendedEventIds.CONNECTED:
			case WebRtcExtendedEventIds.OFFER_CREATED:
			case WebRtcExtendedEventIds.OFFER_ERROR:
			case WebRtcExtendedEventIds.ANSWER_CREATED:
			case WebRtcExtendedEventIds.ANSWER_ERROR:
			case WebRtcExtendedEventIds.LOCAL_DESCRIPTION_SET:
			case WebRtcExtendedEventIds.LOCAL_DESCRIPTION_ERROR:
			case WebRtcExtendedEventIds.REMOTE_DESCRIPTION_SET:
			case WebRtcExtendedEventIds.REMOTE_DESCRIPTION_ERROR:
			case WebRtcExtendedEventIds.NEW_ICE_CANDIDATE:
			case WebRtcExtendedEventIds.ALL_ICE_CANDIDATES_AVAILABLE:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	staticFunctions.create = function() {
		console.log("com.developedbyme.utils.webrtc.PeerConnection::create");
		
		var newPeerConection = (new ClassReference()).init();
		newPeerConection.createNewOfferWhenNegotiationIsNeeded();
		
		return newPeerConection;
	};
});