dbm.registerClass("com.developedbyme.utils.websocket.binarycommand.TextEncodingData", "com.developedbyme.utils.websocket.binarycommand.EncodingData", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.websocket.binarycommand.TextEncodingData");
	
	//Self reference
	var TextEncodingData = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.TextEncodingData");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.websocket.binarycommand.TextEncodingData::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.addData = function(aData) {
		this._data.push(aData);
	};
	
	objectFunctions.addToMessage = function(aValue) {
		this._message += String.fromCharCode(aValue);
	};
	
	objectFunctions.addStringToMessage = function(aValue) {
		this._message += aValue;
	};
	
	objectFunctions.startEncoding = function() {
		this._message = "";
		this._dataPosition = 0;
		
		return this;
	};
	
	objectFunctions.getNextByte = function() {
		var returnValue = this._message.charCodeAt(this._messagePosition);
		this._messagePosition++;
		return returnValue;
	};
	
	objectFunctions.getNextBytesAsUtf8String = function(aLength) {
		var returnValue = this._message.substring(this._messagePosition, this._messagePosition+aLength);
		
		this._messagePosition += aLength;
		return returnValue;
	};
	
	staticFunctions.create = function() {
		return ClassReference._createAndInitClass(ClassReference);
	};
	
	staticFunctions.createEncoding = function(aDataArray) {
		return ClassReference._createAndInitClass(ClassReference).setData(aDataArray).startEncoding();
	};
	
	staticFunctions.createDecoding = function(aMessage) {
		return ClassReference._createAndInitClass(ClassReference).setMessage(aMessage).startDecoding();
	};
});