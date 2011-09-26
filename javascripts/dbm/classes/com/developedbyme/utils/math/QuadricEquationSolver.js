/**
 * Utility for solving quadric equations.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.math.QuadricEquationSolver", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.math.QuadricEquationSolver");
	
	var QuadricEquationSolver = dbm.importClass("com.developedbyme.utils.math.QuadricEquationSolver");
	
	/**
	 * Constructor
	 */
	objectFunctions.init = function() {
		this.superCall();
		
		this.solution1 = NaN;
		this.solution2 = NaN;
		
		return this;
	};
	
	/**
	 * Solves a quadric equation
	 *
	 * @param	aA	The multiplier for x2
	 * @param	aB	The multiplier for x
	 * @param	aC	The static value
	 */
	objectFunctions.solveEquation = function(aA, aB, aC) {
		var sqrtValue = Math.pow(aB, 2)-(4*aA*aC);
		if(sqrtValue < 0) {
			this.solution1 = NaN;
			this.solution2 = NaN;
		}
		var sqrtResult = Math.sqrt(sqrtValue);
		
		this.solution1 = (-1*aB-sqrtResult)/(2*aA);
		this.solution2 = (-1*aB+sqrtResult)/(2*aA);
		
		return this;
	}; //End function solveEquation
	
	/**
	 * Solves a quadric equation
	 *
	 * @param	aA	The multiplier for x2
	 * @param	aB	The multiplier for x
	 * @param	aC	The static value
	 */
	staticFunctions.solveEquation = function(aA, aB, aC) {
		var newEquation = (new ClassReference()).init();
		
		newEquation.solveEquation(aA, aB, aC);
		
		return newEquation;
	}; //End function solveEquation
	
	/**
	 * Creates a new equation solver
	 */
	staticFunctions.create = function() {
		var newEquation = (new ClassReference()).init();
		return newEquation;
	};
});