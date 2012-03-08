/**
 * Generates UUID
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.id.UuidGenerator", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.id.UuidGenerator");
	
	var UuidGenerator = dbm.importClass("com.developedbyme.utils.id.UuidGenerator");
	
	var MersenneTwister = dbm.importClass("com.developedbyme.utils.random.MersenneTwister");
	var NumberFunctions = dbm.importClass("com.developedbyme.utils.native.number.NumberFunctions");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.id.UuidGenerator");
		
		this.randomGenerator = (new MersenneTwister()).init();
		
		return this;
	} //End function UuidGenerator
	
	/**
	 * Gets a random part (4 hexadecimal numbers)
	 */
	objectFunctions._getRandomPart = function(aMax) {
		//console.log("getRandomPart");
		return Math.floor(this.randomGenerator.generateRealClosedOpen()*(aMax+1));
	} //End function getRandomPart
	
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
	} //End function generateV4
});