/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Data for a point that is movable with touch interactions.
 */
dbm.registerClass("dbm.gui.abstract.touch.movablepoints.MovablePoint", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.abstract.touch.movablepoints.MovablePoint");
	
	//Self reference
	var MovablePoint = dbm.importClass("dbm.gui.abstract.touch.movablepoints.MovablePoint");
	
	//Error report
	
	//Dependnecies
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	var AdditionNode = dbm.importClass("dbm.flow.nodes.math.AdditionNode");
	var SubtractionNode = dbm.importClass("dbm.flow.nodes.math.SubtractionNode");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var TouchExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.TouchExtendedEventIds");
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.gui.abstract.touch.movablepoints.MovablePoint::_init");
		
		this.superCall();
		
		this._orignalX = this.createProperty("originalX", 0);
		this._orignalY = this.createProperty("originalY", 0);
		this._touchMoveXNode = SubtractionNode.create(0, 0);
		this._touchMoveYNode = SubtractionNode.create(0, 0);
		this._movedX = this.createProperty("movedX", this._touchMoveXNode.getProperty("outputValue"));
		this._movedY = this.createProperty("movedY", this._touchMoveYNode.getProperty("outputValue"));
		this._addXNode = AdditionNode.create(this._orignalX, this._movedX);
		this._addYNode = AdditionNode.create(this._orignalY, this._movedY);
		this._x = this.createProperty("x", this._addXNode.getProperty("outputValue"));
		this._y = this.createProperty("y", this._addYNode.getProperty("outputValue"));
		this._isLocked = this.createProperty("isLocked", false);
		
		this._radius = this.createProperty("radius", 50);
		this._touch = null;
		this._touchEndCommand = CallFunctionCommand.createCommand(this, this._stopTouchControl, []);
		
		return this;
	};
	
	/**
	 * Locks the current position of this points, and disables user interactions.
	 */
	objectFunctions.lock = function() {
		this._isLocked.setValue(true);
		
		return this;
	};
	
	/**
	 * Unlocks the current position of this point.
	 */
	objectFunctions.unlock = function() {
		this._isLocked.setValue(false);
		
		return this;
	};
	
	/**
	 * Checks if the point should start moving for interaction at a certain coordinate.
	 *
	 * @param	aX	Number	The x position.
	 * @param	aY	Number	The y position.
	 *
	 * @return	Boolean		True if the point should start interacting.
	 */
	objectFunctions.checkForControlStart = function(aX, aY) {
		//console.log("dbm.gui.abstract.touch.movablepoints.MovablePoint::checkForControlStart");
		if(this._touch === null && !(this._isLocked.getValue())) {
			if(Math.sqrt(Math.pow(this._x.getValue()-aX, 2)+Math.pow(this._y.getValue()-aY, 2)) <= this._radius.getValue()) {
				return true;
			}
		}
		return false;
	};
	
	/**
	 * Starts the interaction of this point.
	 *
	 * @param	aTouchData	The touch data that is controling this point.
	 */
	objectFunctions.startTouchControl = function(aTouchData) {
		//console.log("dbm.gui.abstract.touch.movablepoints.MovablePoint::startTouchControl");
		//console.log(aTouchData);
		
		this._touch = aTouchData;
		this._touch.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.END, this._touchEndCommand);
		this._touch.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.CANCEL, this._touchEndCommand);
		
		this._touchMoveXNode.getProperty("inputValue1").connectInput(this._touch.getProperty("currentX"));
		this._touchMoveXNode.getProperty("inputValue2").connectInput(this._touch.getProperty("startX"));
		this._touchMoveYNode.getProperty("inputValue1").connectInput(this._touch.getProperty("currentY"));
		this._touchMoveYNode.getProperty("inputValue2").connectInput(this._touch.getProperty("startY"));
	};
	
	/**
	 * Stops the interaction of this point.
	 *
	 * @param	aTouchData	The touch data that is controling this point.
	 */
	objectFunctions._stopTouchControl = function(aTouchData) {
		//console.log("dbm.gui.abstract.touch.movablepoints.MovablePoint::_stopTouchControl");
		
		this._orignalX.setValue(this._x.getValue());
		this._orignalY.setValue(this._y.getValue());
		this._touchMoveXNode.getProperty("inputValue1").disconnectInput().setValue(0);
		this._touchMoveXNode.getProperty("inputValue2").disconnectInput().setValue(0);
		this._touchMoveYNode.getProperty("inputValue1").disconnectInput().setValue(0);
		this._touchMoveYNode.getProperty("inputValue2").disconnectInput().setValue(0);
		
		//METODO: chrashes when removing the listeners in this function
		//this._touch.getExtendedEvent().removeCommandFromEvent(TouchExtendedEventIds.END, this._touchEndCommand);
		//this._touch.getExtendedEvent().removeCommandFromEvent(TouchExtendedEventIds.CANCEL, this._touchEndCommand);
		this._touch = null;
	};
	
	/**
	 * Sets all reference to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @praam	aX			Number	The x position of this point.
	 * @param	aY			Number	The y position of this point.
	 * @param	aRadius		Number	The radius of this point.
	 *
	 * @return	ClassDefinition	The newly created instance.
	 */
	staticFunctions.create = function(aX, aY, aRadius) {
		
		var newMovablePoint = (new MovablePoint()).init();
		
		newMovablePoint.setPropertyInputWithoutNull("originalX", aX);
		newMovablePoint.setPropertyInputWithoutNull("originalY", aY);
		newMovablePoint.setPropertyInputWithoutNull("radius", aRadius);
		
		return newMovablePoint;
	};
});