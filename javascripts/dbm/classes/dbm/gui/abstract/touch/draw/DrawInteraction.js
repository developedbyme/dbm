/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.abstract.touch.draw.DrawInteraction", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.abstract.touch.draw.DrawInteraction");
	
	//Self reference
	var DrawInteraction = dbm.importClass("dbm.gui.abstract.touch.draw.DrawInteraction");
	
	//Error report
	
	//Dependencies
	var DrawingData = dbm.importClass("dbm.gui.abstract.touch.draw.DrawingData");
	var ArrayHolder = dbm.importClass("dbm.utils.data.ArrayHolder");
	
	//Utils
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	//Constants
	var TouchExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.TouchExtendedEventIds");
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.gui.abstract.touch.draw.DrawInteraction::_init");
		
		this.superCall();
		
		this._drawings = this.addDestroyableObject(ArrayHolder.create(true));
		
		this.getExtendedEvent().createEvent(GenericExtendedEventIds.NEW);
		
		return this;
	};
	
	objectFunctions._createNewDrawing = function(aTouchData) {
		var newDrawing = DrawingData.createAndStart(aTouchData);
		
		this._drawings.array.push(newDrawing);
		
		this.getExtendedEvent().perform(GenericExtendedEventIds.NEW, newDrawing);
		
		return newDrawing;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._drawings = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aTouchDetector) {
		
		var newDrawInteraction = (new DrawInteraction()).init();
		
		ClassReference.connectToTouchDetector(newDrawInteraction, aTouchDetector);
		
		return newDrawInteraction;
	};
	
	staticFunctions.connectToTouchDetector = function(aDrawInteraction, aTouchDetector) {
		
		aTouchDetector.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, CallFunctionCommand.createCommand(aDrawInteraction, aDrawInteraction._createNewDrawing, [GetVariableObject.createSelectDataCommand()]));
		
		return aDrawInteraction;
	};
});