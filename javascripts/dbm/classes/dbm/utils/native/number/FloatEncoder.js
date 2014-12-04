/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.native.number.FloatEncoder", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.native.number.FloatEncoder");
	
	var FloatEncoder = dbm.importClass("dbm.utils.native.number.FloatEncoder");
	
	staticFunctions.decodeBinary32 = function(aValue) {
		var sign = (aValue & 0x80000000) ? -1 : 1;
		var exponent = (aValue >> 23) & 0xFF;
		var fraction = aValue & ((1 << 23)-1);
		
		if(exponent === 0xFF) {
			return (fraction) ? Number.NaN : sign * Number.POSITIVE_INFINITY;
		}
		
		var mantissaStart = 1;
		if(exponent === 0x00) {
			if(fraction === 0) return sign * 0.0;
			exponent = 1;
			mantissaStart = 0;
		}
		
		return sign * Math.pow(2, exponent-127) * (mantissaStart + (fraction / (1 << 23)));
	};
	
	staticFunctions.encodeBinary32 = function(aValue) {
		//console.log("dbm.utils.native.number.FloatEncoder::encodeBinary32");
		var returnValue = 0;
		
		if(aValue === 0) {
			return 0;
		}
		else if(isNaN(aValue)) {
			return 0x7FC00000;
		}
		else if(aValue === Number.POSITIVE_INFINITY) {
			return 0x7F800000;
		}
		else if(aValue === Number.NEGATIVE_INFINITY) {
			return 0xFF800000;
		}
		
		if(aValue < 0) {
			returnValue += Math.pow(2, 31);
			aValue *= -1;
		}
		
		var integerValue = Math.floor(aValue);
		var fractionValue = aValue-integerValue;
		
		var exponent = ClassReference._getExponent(integerValue, 128);
		
		var countNegativeExponent = (exponent === -1);
		
		if(exponent !== -1) {
			integerValue -= Math.pow(2, exponent);
			for(var i = 0; i < exponent; i++) {
				var nextSwitch = Math.pow(2, exponent-i-1);
				if(integerValue >= nextSwitch) {
					returnValue += Math.pow(2, 23-i-1);
					integerValue -= nextSwitch;
				}
			}
		}
		
		var numberOfFractionBits = 23-(exponent);
		
		var currentFraction = 2*fractionValue;
		for(var i = 0; i < numberOfFractionBits; i++) {
			if(currentFraction < 1) {
				if(countNegativeExponent) {
					if(exponent > -126) {
						exponent--;
						i--;
					}
					else {
						exponent--;
						countNegativeExponent = false;
					}
				}
				else {
					//MENOTE: do nothing
				}
			}
			else {
				if(countNegativeExponent) {
					countNegativeExponent = false;
					exponent--;
				}
				
				currentFraction -= 1;
				returnValue += Math.pow(2, numberOfFractionBits-i-1);
			}
			if(currentFraction === 0) {
				break;
			}
			currentFraction *= 2;
		}
		
		returnValue += (exponent+127) * Math.pow(2, 23);
		
		return returnValue;
	};
	
	staticFunctions._getExponent = function(aValue, aMaxLength) {
		for(var i = 0; i <= aMaxLength; i++) {
			if(aValue < Math.pow(2, i)) {
				return i-1;
			}
		}
	};
});
