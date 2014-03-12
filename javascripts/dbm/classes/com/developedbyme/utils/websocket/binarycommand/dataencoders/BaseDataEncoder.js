dbm.registerClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.BaseDataEncoder", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.websocket.binarycommand.dataencoders.BaseDataEncoder");
	
	//Self reference
	var BaseDataEncoder = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.dataencoders.BaseDataEncoder");
	
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
		//console.log("com.developedbyme.utils.websocket.binarycommand.dataencoders.BaseDataEncoder::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.encode = function(aEncodingData) {
		this.encodeValue(aEncodingData.getNextData(), aEncodingData);
	};
	
	objectFunctions.encodeValue = function(aValue, aEncodingData) {
		aEncodingData.addToMessage(aValue);
	};
	
	objectFunctions.decode = function(aDecodingData) {
		aDecodingData.addData(this.decodeWithoutStore(aDecodingData));
	};
	
	objectFunctions.decodeWithoutStore = function(aDecodingData) {
		//METODO: error message
		//MENOTE: shoud be overridden
		return null;
	};
});