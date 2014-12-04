/**
 * Global utility for solving equations.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.math.EquationSolver", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.math.EquationSolver");
		
	/**
	 * Solves an equation with one variable.
	 *
	 * @param	aSolveArray	The array containing all the data and is transformed to solved array.
	 */
	staticFunctions.solveEquation = function(aSolveArray) {
		//console.log("dbm.utils.math.EquationSolver.solveEcuation");
		var eliminationArray = aSolveArray;
		var arrayLength = eliminationArray.length;
		
		for(var i = 0; ++i < arrayLength;) {
			//MENOTE: no elimination on first row
			var currentEliminationArray = eliminationArray[i];
			var currentDataArray = eliminationArray[i];
			var currentRemoveArray;
			for(var j = 0; j < i; j++) {
				currentRemoveArray = eliminationArray[j];
				var multiplier = currentDataArray[j]/currentRemoveArray[j];
				for(var k = 0; k < currentEliminationArray.length; k++) {
					currentEliminationArray[k] = currentDataArray[k] - multiplier*currentRemoveArray[k];
				}
				currentEliminationArray[j] = 0;
			}
		}
		
		for(var i = arrayLength; --i >= 0;) {
			var arrayTotalLength = eliminationArray[i].length;
			for(var j = arrayLength; --j > i;) {
				var rowMultiplier = eliminationArray[i][j];
				for(var k = arrayLength-1; ++k < arrayTotalLength;) {
					eliminationArray[i][k] = eliminationArray[i][k]-rowMultiplier*eliminationArray[j][k];
				}
				eliminationArray[i][j] = 0;
			}
			var rowMultiplier = eliminationArray[i][i];
			eliminationArray[i][i] = 1;
			for(var k = arrayLength-1; ++k < arrayTotalLength;) {
				eliminationArray[i][k] /= rowMultiplier;
			}
		}
	}; //End function solveEquation
});