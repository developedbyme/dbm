/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.abstract.touch.movablepoints.MovablePointsController", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.abstract.touch.movablepoints.MovablePointsController");
	
	var MovablePointsController = dbm.importClass("dbm.gui.abstract.touch.movablepoints.MovablePointsController");
	
	var MovablePoint = dbm.importClass("dbm.gui.abstract.touch.movablepoints.MovablePoint");
	
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var TouchExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.TouchExtendedEventIds");
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("dbm.gui.abstract.touch.movablepoints.MovablePointsController::_init");
		
		this.superCall();
		
		this._touchDetector = null;
		this._movablePoints = NamedArray.create(true);
		this.addDestroyableObject(this._movablePoints);
		
		return this;
	};
	
	objectFunctions.createPoint = function(aName, aX, aY, aRadius) {
		var newPoint = MovablePoint.create(aX, aY, aRadius);
		this._movablePoints.addObject(aName, newPoint);
		
		return newPoint;
	};
	
	objectFunctions.setTouchDetector = function(aTouchDetector) {
		this._touchDetector = aTouchDetector;
		
		this._touchDetector.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, CallFunctionCommand.createCommand(this, this._newTouch, [GetVariableObject.createSelectDataCommand()]));
		
		return this;
	};
	
	objectFunctions._newTouch = function(aTouchData) {
		console.log("dbm.gui.abstract.touch.movablepoints.MovablePointsController::_newTouch");
		var x = aTouchData.getProperty("startX").getValue();
		var y = aTouchData.getProperty("startY").getValue();
		
		var currentArray = this._movablePoints.getObjectsArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			if(currentObject.checkForControlStart(x, y)) {
				currentObject.startTouchControl(aTouchData);
				break;
			}
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aTouchDetector) {
		
		var newMovablePointsController = (new MovablePointsController()).init();
		
		newMovablePointsController.setTouchDetector(aTouchDetector);
		
		return newMovablePointsController;
	};
});