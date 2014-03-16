/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.math.music.scales.ChromaticScaleFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.math.music.scales.ChromaticScaleFunctions");
	
	var ChromaticScaleFunctions = dbm.importClass("com.developedbyme.utils.math.music.scales.ChromaticScaleFunctions");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	staticFunctions.C = 0;
	staticFunctions.C_SHARP = 1;
	staticFunctions.D_FLAT = 1;
	staticFunctions.D = 2;
	staticFunctions.D_SHARP = 3;
	staticFunctions.E_FLAT = 3;
	staticFunctions.E = 4;
	staticFunctions.F = 5;
	staticFunctions.F_SHARP = 6;
	staticFunctions.G_FLAT = 6;
	staticFunctions.G = 7;
	staticFunctions.G_SHARP = 8;
	staticFunctions.A_FLAT = 8;
	staticFunctions.A = 9;
	staticFunctions.A_SHARP = 10;
	staticFunctions.B_FLAT = 10;
	staticFunctions.B = 11;
	
	staticFunctions.CHROMATIC_SCALE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
	staticFunctions.DIATONIC_SCALE = [0, 2, 4, 5, 7, 9, 11];
	staticFunctions.DIATONIC_SCALE_WITH_OCTAVE = [0, 2, 4, 5, 7, 9, 11, 12];
	
	staticFunctions.DEFAULT_OCTAVE = 4;
	
	staticFunctions.getSpeedMulitplier = function(aToneIndex, aOctave) {
		
		aOctave = VariableAliases.valueWithDefault(aOctave, ClassReference.DEFAULT_OCTAVE);
		
		return Math.pow(2, (12*(aOctave-4)+aToneIndex)/12);
	};
});