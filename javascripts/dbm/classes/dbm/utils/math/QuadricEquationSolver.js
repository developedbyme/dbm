/**
 * Utility for solving quadric equations.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.math.QuadricEquationSolver", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.math.QuadricEquationSolver");
	
	var QuadricEquationSolver = dbm.importClass("dbm.utils.math.QuadricEquationSolver");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
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
		//console.log("dbm.utils.math.QuadricEquationSolver::solveEquation");
		//console.log(aA, aB, aC);
		
		if(aA === 0) {
			if(aB === 0) {
				this.solution1 = NaN;
				this.solution2 = NaN;
				return false;
			}
			this.solution1 = -1*aC/aB;
			this.solution2 = -1*aC/aB;
			return true;
		}
		
		var sqrtValue = Math.pow(aB, 2)-(4*aA*aC);
		if(sqrtValue < 0) {
			this.solution1 = NaN;
			this.solution2 = NaN;
			return false;
		}
		var sqrtResult = Math.sqrt(sqrtValue);
		
		this.solution1 = (-1*aB-sqrtResult)/(2*aA);
		this.solution2 = (-1*aB+sqrtResult)/(2*aA);
		
		return true;
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
	 * Gets the b constant to reach a certain length.
	 *
	 * @param	aA		The multiplier for x2
	 * @param	aLength	The length to reach
	 *
	 * @return	The b constant
	 */
	staticFunctions.getContantBForLength = function(aA, aLength) {
		
		if(aA === 0) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, "[QuadricEquationSolver]", "getContantBForLength", "a is 0");
			return NaN;
		}
		else if((aA < 0 && aLength < 0) || (aA > 0 && aLength > 0)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, "[QuadricEquationSolver]", "getContantBForLength", "a and length is in the same direction. All b values would reach the length.");
			return NaN;
		}
		
		var x = Math.sqrt(aLength/(-1*aA));
		var b = -2*(aA*x);
		
		return b;
	}; //End function getContantBForLength
	
	/**
	 * Gets the x value for when a derivation result occurs.
	 *
	 * @param	aA					The multiplier for x2
	 * @param	aB					The multiplier for x
	 * @param	aDerivationResult	The value of the derivation
	 *
	 * @return	The x when the derivation result occurs
	 */
	staticFunctions.getXForDerivationResult = function(aA, aB, aDerivationResult) {
		
		return (aDerivationResult-aB)/(2*aA);
	}; //End function getXForDerivationResult
	
	/**
	 * Creates a new equation solver
	 */
	staticFunctions.create = function() {
		var newEquation = (new ClassReference()).init();
		return newEquation;
	};
});