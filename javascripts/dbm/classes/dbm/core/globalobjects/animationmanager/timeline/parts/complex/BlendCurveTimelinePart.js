/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.animationmanager.timeline.parts.complex.BlendCurveTimelinePart", "dbm.core.globalobjects.animationmanager.timeline.parts.TimelinePartBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.animationmanager.timeline.parts.complex.BlendCurveTimelinePart");
	
	var BlendCurveTimelinePart = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.parts.complex.BlendCurveTimelinePart");
	
	var MatrixTransformation = dbm.importClass("dbm.utils.math.MatrixTransformation");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.animationmanager.timeline.parts.complex.BlendCurveTimelinePart::_init");
		
		this.superCall();
		
		this.setValues(null, null);
		this._blendCurve = null;
				
		return this;
	};
	
	objectFunctions.setValues = function(aStartValue, aEndValue) {
		//console.log("dbm.core.globalobjects.animationmanager.timeline.parts.complex.BlendCurveTimelinePart::setValues");
		this.startValue = aStartValue;
		this.endValue = aEndValue;
		
		return this;
	};
	
	objectFunctions.getValueByParameter = function(aParameter) {
		//console.log("dbm.core.globalobjects.animationmanager.timeline.parts.complex.BlendCurveTimelinePart::getValueByParameter");
		
		if(this._blendCurve === null) {
			this._blendCurve = this.startValue.duplicate();
		}
		MatrixTransformation.blend2dPointSets(aParameter, this.startValue, this.endValue, this._blendCurve);
		
		return this._blendCurve;
	};
	
	objectFunctions.getTangentByParameter = function(aParameter) {
		//METODO: error message
		return null;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._blendCurve = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aStartValue, aEndValue, aStartTime, aLength) {
		//console.log("dbm.core.globalobjects.animationmanager.timeline.parts.complex.BlendCurveTimelinePart::create");
		
		var newPart = (new ClassReference()).init();
		
		newPart.setValues(aStartValue, aEndValue).setTimes(aStartTime, aStartTime+aLength);
		
		return newPart;
	};
});