dbm.registerClass("com.developedbyme.utils.animation.ShakeAnimation", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.animation.ShakeAnimation");
	
	var ShakeAnimation = dbm.importClass("com.developedbyme.utils.animation.ShakeAnimation");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	var JavascriptObjectTypes = dbm.importClass("com.developedbyme.constants.JavascriptObjectTypes");
	
	staticFunctions.createRandomShake2d = function(aXTimeline, aYTimeline, aNumberOfShakes, aCenterX, aCenterY, aAmplitudeX, aAmplitudeY, aStartTime, aMinStepTime, aMaxStepTime, aInterpolation, aReturnToOriginalPosition) {
		
		aInterpolation = VariableAliases.valueWithDefault(aInterpolation, InterpolationTypes.LINEAR);
		aReturnToOriginalPosition = VariableAliases.valueWithDefault(aReturnToOriginalPosition, true);
		
		var currentTime = aStartTime;
		
		for(var i = 0; i < aNumberOfShakes; i++) {
			var newLength = aMinStepTime+(aMaxStepTime-aMinStepTime)*Math.random();
			var newPositionX = aCenterX+(2*Math.random()-1)*aAmplitudeX;
			var newPositionY = aCenterY+(2*Math.random()-1)*aAmplitudeY;
			aXTimeline.animateValueAt(newPositionX, newLength, aInterpolation, currentTime);
			aYTimeline.animateValueAt(newPositionY, newLength, aInterpolation, currentTime);
			
			currentTime += newLength;
		}
		
		if(aReturnToOriginalPosition) {
			var newLength = aMinStepTime+(aMaxStepTime-aMinStepTime)*Math.random();
			aXTimeline.animateValueAt(aCenterX, newLength, aInterpolation, currentTime);
			aYTimeline.animateValueAt(aCenterY, newLength, aInterpolation, currentTime);
			
			currentTime += newLength;
		}
		
		return currentTime;
	};
	
	staticFunctions.createShake2dWithRandomAmplitude = function(aXTimeline, aYTimeline, aNumberOfShakes, aCenterX, aCenterY, aMinAmplitudeX, aMinAmplitudeY, aMaxAmplitudeX, aMaxAmplitudeY, aStartTime, aMinStepTime, aMaxStepTime, aInterpolation, aReturnToOriginalPosition) {
		
		aInterpolation = VariableAliases.valueWithDefault(aInterpolation, InterpolationTypes.NORMALIZED_COSINE);
		aReturnToOriginalPosition = VariableAliases.valueWithDefault(aReturnToOriginalPosition, true);
		
		var currentTime = aStartTime;
		
		for(var i = 0; i < aNumberOfShakes; i++) {
			
			var side = (i%2 === 0) ? 1 : -1;
			
			var newLength = aMinStepTime+(aMaxStepTime-aMinStepTime)*Math.random();
			var newPositionX = aCenterX+side*((2*Math.random()-1)*(aMaxAmplitudeX-aMinAmplitudeX)+aMinAmplitudeX);
			var newPositionY = aCenterY+side*((2*Math.random()-1)*(aMaxAmplitudeY-aMinAmplitudeY)+aMinAmplitudeY);
			aXTimeline.animateValueAt(newPositionX, newLength, aInterpolation, currentTime);
			aYTimeline.animateValueAt(newPositionY, newLength, aInterpolation, currentTime);
			
			currentTime += newLength;
		}
		
		if(aReturnToOriginalPosition) {
			var newLength = aMinStepTime+(aMaxStepTime-aMinStepTime)*Math.random();
			aXTimeline.animateValueAt(aCenterX, newLength, aInterpolation, currentTime);
			aYTimeline.animateValueAt(aCenterY, newLength, aInterpolation, currentTime);
			
			currentTime += newLength;
		}
		
		return currentTime;
	};
	
	staticFunctions.createRandomShake2dWithIntensity = function(aXTimeline, aYTimeline, aNumberOfShakes, aStartIntensityX, aStartIntensityY, aEndIntesityX, aEndIntesityY, aCenterX, aCenterY, aAmplitudeX, aAmplitudeY, aStartTime, aMinStepTime, aMaxStepTime, aIntensityInterpolation, aInterpolation, aReturnToOriginalPosition) {
		
		aIntensityInterpolation = VariableAliases.valueWithDefault(aIntensityInterpolation, InterpolationTypes.LINEAR);
		aInterpolation = VariableAliases.valueWithDefault(aInterpolation, InterpolationTypes.LINEAR);
		aReturnToOriginalPosition = VariableAliases.valueWithDefault(aReturnToOriginalPosition, true);
		
		var intensityInterpoaltionObject;
		
		if(typeof(aIntensityInterpolation) === JavascriptObjectTypes.TYPE_STRING) {
			intensityInterpoaltionObject = dbm.singletons.dbmAnimationManager.getInterpolationObject(aIntensityInterpolation);
		}
		else if(aInterpolation === null) {
			intensityInterpoaltionObject = aIntensityInterpolation;
		}
		
		var currentTime = aStartTime;
		
		for(var i = 0; i < aNumberOfShakes; i++) {
			
			var parameter = (i/(aNumberOfShakes-1));
			
			var intensityX = aStartIntensityX+(aEndIntesityX-aStartIntensityX)*intensityInterpoaltionObject.interpolate(parameter);
			var intensityY = aStartIntensityY+(aEndIntesityY-aStartIntensityY)*intensityInterpoaltionObject.interpolate(parameter);
			
			var newLength = aMinStepTime+(aMaxStepTime-aMinStepTime)*Math.random();
			var newPositionX = aCenterX+intensityX*(2*Math.random()-1)*aAmplitudeX;
			var newPositionY = aCenterY+intensityY*(2*Math.random()-1)*aAmplitudeY;
			
			aXTimeline.animateValueAt(newPositionX, newLength, aInterpolation, currentTime);
			aYTimeline.animateValueAt(newPositionY, newLength, aInterpolation, currentTime);
			
			currentTime += newLength;
		}
		
		if(aReturnToOriginalPosition) {
			var newLength = aMinStepTime+(aMaxStepTime-aMinStepTime)*Math.random();
			aXTimeline.animateValueAt(aCenterX, newLength, aInterpolation, currentTime);
			aYTimeline.animateValueAt(aCenterY, newLength, aInterpolation, currentTime);
			
			currentTime += newLength;
		}
		
		return currentTime;
	};
});