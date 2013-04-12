dbm.registerClass("com.developedbyme.utils.file.BinaryStreamReader", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.file.BinaryStreamReader");
	
	var BinaryStreamReader = dbm.importClass("com.developedbyme.utils.file.BinaryStreamReader");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.file.BinaryStreamReader::_init");
		
		this.superCall();
		
		this._dataArray = null;
		this._position = 0;
		this._endian = 0; //METODO: implement endian
		
		return this;
	};
	
	objectFunctions.setDataArray = function(aArray) {
		this._dataArray = new Uint8Array(aArray);
		this._position = 0;
		
		return  this;
	};
	
	objectFunctions.getPosition = function() {
		return this._position;
	};
	
	objectFunctions.seek = function(aPosition) {
		this._position = aPosition;
		
		return this;
	};
	
	objectFunctions.seekRelative = function(aPosition) {
		this._position += aPosition;
		
		return this;
	};
	
	objectFunctions.isAtEnd = function() {
		return (this._position >= this._dataArray.byteLength);
	};
	
	objectFunctions.readData = function(aLength) {
		//console.log("com.developedbyme.utils.file.BinaryStreamReader::readData");
		
		var endPosition = this._position+aLength;
		var returnArray = this._dataArray.buffer.slice(this._position, endPosition);
		this._position = endPosition;
		
		return returnArray;
	};
	
	objectFunctions.readUtf8String = function(aLength) {
		//console.log("com.developedbyme.utils.file.BinaryStreamReader::readUtf8String");
		//console.log(this._dataArray, this._dataArray.byteLength);
		var returnString = "";
		for(var i = 0; i < aLength; i++) {
			var currentCharCode = this._dataArray[this._position++];
			//console.log(currentCharCode);
			returnString += String.fromCharCode(currentCharCode);
		}
		return returnString;
	};
	
	objectFunctions.readUint = function(aLength) {
		var returnValue = 0;
		for(var i = 0; i < aLength; i++) {
			var currentValue = this._dataArray[this._position++];
			returnValue += (currentValue) << (8*(aLength-i-1));
		}
		
		return returnValue;
	};
	
	objectFunctions.readUint8 = function() {
		return this.readUint(1);
	};
	
	objectFunctions.readUint16 = function() {
		return this.readUint(2);
	};
	
	objectFunctions.readUint32 = function() {
		return this.readUint(4);
	};
	
	objectFunctions.readVariableLengthUint = function() {
		var returnValue = 0;
		while(true) {
			var currentValue = this.readUint8();
			var addValue = currentValue & 0x7f;
			returnValue += addValue;
			if(currentValue === addValue) {
				break;
			}
			returnValue <<= 7;
		}
		return returnValue;
	};
	
	objectFunctions.readInt = function(aLength) {
		var returnValue = this.readUint(aLength);
		
		if((1<<(aLength*8-1)) & returnValue) { //MENOTE: checks if first bit is set
			returnValue -= (1<<(aLength*8));
		}
		
		return returnValue;
	};
	
	objectFunctions.readInt8 = function() {
		return this.readInt(1);
	};
	
	objectFunctions.readInt16 = function() {
		return this.readInt(2);
	};
	
	objectFunctions.readInt32 = function() {
		return this.readInt(4);
	};
	
	staticFunctions.create = function(aArray) {
		var newBinaryStreamReader = (new ClassReference()).init();
		
		newBinaryStreamReader.setDataArray(aArray);
		
		return newBinaryStreamReader;
	};
});