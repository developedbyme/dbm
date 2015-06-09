/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.graphics.gradient.Gradient", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.graphics.gradient.Gradient");
	
	//Self reference
	var Gradient = dbm.importClass("dbm.utils.graphics.gradient.Gradient");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependnecies
	var AnyChangeMultipleInputProperty = dbm.importClass("dbm.core.objectparts.AnyChangeMultipleInputProperty");
	var ColorStop = dbm.importClass("dbm.utils.graphics.gradient.ColorStop");
	var ArrayHolder = dbm.importClass("dbm.utils.data.ArrayHolder");
	
	//Utils
	var ColorFunctions = dbm.importClass("dbm.utils.graphics.color.ColorFunctions");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.graphics.gradient.Gradient::_init");
		
		this.superCall();
		
		this._colorStopChange = this.addProperty("colorStopChange", AnyChangeMultipleInputProperty.create());
		this._colorStops = ArrayHolder.create(true);
		this.addDestroyableObject(this._colorStops);
		
		this._order = this.createGhostProperty("order");
		this._order.setAsDirty();
		this.createUpdateFunction("default", this._updateOrderFlow, [this._colorStopChange], [this._order]);
		
		return this;
	};
	
	/**
	 * Creates a colo stop for a css string.
	 *
	 * @param	aPosition	Number PArameter for the position of the stop.
	 * @param	aCssString	String	The css data for the stop.
	 *
	 * @return	ColorStop	The newly created color stop.
	 */
	objectFunctions.createColorStopFromCssString = function(aPosition, aCssString) {
		var newColor = ColorFunctions.createColorFromCssString(aCssString);
		return this.createColorStop(aPosition, newColor);
	};
	
	/**
	 * Gets all the color stops for this gradient.
	 *
	 * @return	Array of ColorStops	The array of color stops.
	 */
	objectFunctions.getColorStops = function() {
		return this._colorStops.array;
	};
	
	objectFunctions.createColorStop = function(aPosition, aColor) {
		var newColorStop = ColorStop.create(aPosition, aColor);
		
		this.addColorStop(newColorStop);
		
		return newColorStop;
	};
	
	objectFunctions.addColorStop = function(aColorStop) {
		
		this._colorStops.array.push(aColorStop);
		this._colorStopChange.connectInput(aColorStop.getProperty("position"));
		this._colorStopChange.connectInput(aColorStop.getProperty("value"));
		
	};
	
	objectFunctions.sortColorStops = function() {
		this._colorStops.array.sort(this._sortColorStopsOrderFunction);
	};
	
	objectFunctions._sortColorStopsOrderFunction = function(aColorStop1, aColorStop2) {
		return aColorStop1.getProperty("position").getValue()-aColorStop2.getProperty("position").getValue();
	};
	
	objectFunctions._updateOrderFlow = function(aFlowUpdateNumber) {
		//console.log("dbm.utils.graphics.gradient.Gradient::_updateOrderFlow");
		this.sortColorStops();
	};
	
	objectFunctions.getCssString = function(aFunctionName, aDirection) {
		this._order.update();
		
		aFunctionName = VariableAliases.valueWithDefault(aFunctionName, "linear-gradient");
		aDirection = VariableAliases.valueWithDefault(aDirection, "left");
		
		var returnString = aFunctionName + "(" + aDirection;
		
		var currentArray = this._colorStops.array;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentColorStop = currentArray[i];
			var color = currentColorStop.getProperty("value").getValueWithoutFlow();
			var position = currentColorStop.getProperty("position").getValueWithoutFlow();
			returnString += ",";
			
			returnString += color.getCssString() + " " + (100*position)+"%";
		}
		
		returnString += ")";
		
		return returnString;
	};
	
	objectFunctions.addColorStopsToCanvasGradient = function(aCanvasGradient) {
		this._order.update();
		
		var currentArray = this._colorStops.array;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentColorStop = currentArray[i];
			var color = currentColorStop.getProperty("value").getValueWithoutFlow();
			var position = currentColorStop.getProperty("position").getValueWithoutFlow();
			
			aCanvasGradient.addColorStop(position, color.getCssString());
		}
		
		return aCanvasGradient;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._colorStopChange = null;
		this._colorStops = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newReaction = (new ClassReference()).init();
		return newReaction;
	};
});