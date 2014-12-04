/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.math.trigonometry.InverseKinematicsNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.math.trigonometry.InverseKinematicsNode");
	
	var InverseKinematicsNode = dbm.importClass("dbm.flow.nodes.math.trigonometry.InverseKinematicsNode");
	
	var QuadricEquationSolver = dbm.importClass("dbm.utils.math.QuadricEquationSolver");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.math.trigonometry.InverseKinematicsNode::_init");
		
		this.superCall();
		
		this._equationSolver = QuadricEquationSolver.create();
		
		this._armLength1 = this.createProperty("armLength1", 0);
		this._armLength2 = this.createProperty("armLength2", 0);
		this._targetLength = this.createProperty("targetLength", 0);
		
		this._outputHeight = this.createProperty("outputHeight", 0);
		this._outputWidth1 = this.createProperty("outputWidth1", 0);
		this._outputWidth2 = this.createProperty("outputWidth2", 0);
		this._outputAngle1 = this.createProperty("outputAngle1", 0);
		this._outputAngle2 = this.createProperty("outputAngle2", 0);
		
		this._heightMultiplier = this.createProperty("heightMultiplier", 1);
		
		this.createUpdateFunction("default", this._update, [this._armLength1, this._armLength2, this._targetLength, this._heightMultiplier], [this._outputHeight, this._outputWidth1, this._outputWidth2, this._outputAngle1, this._outputAngle2]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.math.trigonometry.InverseKinematicsNode::_update");
		var armLength1 = this._armLength1.getValueWithoutFlow();
		var armLength2 = this._armLength2.getValueWithoutFlow();
		var targetLength = this._targetLength.getValueWithoutFlow();
		
		if(targetLength >= armLength1+armLength2) {
			this._outputHeight.setValueWithFlow(0, aFlowUpdateNumber);
			this._outputAngle1.setValueWithFlow(0, aFlowUpdateNumber);
			this._outputAngle2.setValueWithFlow(0, aFlowUpdateNumber);
			
			this._outputWidth1.setValueWithFlow(armLength1, aFlowUpdateNumber);
			this._outputWidth2.setValueWithFlow(armLength2, aFlowUpdateNumber);
		}
		else if(targetLength <= armLength1-armLength2) {
			this._outputHeight.setValueWithFlow(0, aFlowUpdateNumber);
			this._outputAngle1.setValueWithFlow(0, aFlowUpdateNumber);
			this._outputAngle2.setValueWithFlow(Math.PI, aFlowUpdateNumber);
			
			this._outputWidth1.setValueWithFlow(armLength1, aFlowUpdateNumber);
			this._outputWidth2.setValueWithFlow(armLength2, aFlowUpdateNumber);
		}
		else {
			var heightMultipler = this._heightMultiplier.getValueWithoutFlow();
			
			this._equationSolver.solveEquation(0, 2*targetLength, Math.pow(armLength2, 2)-Math.pow(armLength1, 2)-Math.pow(targetLength, 2));
			var width1 = this._equationSolver.solution1;
			var width2 = targetLength-width1;
			var height = heightMultipler*Math.sqrt(Math.pow(armLength1, 2)-Math.pow(width1, 2));
			
			this._outputWidth1.setValueWithFlow(width1, aFlowUpdateNumber);
			this._outputWidth2.setValueWithFlow(width2, aFlowUpdateNumber);
			this._outputHeight.setValueWithFlow(height, aFlowUpdateNumber);
			
			var angle1 = Math.atan2(height, width1);
			var angle2 = -1*(Math.PI-(0.5*Math.PI-angle1)-Math.atan2(width2, height));
			this._outputAngle1.setValueWithFlow(angle1, aFlowUpdateNumber);
			this._outputAngle2.setValueWithFlow(angle2, aFlowUpdateNumber);
			
			//console.log(width1, width2, height, angle1, angle2);
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._armLength1 = null;
		this._armLength2 = null;
		this._targetLength = null;
		
		this._outputHeight = null;
		this._outputWidth1 = null;
		this._outputWidth2 = null;
		this._outputAngle1 = null;
		this._outputAngle2 = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aArmLength1, aArmLength2, aTargetLength) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("armLength1", aArmLength1);
		newNode.setPropertyInputWithoutNull("armLength2", aArmLength2);
		newNode.setPropertyInputWithoutNull("targetLength", aTargetLength);
		return newNode;
	};
});