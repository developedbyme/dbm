/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.abstract.touch.draw.DrawingData", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.abstract.touch.draw.DrawingData");
	
	//Self reference
	var DrawingData = dbm.importClass("dbm.gui.abstract.touch.draw.DrawingData");
	
	//Error report
	
	//Dependencies
	var BezierCurve = dbm.importClass("dbm.core.data.curves.BezierCurve");
	
	//Utils
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	//Constants
	var TouchExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.TouchExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.gui.abstract.touch.draw.DrawingData::_init");
		
		this.superCall();
		
		this._touchData = null;
		this._isDrawing = this.createProperty("isDrawing", false);
		this._curve = this.createProperty("curve", BezierCurve.create(1, true));
		
		this._updateCommand = this.addDestroyableObject(CallFunctionCommand.createCommand(this, this._updateDrawing, []).retain());
		this._endCommand = this.addDestroyableObject(CallFunctionCommand.createCommand(this, this.stopDrawing, []).retain());
		
		return this;
	};
	
	objectFunctions.setTouchData = function(aTouchData) {
		this._touchData = aTouchData;
		
		return this;
	};
	
	objectFunctions._updateDrawing = function() {
		
		var curve = this._curve.getValueWithoutFlow();
		
		curve.createPoint(this._touchData.getProperty("currentX").getValue(), this._touchData.getProperty("currentY").getValue());
		this._curve.setAsDirty();
	};
	
	objectFunctions.startDrawing = function() {
		console.log("dbm.gui.abstract.touch.draw.DrawingData::startDrawing");
		console.log(this);
		
		this._touchData.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.MOVE, this._updateCommand);
		this._touchData.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.END, this._endCommand);
		this._touchData.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.CANCEL, this._endCommand);
		
		this._updateDrawing();
		
		this._isDrawing.setValue(true);
		
		return this;
	};
	
	objectFunctions.stopDrawing = function() {
		
		this._touchData.getExtendedEvent().removeCommandFromEvent(TouchExtendedEventIds.MOVE, this._updateCommand);
		this._touchData.getExtendedEvent().removeCommandFromEvent(TouchExtendedEventIds.END, this._endCommand);
		this._touchData.getExtendedEvent().removeCommandFromEvent(TouchExtendedEventIds.CANCEL, this._endCommand);
		
		this._isDrawing.setValue(false);
		
		return this;
	};
	
	objectFunctions.performDestroy = function() {
		if(this._isDrawing.getValue()) {
			this.stopDrawing();
		}
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._touchData = null;
		this._isDrawing = null;
		this._curve = null;
		
		this._updateCommand = null;
		this._endCommand = null;
		
		this.superCall();
	};
	
	staticFunctions.createAndStart = function(aTouchData) {
		
		var newDrawingData = (new DrawingData()).init();
		newDrawingData.setTouchData(aTouchData);
		newDrawingData.startDrawing();
		
		return newDrawingData;
	};
});