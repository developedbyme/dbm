/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.nodejs.utils.websocket.WebSocketEncodingFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.nodejs.utils.websocket.WebSocketEncodingFunctions");
	//"use strict";
	
	//Self reference
	var WebSocketEncodingFunctions = dbm.importClass("dbm.nodejs.utils.websocket.WebSocketEncodingFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	staticFunctions.encodeFrameHybi00 = function(aBuffer) {
		
		var messageLength = aBuffer.length;
		var returnBuffer = new Buffer(messageLength + 2);
		
		returnBuffer[0] = 0x00;
		aBuffer.copy(returnBuffer, 1, 0, messageLength);
		returnBuffer[messageLength + 1] = 0xFF;
		
		return returnBuffer;
	};
	
	staticFunctions.encodeFrameHybi06WithForcedMasks = function(aBuffer, aOpcode, aMask1, aMask2, aMask3, aMask4) {
		
		aOpcode = VariableAliases.valueWithDefault(aOpcode, 0x01);
		
		var messageLength = aBuffer.length;
		
		var lengthCode = messageLength;
		var maskOffset = 2;
		var messageOffset = 6;
		var extendedLength = 0;
		if(messageLength > 0xFFFF) {
			lengthCode = 127;
			maskOffset = 10;
			messageOffset = 14;
			extendedLength = 8;
		}
		else if(messageLength > 125) {
			lengthCode = 126;
			maskOffset = 4;
			messageOffset = 8;
			extendedLength = 2;
		}
		
		var returnBuffer = new Buffer(messageLength + messageOffset);
		
		returnBuffer[0] = 0x80 | aOpcode; //FIN, reserved and opcode
		returnBuffer[1] = 0x80 | lengthCode; //Mask bit and length code
		
		//Extended length
		for(var i = 0; i < extendedLength; i++) {
			returnBuffer[i+2] = (messageLength >> (8*(extendedLength-i-1))) & 0xFF;
		}
		
		var maskBuffer = new Buffer(4);
		maskBuffer[0] = aMask1;
		maskBuffer[1] = aMask2;
		maskBuffer[2] = aMask3;
		maskBuffer[3] = aMask4;
		
		//Mask
		maskBuffer.copy(returnBuffer, maskOffset, 0, 4);
		
		//Data
		for(var i = 0; i < messageLength; i++) {
			var currentMask = maskBuffer[i%4];
			returnBuffer[i+messageOffset] = currentMask ^ aBuffer[i];
		}
		
		return returnBuffer;
	};
	
	staticFunctions.encodeFrameHybi06WithoutMasks = function(aBuffer, aOpcode) {
		//console.log("dbm.nodejs.utils.websocket.WebSocketEncodingFunctions::encodeFrameHybi06WithoutMasks");
		//console.log(aBuffer, aOpcode);
		
		aOpcode = VariableAliases.valueWithDefault(aOpcode, 0x01);
		
		var messageLength = aBuffer.length;
		
		var lengthCode = messageLength;
		var messageOffset = 2;
		var extendedLength = 0;
		if(messageLength > 0xFFFF) {
			lengthCode = 127;
			messageOffset = 10;
			extendedLength = 8;
		}
		else if(messageLength > 125) {
			lengthCode = 126;
			messageOffset = 4;
			extendedLength = 2;
		}
		
		var returnBuffer = new Buffer(messageLength + messageOffset);
		
		returnBuffer[0] = 0x80 | aOpcode; //FIN, reserved and opcode
		returnBuffer[1] = 0x00 | lengthCode; //Mask bit and length code
		
		//Extended length
		for(var i = 0; i < extendedLength; i++) {
			returnBuffer[i+2] = (messageLength >> (8*(extendedLength-i-1))) & 0xFF;
		}
		
		aBuffer.copy(returnBuffer, messageOffset, 0, messageLength);
		
		return returnBuffer;
	};
	
	staticFunctions.encodeFrameHybi06 = function(aBuffer, aOpcode) {
		return ClassReference.encodeFrameHybi06WithForcedMasks(aBuffer, aOpcode, Math.floor(Math.random()*256), Math.floor(Math.random()*256), Math.floor(Math.random()*256), Math.floor(Math.random()*256));
	};
	
	staticFunctions.getBufferFromUtf8String = function(aMessage) {
		return new Buffer(aMessage, "utf8");
	};
	
	staticFunctions.encodeFrame = function(aType, aBuffer, aOpcode) {
		switch(aType) {
			case 0:
				return ClassReference.encodeFrameHybi00(aBuffer);
			case 13:
				return ClassReference.encodeFrameHybi06WithoutMasks(aBuffer, aOpcode);
			default:
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, "[WebSocketEncodingFunctions]", "encodeFrame", "No protocol version named " + aType + ". Can't encode message.");
				return null;
		}
	};
	
	staticFunctions.encodeUtf8Message = function(aType, aMessage, aOpcode) {
		return ClassReference.encodeFrame(aType, ClassReference.getBufferFromUtf8String(aMessage), aOpcode);
	};
	
	staticFunctions.decodeOpcodeHybi00 = function(aBuffer) {
		if(aBuffer.length === 2) {
			return 0x0A; //MENOTE: empty pong frame
		}
		return 0x01;
	};
	
	staticFunctions.decodeMessagesHybi00 = function(aBuffer) {
		return aBuffer.slice(1, aBuffer.length-1);
	};
	
	staticFunctions.decodeOpcodeHybi06 = function(aBuffer) {
		return aBuffer[0] & 0x0F;
	};
	
	staticFunctions.decodeMessagesHybi06 = function(aBuffer) {
		
		//METODO: implement multiple message decode
		//console.log(aBuffer);
		
		var continuationBit = aBuffer[0] & 0x80; //METODO: implement continuation
		var maskBit = aBuffer[1] & 0x80;
		var lengthCode = aBuffer[1] & 0x7F;
		var maskOffset = 2;
		var length = lengthCode;
		if(lengthCode === 0x7F) {
			maskOffset = 10;
			for(var i = 0; i < 8; i++) {
				length += aBuffer[2+i] << ((8-1)-i);
			}
		}
		else if(lengthCode === 0x7E){
			maskOffset = 4;
			length = 0;
			for(var i = 0; i < 2; i++) {
				length += aBuffer[2+i] << ((2-1)-i);
			}
		}
		if(maskBit === 0x80) {
			var maskBuffer = aBuffer.slice(maskOffset, maskOffset+4);
			var messageBuffer = aBuffer.slice(maskOffset+4, maskOffset+4+length);
			for(var i = 0; i < length; i++) {
				messageBuffer[i] ^= maskBuffer[i%4];
			}
			//console.log(messageBuffer);
			return messageBuffer;
		}
		else {
			return aBuffer.slice(maskOffset);
		}
	};
	
	staticFunctions.decodeOpcode = function(aType, aBuffer) {
		switch(aType) {
			case 0:
				return ClassReference.decodeOpcodeHybi00(aBuffer);
			case 13:
				return ClassReference.decodeOpcodeHybi06(aBuffer);
			default:
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, "[WebSocketEncodingFunctions]", "decodeOpcode", "No protocol version named " + aType + ". Can't decode opcode.");
				return null;
		}
	};
	
	staticFunctions.decodeMessages = function(aType, aBuffer) {
		switch(aType) {
			case 0:
				return ClassReference.decodeMessagesHybi00(aBuffer);
			case 13:
				return ClassReference.decodeMessagesHybi06(aBuffer);
			default:
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, "[WebSocketEncodingFunctions]", "decodeMessages", "No protocol version named " + aType + ". Can't decode messages.");
				return null;
		}
	};

	staticFunctions.splitMessagesHybi00 = function(aBuffer, aReturnArray) {
		var currentPosition = 0;
		var length = aBuffer.length;
		for(var i = 0; i < length; i++) {
			if(aBuffer[i] === 0xFF) {
				aReturnArray.push(aBuffer.slice(currentPosition, i+1));
				currentPosition = i+1;
			}
		}
	};
	
	staticFunctions.splitMessagesHybi06 = function(aBuffer, aReturnArray) {
		var continuationBit = aBuffer[0] & 0x80;
		var maskBit = aBuffer[1] & 0x80;
		var lengthCode = aBuffer[1] & 0x7F;
		var startPosition = 2;
		var length = lengthCode;
		if(lengthCode === 0x7F) {
			startPosition = 10;
			for(var i = 0; i < 8; i++) {
				length += aBuffer[2+i] << ((8-1)-i);
			}
		}
		else if(lengthCode === 0x7E){
			startPosition = 4;
			length = 0;
			for(var i = 0; i < 2; i++) {
				length += aBuffer[2+i] << ((2-1)-i);
			}
		}
		
		if(maskBit === 0x80) {
			startPosition += 4;
		}
		
		aReturnArray.push(aBuffer.slice(0, startPosition+length));
		
		if(startPosition+length < aBuffer.length) {
			ClassReference.splitMessagesHybi06(aBuffer.slice(startPosition+length), aReturnArray);
		}
	};
	
	staticFunctions.splitMessages = function(aType, aBuffer, aReturnArray) {
		switch(aType) {
			case 0:
				return ClassReference.splitMessagesHybi00(aBuffer, aReturnArray);
			case 13:
				return ClassReference.splitMessagesHybi06(aBuffer, aReturnArray);
			default:
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, "[WebSocketEncodingFunctions]", "splitMessages", "No protocol version named " + aType + ". Can't split message.");
				return null;
		}
	};
	
	staticFunctions.getAvailableDataLengthHybi00 = function(aBuffer) {
		if(aBuffer.length > 0 && aBuffer[0] !== 0x00) {
			return -1;
		}
		
		for(var i = aBuffer.length; i > 0; i--) {
			if(aBuffer[i-1] === 0xFF) {
				return i;
			}
		}
		return 0;
	};
	
	staticFunctions.getAvailableDataLengthHybi06 = function(aBuffer) {
		if(aBuffer.length > 0) {
			var reservedBits = aBuffer[0] & 0xF0;
			if(reservedBits !== 0 && reservedBits !== 0x80) {
				return -1;
			}
		}
		
		var returnValue = 0;
		
		var currentPosition = 0;
		var debugCounter = 0;
		
		while(currentPosition < aBuffer.length) {
			if(debugCounter++ > 50) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, "[WebSocketEncodingFunctions]", "getAvailableDataLengthHybi06", "Length of messages are too long.");
				console.log(aBuffer);
				return -1;
			}
			var continuationBit = aBuffer[currentPosition] & 0x80;
			var maskBit = aBuffer[currentPosition+1] & 0x80;
			var lengthCode = aBuffer[currentPosition+1] & 0x7F;
			var startPosition = currentPosition+2;
			var length = lengthCode;
			if(lengthCode === 0x7F) {
				startPosition = currentPosition+10;
				for(var i = 0; i < 8; i++) {
					length += aBuffer[currentPosition+2+i] << ((8-1)-i);
				}
			}
			else if(lengthCode === 0x7E){
				startPosition = currentPosition+4;
				length = 0;
				for(var i = 0; i < 2; i++) {
					length += aBuffer[currentPosition+2+i] << ((2-1)-i);
				}
			}
		
			if(maskBit === 0x80) {
				startPosition += 4;
			}
		
			if(startPosition+length <= aBuffer.length) {
				returnValue = startPosition+length;
			}
			currentPosition = startPosition+length;
		}
		
		return returnValue;
	};
	
	staticFunctions.getAvailableDataLength = function(aType, aBuffer) {
		switch(aType) {
			case 0:
				return ClassReference.getAvailableDataLengthHybi00(aBuffer);
			case 13:
				return ClassReference.getAvailableDataLengthHybi06(aBuffer);
			default:
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, "[WebSocketEncodingFunctions]", "getAvailableDataLength", "No protocol version named " + aType + ". Can't determin available data length.");
				return -1;
		}
	};
});