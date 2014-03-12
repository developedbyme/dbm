dbm.registerClass("com.developedbyme.utils.websocket.binarycommand.EncodingData", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.websocket.binarycommand.EncodingData");
	
	//Self reference
	var EncodingData = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.EncodingData");
	
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
		//console.log("com.developedbyme.utils.websocket.binarycommand.EncodingData::_init");
		
		this.superCall();
		
		this._data = null;
		this._dataPosition = 0;
		
		this._message = null;
		this._messagePosition = 0;
		
		return this;
	};
	
	objectFunctions.setData = function(aDataArray) {
		this._data = aDataArray;
		
		return this;
	};
	
	objectFunctions.getDecodedData = function() {
		return this._data;
	};
	
	objectFunctions.setMessage = function(aMessage) {
		this._message = aMessage;
		
		return this;
	};
	
	objectFunctions.getEncodedMessage = function() {
		return this._message;
	};
	
	objectFunctions.addData = function(aData) {
		this._data.push(aData);
		
		return this;
	};
	
	objectFunctions.addToMessage = function(aValue) {
		//MENOTE: should be overridden
	};
	
	objectFunctions.addStringToMessage = function(aValue) {
		//MENOTE: should be overridden
	};
	
	objectFunctions.startEncoding = function() {
		//MENOTE: should be overridden
		
		return this;
	};
	
	objectFunctions.startDecoding = function() {
		this._data = new Array();
		this._messagePosition = 0;
		
		return this;
	};
	
	objectFunctions.getNextData = function() {
		var returnValue = this._data[this._dataPosition];
		this._dataPosition++;
		
		return returnValue;
	};
	
	objectFunctions.getNextByte = function() {
		//METODO: error message
		//MENOTE: should be overridden
		
		return 0;
	};
	
	objectFunctions.getNextBytesAsUtf8String = function(aLength) {
		//METODO: error message
		//MENOTE: should be overridden
		
		this._messagePosition += aLength;
		return "";
	};
	
	objectFunctions.skipBytes = function(aLength) {
		this._messagePosition += aLength;
		
		return this;
	};
	
	staticFunctions.create = function() {
		return ClassReference._createAndInitClass(ClassReference);
	};
});