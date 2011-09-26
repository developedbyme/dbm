/* 
   Implementation based on:

   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.

   Before using, initialize the state by using init_genrand(seed)  
   or init_by_array(init_key, key_length).

   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.                          

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:

	 1. Redistributions of source code must retain the above copyright
		notice, this list of conditions and the following disclaimer.

	 2. Redistributions in binary form must reproduce the above copyright
		notice, this list of conditions and the following disclaimer in the
		documentation and/or other materials provided with the distribution.

	 3. The names of its contributors may not be used to endorse or promote 
		products derived from this software without specific prior written 
		permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/

/**
 * A mersenne twister random generator.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.random.MersenneTwister", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.random.MersenneTwister");
	
	var MersenneTwister = dbm.importClass("com.developedbyme.utils.random.MersenneTwister");
	
	staticFunctions.N = 624;
	staticFunctions.M = 397;
	
	staticFunctions.MATRIX_A = 0x9908b0df;   /* constant vector a */
	staticFunctions.UPPER_MASK = 0x80000000; /* most significant w-r bits */
	staticFunctions.LOWER_MASK = 0x7fffffff; /* least significant r bits */
	
	staticFunctions.mag01 = new Array(2);
	
	/**
	 * Constructor
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.random.MersenneTwister::init");
		
		this.mt = new Array(ClassReference.N); /* the array for the state vector  */
		this.mti = ClassReference.N+1; /* mti==N+1 means mt[N] is not initialized */
		
		return this;
	} //End function MersenneTwister
	
	objectFunctions._multiplyUint32 = function(aNumber1, aNumber2) {
		//console.log("com.developedbyme.utils.random.MersenneTwister::_multiplyUint32");
		//console.log(aNumber1, aNumber2);
		var rotateTimes = Math.ceil(0xFFFFFFFF/aNumber2);
		//console.log("rotateTimes", rotateTimes);
		if(aNumber1 < rotateTimes) {
			//console.log("+1", aNumber1*aNumber2);
			return aNumber1*aNumber2;
		}
		var rotateOffset = aNumber2-(0xFFFFFFFF-aNumber2*(rotateTimes-1))-1;
		//console.log("rotateOffset", rotateOffset);
		//if(rotateOffset == 0) {
		//	console.log("+2", aNumber2);
		//	return aNumber2;
		//}
		var times = Math.floor(aNumber1/rotateTimes);
		var extra = this._multiplyUint32((aNumber1-(times*rotateTimes)), aNumber2);
		
		var newValue = 0;
		if(rotateOffset != 0) {
			newValue = this._multiplyUint32(times, rotateOffset);
		}
		//console.log("times, extra, newValue", times, extra, newValue);
		//console.log("+3", this._addUint32(newValue, extra));
		return this._addUint32(newValue, extra);
	}
	
	/*
	objectFunctions._multiplyUint32For = function(aNumber1, aNumber2) {
		//console.log("com.developedbyme.utils.random.MersenneTwister::_multiplyUint32For");
		var returnValue = 0;
		for(var i = 0; i < aNumber2; i++) {
			returnValue = this._addUint32(returnValue, aNumber1);
		}
		return returnValue;
	}
	*/
	
	objectFunctions._addUint32 = function(aNumber1, aNumber2) {
		//console.log("com.developedbyme.utils.random.MersenneTwister::_addUint32");
		var left = 0xFFFFFFFF-aNumber2;
		if(left >= aNumber1) {
			return aNumber1+aNumber2;
		}
		return aNumber1-(left+1);
	}
	
	objectFunctions._subtractUint32 = function(aNumber1, aNumber2) {
		//console.log("com.developedbyme.utils.random.MersenneTwister::_subtractUint32");
		if(aNumber1 >= aNumber2) {
			return aNumber1-aNumber2;
		}
		return 0xFFFFFFFF-(aNumber2-aNumber1+1);
	}
	
	objectFunctions._andUint32 = function(aNumber1, aNumber2) {
		//console.log("com.developedbyme.utils.random.MersenneTwister::_andUint32");
		var returnValue = 0;
		for(var i = 0; i < 32; i++) {
			var shiftValue = 1 << i;
			if((aNumber1 & shiftValue) && (aNumber2 & shiftValue)) {
				returnValue += Math.pow(2, i);
			}
		}
		return returnValue;
	}
	
	objectFunctions._orUint32 = function(aNumber1, aNumber2) {
		//console.log("com.developedbyme.utils.random.MersenneTwister::_orUint32");
		var returnValue = 0;
		for(var i = 0; i < 32; i++) {
			var shiftValue = 1 << i;
			if((aNumber1 & shiftValue) || (aNumber2 & shiftValue)) {
				returnValue += Math.pow(2, i);
			}
		}
		return returnValue;
	}
	
	objectFunctions._xorUint32 = function(aNumber1, aNumber2) {
		//console.log("com.developedbyme.utils.random.MersenneTwister::_xorUint32");
		var returnValue = 0;
		for(var i = 0; i < 32; i++) {
			var shiftValue = 1 << i;
			if((aNumber1 & shiftValue) != (aNumber2 & shiftValue)) {
				returnValue += Math.pow(2, i);
			}
		}
		return returnValue;
	}
	
	/**
	 * Initializes mt[N] with a seed.
	 *
	 * @param	aSeed	The seed to use.
	 *
	 * @return	self
	 */
	objectFunctions.initByUint = function(aSeed) {
		//console.log("initByUint");
		this.mt[0] = aSeed & 0xffffffff;
		//console.log(this.mt[0]);
		for (this.mti=1; this.mti<ClassReference.N; this.mti++) {
			this.mt[this.mti] = this._addUint32(this._multiplyUint32(1812433253, this._xorUint32(this.mt[this.mti-1], (this.mt[this.mti-1] >>> 30))), this.mti);
			//console.log(this.mti, this.mt[this.mti].toString(16), this.mt[this.mti-1], (this.mt[this.mti-1] >>> 30), this._xorUint32(this.mt[this.mti-1], (this.mt[this.mti-1] >>> 30)));
			/* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
			/* In the previous versions, MSBs of the seed affect   */
			/* only MSBs of the array mt[].                        */
			
			//if(this.mti == 1) {
			//	break; //MEDEBUG
			//	console.log(this.mt[this.mti]);
			//	console.log(this.mt[this.mti-1] >>> 30);
			//	console.log(this._xorUint32(this.mt[this.mti-1], (this.mt[this.mti-1] >>> 30)));
			//	console.log(this._multiplyUint32(1812433253, this._xorUint32(this.mt[this.mti-1], (this.mt[this.mti-1] >>> 30))));
			//	console.log(this._multiplyUint32For(1812433253, this._xorUint32(this.mt[this.mti-1], (this.mt[this.mti-1] >>> 30))));
			//}
		}
		//console.log(this.mt[0]);
		return this;
	} //End function initByUint

	/**
	 * Initialize by an array.
	 *
	 * @param	aKeysArray	The keys to seed with.
	 *
	 * @return	self
	 */
	objectFunctions.initByArray = function(aKeysArray) {
		//console.log("initByArray");
		var keysLength = aKeysArray.length;
		
		var i = 1;
		var j = 0;
		var k = (ClassReference.N > keysLength) ? ClassReference.N : keysLength;
		this.initByUint(19650218);
		//console.log(this.mt[0]);
		//console.log(this.mt);
		for (; k; k--) {
			this.mt[i] = this._addUint32(this._addUint32(this._xorUint32(this.mt[i], this._multiplyUint32(this._xorUint32(this.mt[i-1], (this.mt[i-1] >>> 30)), 1664525)), aKeysArray[j]), j); /* non linear */
			i++; j++;
			if (i>=ClassReference.N) { 
				this.mt[0] = this.mt[ClassReference.N-1];
				i=1;
			}
			if (j>=keysLength) {
				j=0;
			}
		}
		//console.log(this.mt);
		for (k=ClassReference.N-1; k; k--) {
			this.mt[i] = this._subtractUint32(this._xorUint32(this.mt[i], this._multiplyUint32(this._xorUint32(this.mt[i-1], (this.mt[i-1] >>> 30)), 1566083941)), i); /* non linear */
			i++;
			if (i>=ClassReference.N) {
				this.mt[0] = this.mt[ClassReference.N-1];
				i=1;
			}
		}
		//console.log(this.mt);
		
		this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */ 
		//console.log(this.mt);
		
		return this;
	} //End function initByArray
	
	/**
	 * Generates a random number on [0,0xffffffff]-interval
	 */
	objectFunctions.generateInt32 = function() {
		//console.log("com.developedbyme.utils.random.MersenneTwister::generateInt32");
		var yValue;
		ClassReference.mag01[0] = 0;
		ClassReference.mag01[1] = ClassReference.MATRIX_A;
		/* mag01[x] = x * MATRIX_A  for x=0,1 */
		
		if (this.mti >= ClassReference.N) { /* generate N words at one time */
			var kk;
			
			if (this.mti == ClassReference.N+1) {   /* if init_genrand() has not been called, */
				this.initByUint(5489);
			}/* a default initial seed is used */
			
			for (kk=0;kk<ClassReference.N-ClassReference.M;kk++) {
				yValue = this._orUint32(this._andUint32(this.mt[kk], ClassReference.UPPER_MASK), this._andUint32(this.mt[kk+1], ClassReference.LOWER_MASK));
				//console.log("+" + kk, this.mt[kk].toString(16), this.mt[kk+1].toString(16), yValue);
				this.mt[kk] = this._xorUint32(this._xorUint32(this.mt[kk+ClassReference.M], (yValue >>> 1)), ClassReference.mag01[yValue & 1]);
			}
			for (;kk<ClassReference.N-1;kk++) {
				yValue = this._orUint32(this._andUint32(this.mt[kk], ClassReference.UPPER_MASK), this._andUint32(this.mt[kk+1], ClassReference.LOWER_MASK));
				this.mt[kk] = this._xorUint32(this._xorUint32(this.mt[kk+(ClassReference.M-ClassReference.N)], (yValue >>> 1)), ClassReference.mag01[yValue & 1]);
				//console.log("-" + kk, this.mt[kk], yValue);
			}
			yValue = this._orUint32(this._andUint32(this.mt[ClassReference.N-1], ClassReference.UPPER_MASK), this._andUint32(this.mt[0], ClassReference.LOWER_MASK));
			this.mt[ClassReference.N-1] = this._xorUint32(this._xorUint32(this.mt[ClassReference.M-1], (yValue >>> 1)), ClassReference.mag01[yValue & 1]);
			
			this.mti = 0;
		}
		
		yValue = this.mt[this.mti++];
		
		/* Tempering */
		yValue = this._xorUint32(yValue, (yValue >>> 11));
		yValue = this._xorUint32(yValue, this._andUint32((yValue << 7), 0x9d2c5680));
		yValue = this._xorUint32(yValue, this._andUint32((yValue << 15), 0xefc60000));
		yValue = this._xorUint32(yValue, (yValue >>> 18));
		
		return yValue;
	} //End function generateInt32
	
	/**
	 * Generates a random number on [0,0x7fffffff]-interval 
	 */
	objectFunctions.generateInt31 = function() {
		return (this.generateInt32()>>1);
	} //End function generateInt31
	
	/** 
	 * Generates a random number on [0,1]-real-interval
	 */
	objectFunctions.generateRealClosedClosed = function() {
		return this.generateInt32()*(1.0/4294967295.0); 
		/* divided by 2^32-1 */ 
	} //End function generateRealClosedClosed
	
	/**
	 * Generates a random number on [0,1)-real-interval
	 */
	objectFunctions.generateRealClosedOpen = function() {
		return this.generateInt32()*(1.0/4294967296.0); 
		/* divided by 2^32 */
	} //End function generateRealClosedOpen
	
	/**
	 * Generates a random number on (0,1)-real-interval
	 */
	objectFunctions.generateRealOpenOpen = function() {
		return (Number(this.generateInt32()) + 0.5)*(1.0/4294967296.0); 
		/* divided by 2^32 */
	} //End function generateRealOpenOpen
	
	/**
	 * Generates a random number on [0,1) with 53-bit resolution
	 */
	objectFunctions.generateRealClosedOpenResolution53 = function() { 
		var a = this.generateInt32()>>5;
		var b = this.generateInt32()>>6; 
		return(Number(a*67108864.0)+b)*(1.0/9007199254740992.0); 
	} //End function generateRealClosedOpenResolution53
	
	/**
	 * Tests the function.
	 */
	objectFunctions.test = function() {
		var i;
		var initSeed = [0x123, 0x234, 0x345, 0x456];
		this.initByArray(initSeed);
		console.log("//1000 outputs of Mersenne Twister (uint) --------");
		for (i=0; i<1000; i++) {
			console.log(this.generateInt32());
		}
		console.log("//-----------------------------------------------");
		console.log("//1000 outputs of Mersenne Twister (real) -------");
		for (i=0; i<1000; i++) {
			console.log(this.generateRealClosedOpen());
		}
		console.log("//-----------------------------------------------");
	}
});