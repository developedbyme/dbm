dbm.runTempFunction(function() {
	
	var PeerConnection = dbm.importClass("com.developedbyme.utils.webrtc.PeerConnection");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var WebRtcConnectionEventIds = dbm.importClass("com.developedbyme.constants.htmlevents.WebRtcConnectionEventIds");
	var WebRtcExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.WebRtcExtendedEventIds");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var htmlCreator = dbm.singletons["dbmHtmlDomManager"].getHtmlCreator(document);
		
		var peerConnection = PeerConnection.create();
		var peerConnection2 = PeerConnection.create();
		
		var connectedFunction = function() {
			console.log("connectedFunction");
			
			//peerConnection.createDataChannel("test");
			
			navigator.webkitGetUserMedia({"audio": true, "video": true}, function (aStream) {
				console.log("Add stream");
				var objectUrl = URL.createObjectURL(aStream);
				
				var videoNode = htmlCreator.createNode("video", {"autoplay": true});
				dbm.getDocument().body.appendChild(videoNode);
				videoNode.src = objectUrl;
				peerConnection.addStream(aStream);
			  }, console.log);
		};
		
		var streamAddedFunction = function(aEvent) {
			console.log("streamAddedFunction");
			
			var objectUrl = URL.createObjectURL(aEvent.stream);
			console.log(aEvent, objectUrl);
			
			var videoNode = htmlCreator.createNode("video", {"autoplay": true});
			dbm.getDocument().body.appendChild(videoNode);
			videoNode.src = objectUrl;
		};
		
		peerConnection.getConfiguration().addIceServer("stun:stun.l.google.com:19302");
		peerConnection2.getConfiguration().addIceServer("stun:stun.l.google.com:19302");
		
		peerConnection.getExtendedEvent().addCommandToEvent(WebRtcExtendedEventIds.NEW_ICE_CANDIDATE, CallFunctionCommand.createCommand(peerConnection2, peerConnection2.addRemoteIceCandidate, [GetVariableObject.createSelectDataCommand()]));
		peerConnection2.getExtendedEvent().addCommandToEvent(WebRtcExtendedEventIds.NEW_ICE_CANDIDATE, CallFunctionCommand.createCommand(peerConnection, peerConnection.addRemoteIceCandidate, [GetVariableObject.createSelectDataCommand()]));
		peerConnection.getExtendedEvent().addCommandToEvent(WebRtcExtendedEventIds.OFFER_CREATED, CallFunctionCommand.createCommand(peerConnection2, peerConnection2.acceptOffer, [GetVariableObject.createSelectDataCommand()]));
		peerConnection2.getExtendedEvent().addCommandToEvent(WebRtcExtendedEventIds.ANSWER_CREATED, CallFunctionCommand.createCommand(peerConnection, peerConnection.setRemoteDescription, [GetVariableObject.createSelectDataCommand()]));
		
		
		peerConnection.connect();
		peerConnection2.connect();
		
		peerConnection2.getExtendedEvent().addCommandToEvent(WebRtcConnectionEventIds.ADD_STREAM, CallFunctionCommand.createCommand(this, streamAddedFunction, [GetVariableObject.createSelectDataCommand()]));
		connectedFunction();
		
		console.log(peerConnection, peerConnection2);
	});
});