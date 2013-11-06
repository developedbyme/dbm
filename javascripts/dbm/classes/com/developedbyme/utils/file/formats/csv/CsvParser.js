dbm.registerClass("com.developedbyme.utils.file.formats.csv.CsvParser", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.file.formats.csv.CsvParser");
	
	var CsvParser = dbm.importClass("com.developedbyme.utils.file.formats.csv.CsvParser");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ScopeFunctions = dbm.importClass("com.developedbyme.utils.native.string.ScopeFunctions");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.file.formats.csv.CsvParser::_init");
		
		this.superCall();
		
		this._rowDelimiter = "\n";
		this._fieldDelimiter = ",";
		this._stringScope = "\"";
		
		this._rawData = null;
		this._rows = new Array();
		
		return this;
	};
	
	objectFunctions.setData = function(aData) {
		console.log("com.developedbyme.utils.file.formats.csv.CsvParser::setData");
		
		this._rawData = aData;
		this._rows = new Array();
		
		return this;
	};
	
	objectFunctions.setup = function(aFieldDelimiter, aRowDelimiter, aStringScope) {
		console.log("com.developedbyme.utils.file.formats.csv.CsvParser::setup");
		
		if(VariableAliases.isSet(aRowDelimiter)) {
			this._rowDelimiter = aRowDelimiter;
		}
		if(VariableAliases.isSet(aFieldDelimiter)) {
			this._fieldDelimiter = aFieldDelimiter;
		}
		if(VariableAliases.isSet(aStringScope)) {
			this._stringScope = aStringScope;
		}
		
		return this;
	};
	
	
	objectFunctions.getRows = function() {
		return this._rows;
	};
	
	
	objectFunctions.getRow = function(aIndex) {
		return this._rows[aIndex];
	};
	
	objectFunctions.findRowByField = function(aColumnIndex, aSearchValue, aStartIndex, aEndIndex) {
		
		aStartIndex = VariableAliases.valueWithDefault(aStartIndex, 0);
		aEndIndex = VariableAliases.valueWithDefault(aEndIndex, this._rows.length);
		
		var currentArray = this._rows;
		var currwentArrayLength = Math.min(currentArray.length, aEndIndex);
		for(var i = aStartIndex; i < aEndIndex; i++) {
			var currentRow = currentArray[i];
			if(currentRow[aColumnIndex] === aSearchValue) {
				return i;
			}
		}
		return -1;
	};
	
	objectFunctions.getAssociativeArray = function(aFieldNames, aStartIndex, aEndIndex) {
		aStartIndex = VariableAliases.valueWithDefault(aStartIndex, 0);
		aEndIndex = VariableAliases.valueWithDefault(aEndIndex, this._rows.length);
		
		var currentArrayLength = aEndIndex-aStartIndex;
		var returnArray = new Array(currentArrayLength);
		
		var currentArray = this._rows;
		var currentArray2 = aFieldNames;
		var currentArray2Length = currentArray2.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentRow = currentArray[i+aStartIndex];
			var currentObject = new Object();
			for(var j = 0; j < currentArray2Length; j++) {
				currentObject[currentArray2[j]] = currentRow[j];
			}
			returnArray[i] = currentObject;
		}
		
		return returnArray;
	}
	
	objectFunctions.parse = function() {
		
		var data = this._rawData;
		var dataLength = data.length;
		
		var currentPosition = 0;
		var currentRow = new Array();
		
		var debugCounter = 0;
		while(currentPosition < dataLength) {
			if(debugCounter++ > 100000) {
				//METODO error message
				break;
			}
			
			var firstRowDelimiter = data.indexOf(this._rowDelimiter, currentPosition);
			var firstFieldDelimiter = data.indexOf(this._fieldDelimiter, currentPosition);
			var firstScopePosition = data.indexOf(this._stringScope, currentPosition);
			
			if(firstScopePosition === currentPosition) {
				var stringScope = ScopeFunctions.getLegacyEscapedTextScope(data, firstScopePosition, this._stringScope, this._stringScope);
				var stringData = data.substring(firstScopePosition+this._stringScope.length, stringScope.end);
				currentPosition = stringScope.end+this._stringScope.length;
				currentRow.push(stringData);
				
				firstFieldDelimiter = data.indexOf(this._fieldDelimiter, currentPosition);
				firstScopePosition = data.indexOf(this._stringScope, currentPosition);
				
				if(firstFieldDelimiter === currentPosition) {
					currentPosition += this._fieldDelimiter.length;
				}
				else if(firstRowDelimiter === currentPosition) {
					currentPosition += this._rowDelimiter.length;
					this._rows.push(currentRow);
					currentRow = new Array();
				}
			}
			else {
				if((firstFieldDelimiter < firstRowDelimiter && firstFieldDelimiter !== -1) || (firstFieldDelimiter > -1 && firstRowDelimiter === -1)) {
					var valueData = data.substring(currentPosition, firstFieldDelimiter);
					currentRow.push(valueData);
					currentPosition = firstFieldDelimiter+this._fieldDelimiter.length;
				}
				else if((firstRowDelimiter < firstFieldDelimiter && firstRowDelimiter !== -1) || (firstRowDelimiter > -1 && firstFieldDelimiter === -1)) {
					var valueData = data.substring(currentPosition, firstRowDelimiter);
					currentRow.push(valueData);
					currentPosition = firstRowDelimiter+this._rowDelimiter.length;
					this._rows.push(currentRow);
					currentRow = new Array();
				}
				else {
					var valueData = data.substring(currentPosition, dataLength);
					currentRow.push(valueData);
					currentPosition = dataLength;
					this._rows.push(currentRow);
					currentRow = null;
					break;
				}
			}
		}
	};
	
	staticFunctions.create = function(aData, aFieldDelimiter, aRowDelimiter, aStringScope) {
		var newCsvParser = (new ClassReference()).init();
		
		newCsvParser.setData(aData);
		newCsvParser.setup(aFieldDelimiter, aRowDelimiter, aStringScope);
		
		return newCsvParser;
	};
});