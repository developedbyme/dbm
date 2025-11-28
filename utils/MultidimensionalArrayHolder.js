export default class MultidimensionalArrayHolder {
    
    constructor() {
		
		this._lengths = null;
        this.array = [];
		
		return this;
	}
	
	getDimesionLength(aDimension) {
		return this._lengths[aDimension];
	}
	
	_getArrayPosition(aPositions) {
		
		var returnValue = 0;
		var multiplier = 1;
		
		var currentArray = this._lengths;
		var currentArrayLength = currentArray.length;
		for(var i = currentArrayLength; --i >= 0;) { //MENOTE: loop from end to start
			returnValue += multiplier*aPositions[i];
			multiplier *= currentArray[i];
		}
		
		return returnValue;
	}
	
	getValue(...aPositions) {
		
		if(aPositions.length !== this._lengths.length) {
			//METODO: error message
			return null;
		}
		
		var arrayPosition = this._getArrayPosition(aPositions);
		return this.array[arrayPosition];
	}
	
	setValue(...aPositionsAndValue) {
		if(aPositionsAndValue.length !== this._lengths.length+1) {
			console.error("Number of positions (" + (aPositionsAndValue.length-1) + ") doesn't match dimensions of this array (" + this._lengths.length + ").");
			return;
		}

        let value = aPositionsAndValue.pop();
		
		var arrayPosition = this._getArrayPosition(aPositionsAndValue);
		this.array[arrayPosition] = value;
	}
	
	setLengths(aLengths) {
		this._lengths = aLengths;
		var totalLength = 1;
		var currentArray = this._lengths;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			totalLength *= currentArray[i];
		}
		this.array = new Array(totalLength);

        return this;
	}
}