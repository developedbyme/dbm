/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.math.physics.SwingingAcceleration", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.math.physics.SwingingAcceleration");
	
	var SwingingAcceleration = dbm.importClass("dbm.utils.math.physics.SwingingAcceleration");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var AngleFunctions = dbm.importClass("dbm.utils.math.AngleFunctions");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		this.superCall();
		
		this.forceX = 0;
		this.forceY = 0;
		
		this.currentPosition = 0;
		this.currentSpeed = 0;
		this.stepLength = 0.01;
		this.speedDamping = 0;
		
		this.simulationTime = 0;
		
		return this;
	};
	
	objectFunctions.step = function() {
		var newSpeed = this.currentSpeed*(1-this.speedDamping)+this.stepLength*(Math.sin(this.currentPosition)*this.forceX+Math.cos(this.currentPosition)*this.forceY);
		this.currentPosition += this.stepLength*0.5*(newSpeed+this.currentSpeed);
		this.currentSpeed = newSpeed;
		this.simulationTime += this.stepLength;
	};
	
	objectFunctions.stepWithPositionCheck = function(aPosition, aExactness) {
		aExactness = VariableAliases.valueWithDefault(aExactness, 0.01);
		
		var oldPosition = AngleFunctions.normalizeAngle(this.currentPosition);
		
		var normalizedPosition = AngleFunctions.normalizeAngle(aPosition);
		var normalizedMinPosition = AngleFunctions.normalizeAngle(aPosition-aExactness);
		var normalizedMaxPosition = AngleFunctions.normalizeAngle(aPosition+aExactness);
		
		this.step();
		
		var newPosition = AngleFunctions.normalizeAngle(this.currentPosition);
		return (AngleFunctions.angleIsInNormalizedRange(AngleFunctions.normalizeAngle(this.currentPosition), normalizedMinPosition, normalizedMaxPosition) || AngleFunctions.angleIsInNormalizedRange(normalizedPosition, oldPosition, newPosition));
	};
	
	objectFunctions.stepUntilPosition = function(aPosition, aExactness) {
		
		aExactness = VariableAliases.valueWithDefault(aExactness, 0.01);
		
		var oldPosition = AngleFunctions.normalizeAngle(this.currentPosition);
		
		var normalizedPosition = AngleFunctions.normalizeAngle(aPosition);
		var normalizedMinPosition = AngleFunctions.normalizeAngle(aPosition-aExactness);
		var normalizedMaxPosition = AngleFunctions.normalizeAngle(aPosition+aExactness);
		
		var debugCounter = 0;
		
		while(true) {
			
			var newPosition = AngleFunctions.normalizeAngle(this.currentPosition);
			if(AngleFunctions.angleIsInNormalizedRange(AngleFunctions.normalizeAngle(this.currentPosition), normalizedMinPosition, normalizedMaxPosition) || AngleFunctions.angleIsInNormalizedRange(normalizedPosition, oldPosition, newPosition)) {
				break;
			}
			
			if(debugCounter++ > 10000) {
				//METODO: error message
				break;
			}
			this.step();
			oldPosition = newPosition;
		}
	};
	
	staticFunctions.create = function(aCurrentPosition, aCurrentSpeed, aSpeedDamping, aForceX, aForceY, aStepLength) {
		var newSwingingAcceleration = (new ClassReference()).init();
		
		newSwingingAcceleration.currentPosition = aCurrentPosition;
		newSwingingAcceleration.currentSpeed = aCurrentSpeed;
		newSwingingAcceleration.stepLength = VariableAliases.valueWithDefault(aStepLength, 0.01);
		newSwingingAcceleration.speedDamping = aSpeedDamping;
		
		newSwingingAcceleration.forceX = aForceX;
		newSwingingAcceleration.forceY = aForceY;
		
		return newSwingingAcceleration;
	};
});