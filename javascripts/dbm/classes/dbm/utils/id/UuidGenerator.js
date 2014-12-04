/**
 * Generates UUID
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.id.UuidGenerator", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.id.UuidGenerator");
	
	//Self reference
	var UuidGenerator = dbm.importClass("dbm.utils.id.UuidGenerator");
	
	//Error report
	
	//Dependencies
	var MersenneTwister = dbm.importClass("dbm.utils.random.MersenneTwister");
	
	//Utils
	var NumberFunctions = dbm.importClass("dbm.utils.native.number.NumberFunctions");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.id.UuidGenerator");
		
		this.randomGenerator = (new MersenneTwister()).init();
		
		return this;
	}; //End function UuidGenerator
	
	/**
	 * Gets a random part (4 hexadecimal numbers)
	 */
	objectFunctions._getRandomPart = function(aMax) {
		//console.log("getRandomPart");
		return Math.floor(this.randomGenerator.generateRealClosedOpen()*(aMax+1));
	}; //End function getRandomPart
	
	/**
	 * Generates a version 4 UUID (random)
	 *
	 * @return	The id
	 */
	objectFunctions.generateV4 = function() {
		//console.log("generateV4");
		
		var returnString = "";
		
		// 32 bits for "time_low"
		returnString += NumberFunctions.getPaddedNumber(this._getRandomPart(0xFFFF).toString(16), 4) + NumberFunctions.getPaddedNumber(this._getRandomPart(0xFFFF).toString(16), 4) + "-";

		// 16 bits for "time_mid"
		returnString += NumberFunctions.getPaddedNumber(this._getRandomPart(0xFFFF).toString(16), 4) + "-";

		// 16 bits for "time_hi_and_version",
		// four most significant bits holds version number 4
		returnString += NumberFunctions.getPaddedNumber((this._getRandomPart(0x0FFF) | 0x4000).toString(16), 4) + "-";

		// 16 bits, 8 bits for "clk_seq_hi_res",
		// 8 bits for "clk_seq_low",
		// two most significant bits holds zero and one for variant DCE1.1
		returnString += NumberFunctions.getPaddedNumber((this._getRandomPart(0x3FFF) | 0x8000).toString(16), 4) + "-";

		// 48 bits for "node"
		returnString += NumberFunctions.getPaddedNumber(this._getRandomPart(0xFFFF).toString(16) , 4) + NumberFunctions.getPaddedNumber(this._getRandomPart(0xFFFF).toString(16), 4) + NumberFunctions.getPaddedNumber(this._getRandomPart(0xFFFF).toString(16), 4);
		
		return returnString;
	}; //End function generateV4
	
	staticFunctions.create = function() {
		var newUuidGenerator = (new UuidGenerator()).init();
		return newUuidGenerator;
	}
});