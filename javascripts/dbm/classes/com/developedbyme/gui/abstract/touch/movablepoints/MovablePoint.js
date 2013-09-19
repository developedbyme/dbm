dbm.registerClass("com.developedbyme.gui.abstract.touch.movablepoints.MovablePoint", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.gui.abstract.touch.movablepoints.MovablePoint");
	
	var MovablePoint = dbm.importClass("com.developedbyme.gui.abstract.touch.movablepoints.MovablePoint");
	
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var TouchExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.TouchExtendedEventIds");
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	
	var AdditionNode = dbm.importClass("com.developedbyme.flow.nodes.math.AdditionNode");
	var SubtractionNode = dbm.importClass("com.developedbyme.flow.nodes.math.SubtractionNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.abstract.touch.movablepoints.MovablePoint::_init");
		
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
	
	objectFunctions.lock = function() {
		this._isLocked.setValue(true);
		
		return this;
	};
	
	objectFunctions.unlock = function() {
		this._isLocked.setValue(false);
		
		return this;
	};
	
	objectFunctions.checkForControlStart = function(aX, aY) {
		//console.log("com.developedbyme.gui.abstract.touch.movablepoints.MovablePoint::checkForControlStart");
		if(this._touch === null && !(this._isLocked.getValue())) {
			if(Math.sqrt(Math.pow(this._x.getValue()-aX, 2)+Math.pow(this._y.getValue()-aY, 2)) <= this._radius.getValue()) {
				return true;
			}
		}
		return false;
	};
	
	objectFunctions.startTouchControl = function(aTouchData) {
		//console.log("com.developedbyme.gui.abstract.touch.movablepoints.MovablePoint::startTouchControl");
		//console.log(aTouchData);
		
		this._touch = aTouchData;
		this._touch.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.END, this._touchEndCommand);
		this._touch.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.CANCEL, this._touchEndCommand);
		
		this._touchMoveXNode.getProperty("inputValue1").connectInput(this._touch.getProperty("currentX"));
		this._touchMoveXNode.getProperty("inputValue2").connectInput(this._touch.getProperty("startX"));
		this._touchMoveYNode.getProperty("inputValue1").connectInput(this._touch.getProperty("currentY"));
		this._touchMoveYNode.getProperty("inputValue2").connectInput(this._touch.getProperty("startY"));
	};
	
	objectFunctions._stopTouchControl = function(aTouchData) {
		//console.log("com.developedbyme.gui.abstract.touch.movablepoints.MovablePoint::_stopTouchControl");
		
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
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aX, aY, aRadius) {
		
		var newMovablePoint = (new MovablePoint()).init();
		
		newMovablePoint.setPropertyInputWithoutNull("originalX", aX);
		newMovablePoint.setPropertyInputWithoutNull("originalY", aY);
		newMovablePoint.setPropertyInputWithoutNull("radius", aRadius);
		
		return newMovablePoint;
	};
});