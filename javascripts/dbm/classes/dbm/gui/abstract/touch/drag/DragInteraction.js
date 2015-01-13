/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.abstract.touch.drag.DragInteraction", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.abstract.touch.drag.DragInteraction");
	
	//Self reference
	var DragInteraction = dbm.importClass("dbm.gui.abstract.touch.drag.DragInteraction");
	
	//Error report
	
	//Dependencies
	var SubtractionNode = dbm.importClass("dbm.flow.nodes.math.SubtractionNode");
	var RepeatedRangeNode = dbm.importClass("dbm.flow.nodes.math.range.RepeatedRangeNode");
	var OvershootRangeNode = dbm.importClass("dbm.flow.nodes.math.range.OvershootRangeNode");
	var AdditionNode = dbm.importClass("dbm.flow.nodes.math.AdditionNode");
	var MultiplicationNode = dbm.importClass("dbm.flow.nodes.math.MultiplicationNode");
	
	//Utils
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var PerformExtendedEventCommand = dbm.importClass("dbm.core.extendedevent.commands.events.PerformExtendedEventCommand");
	var SetPropertyCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.SetPropertyCommand");
	var GetPropertyValueObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetPropertyValueObject");
	
	//Constants
	var TouchExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.TouchExtendedEventIds");
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	var TouchExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.TouchExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.gui.abstract.touch.drag.DragInteraction::_init");
		
		this.superCall();
		
		this._touchData = null;
		
		this._isDragging = this.createProperty("isDragging", false);
		this._startInputValue = this.createProperty("startInputValue", 0);
		this._startValue = this.createProperty("startValue", 0);
		
		this._moveXNode = this.addDestroyableObject(SubtractionNode.create(0, 0));
		this._moveYNode = this.addDestroyableObject(SubtractionNode.create(0, 0));
		
		this._moveX = this.createProperty("moveX", this._moveXNode.getProperty("outputValue"));
		this._moveY = this.createProperty("moveY", this._moveYNode.getProperty("outputValue"));
		
		this._outputValue = this.createProperty("outputValue", 0);
		
		this.getExtendedEvent().createEvent(GenericExtendedEventIds.NEW);
		this.getExtendedEvent().createEvent(GenericExtendedEventIds.UPDATE);
		this.getExtendedEvent().createEvent(GenericExtendedEventIds.END);
		
		this._updateCommand = this.addDestroyableObject(PerformExtendedEventCommand.createCommand(this, GenericExtendedEventIds.UPDATE, GetVariableObject.createSelectDataCommand()).retain());
		this._endCommand = this.addDestroyableObject(PerformExtendedEventCommand.createCommand(this, GenericExtendedEventIds.END, GetVariableObject.createSelectDataCommand()).retain());
		
		return this;
	};
	
	objectFunctions.startTouch = function(aTouchData) {
		//console.log("dbm.gui.abstract.touch.drag.DragInteraction::startTouch");
		//console.log(this);
		
		if(this._touchData !== null) {
			//METODO: error message
			this.endTouch();
		}
		
		this._touchData = aTouchData;
		
		this._startValue.setValue(this._startInputValue.getValue());
		
		this._moveXNode.getProperty("inputValue1").connectInput(aTouchData.getProperty("currentX"));
		this._moveXNode.getProperty("inputValue2").connectInput(aTouchData.getProperty("startX"));
		this._moveYNode.getProperty("inputValue1").connectInput(aTouchData.getProperty("currentY"));
		this._moveYNode.getProperty("inputValue2").connectInput(aTouchData.getProperty("startY"));
		
		this._touchData.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.MOVE, this._updateCommand);
		this._touchData.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.END, this._endCommand);
		this._touchData.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.CANCEL, this._endCommand);
		
		this._isDragging.setValue(true);
	};
	
	objectFunctions.endTouch = function() {
		if(this._touchData === null) {
			//METODO: error message
			return;
		}
		
		this._outputValue.update();
		
		this._moveXNode.getProperty("inputValue1").disconnectInput(this._touchData.getProperty("currentX"));
		this._moveXNode.getProperty("inputValue2").disconnectInput(this._touchData.getProperty("startX"));
		this._moveYNode.getProperty("inputValue1").disconnectInput(this._touchData.getProperty("currentY"));
		this._moveYNode.getProperty("inputValue2").disconnectInput(this._touchData.getProperty("startY"));
		
		this._touchData.getExtendedEvent().removeCommandFromEvent(TouchExtendedEventIds.MOVE, this._updateCommand);
		this._touchData.getExtendedEvent().removeCommandFromEvent(TouchExtendedEventIds.END, this._endCommand);
		this._touchData.getExtendedEvent().removeCommandFromEvent(TouchExtendedEventIds.CANCEL, this._endCommand);
		
		this._touchData = null;
		this._isDragging.setValue(false);
	};
	
	objectFunctions.performDestroyObject = function() {
		
		if(this._touchData !== null) {
			this.endTouch();
		}
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._touchData = null;
		
		this._isDragging = null;
		this._startInputValue = null;
		this._startValue = null;
		
		this._moveXNode = null;
		this._moveYNode = null;
		
		this._moveX = null;
		this._moveY = null;
		
		this._outputValue = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aTouchDetector) {
		
		var newDragInteraction = (new DragInteraction()).init();
		
		ClassReference.connectToTouchDetector(newDragInteraction, aTouchDetector);
		
		return newDragInteraction;
	};
	
	staticFunctions.connectToTouchDetector = function(aDragInteraction, aTouchDetector) {
		
		aTouchDetector.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, CallFunctionCommand.createCommand(aDragInteraction, aDragInteraction.startTouch, [GetVariableObject.createSelectDataCommand()]));
		
		return aDragInteraction;
	};
	
	staticFunctions.setupHorizontal = function(aDragInteraction, aSpeed, aOutputProperty) {
		var speedProperty = aDragInteraction.createProperty("speed", aSpeed);
		
		var speedNode = aDragInteraction.addDestroyableObject(MultiplicationNode.create(aDragInteraction.getProperty("moveX"), speedProperty));
		var positionNode = aDragInteraction.addDestroyableObject(AdditionNode.create(speedNode.getProperty("outputValue"), aDragInteraction.getProperty("startValue")));
		
		aDragInteraction.getProperty("outputValue").connectInput(positionNode.getProperty("outputValue"));
		
		aDragInteraction.getProperty("startInputValue").connectInput(aOutputProperty);
		aDragInteraction.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.UPDATE, SetPropertyCommand.createCommand(aOutputProperty, GetPropertyValueObject.createCommand(aDragInteraction, "outputValue")));
		
		return aDragInteraction;
	};
	
	staticFunctions.setupHorizontalScaleOvershoot = function(aDragInteraction, aSpeed, aOutputProperty, aMinValue, aMaxValue, aOvershootScale) {
		var speedProperty = aDragInteraction.createProperty("speed", aSpeed);
		
		var speedNode = aDragInteraction.addDestroyableObject(MultiplicationNode.create(aDragInteraction.getProperty("moveX"), speedProperty));
		var positionNode = aDragInteraction.addDestroyableObject(AdditionNode.create(speedNode.getProperty("outputValue"), aDragInteraction.getProperty("startValue")));
		var rangeNode = aDragInteraction.addDestroyableObject(OvershootRangeNode.createScaledOvershoot(positionNode.getProperty("outputValue"), aMinValue, aMaxValue, aOvershootScale));
		
		aDragInteraction.getProperty("outputValue").connectInput(rangeNode.getProperty("outputValue"));
		
		aDragInteraction.getProperty("startInputValue").connectInput(aOutputProperty);
		aDragInteraction.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.UPDATE, SetPropertyCommand.createCommand(aOutputProperty, GetPropertyValueObject.createCommand(aDragInteraction, "outputValue")));
		
		return aDragInteraction;
	};
	
	staticFunctions.setupHorizontalRepeatedRange = function(aDragInteraction, aSpeed, aOutputProperty, aMinValue, aMaxValue) {
		var speedProperty = aDragInteraction.createProperty("speed", aSpeed);
		
		var speedNode = aDragInteraction.addDestroyableObject(MultiplicationNode.create(aDragInteraction.getProperty("moveX"), speedProperty));
		var positionNode = aDragInteraction.addDestroyableObject(AdditionNode.create(speedNode.getProperty("outputValue"), aDragInteraction.getProperty("startValue")));
		var rangeNode = aDragInteraction.addDestroyableObject(RepeatedRangeNode.create(positionNode.getProperty("outputValue"), aMinValue, aMaxValue));
		
		aDragInteraction.getProperty("outputValue").connectInput(rangeNode.getProperty("outputValue"));
		
		aDragInteraction.getProperty("startInputValue").connectInput(aOutputProperty);
		aDragInteraction.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.UPDATE, SetPropertyCommand.createCommand(aOutputProperty, GetPropertyValueObject.createCommand(aDragInteraction, "outputValue")));
		
		return aDragInteraction;
	};
});