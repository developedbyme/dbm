/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.audio.audioapiplayer.notes.ScaleFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.audio.audioapiplayer.notes.ScaleFunctions");
	
	var ScaleFunctions = dbm.importClass("com.developedbyme.utils.audio.audioapiplayer.notes.ScaleFunctions");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var Note = dbm.importClass("com.developedbyme.utils.audio.audioapiplayer.notes.Note");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ChromaticScaleFunctions = dbm.importClass("com.developedbyme.utils.math.music.scales.ChromaticScaleFunctions");
	
	staticFunctions.createScale = function(aContext, aOutput, aBuffer, aLoop, aDuration, aAdjustDurationToLoop, aScale, aOctave) {
		
		aLoop = VariableAliases.valueWithDefault(aLoop, false);
		aDuration = VariableAliases.valueWithDefault(aDuration, -1);
		aAdjustDurationToLoop = VariableAliases.valueWithDefault(aAdjustDurationToLoop, false);
		aScale = VariableAliases.valueWithDefault(aScale, ChromaticScaleFunctions.CHROMATIC_SCALE);
		aOctave = VariableAliases.valueWithDefault(aOctave, ChromaticScaleFunctions.DEFAULT_OCTAVE);
		
		var returnArray = new Array(aScale.length);
		
		var currentArray = aScale;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentNotePosition = currentArray[i];
			
			var newSource = aContext.createBufferSource();
			newSource.buffer = aBuffer;
			newSource.loop = aLoop;
			newSource.playbackRate.value = ChromaticScaleFunctions.getSpeedMulitplier(currentNotePosition, aOctave);
			
			var currentDuration = (aAdjustDurationToLoop) ? Note.getBestLoopPoint(newSource, aDuration) : aDuration;
			
			var newNote = Note.create(aContext, newSource, aDuration);
			newNote.connectOutput(aOutput);
			returnArray[i] = newNote;
		}
		
		return returnArray;
	};
});