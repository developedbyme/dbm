/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.graphics.gradient.Gradient", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.graphics.gradient.Gradient");
	
	var Gradient = dbm.importClass("com.developedbyme.utils.graphics.gradient.Gradient");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	var ColorStop = dbm.importClass("com.developedbyme.utils.graphics.gradient.ColorStop");
	var ArrayHolder = dbm.importClass("com.developedbyme.utils.data.ArrayHolder");
	
	var ColorFunctions = dbm.importClass("com.developedbyme.utils.graphics.color.ColorFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.graphics.gradient.Gradient::_init");
		
		this.superCall();
		
		this._colorStopChange = this.addProperty("colorStopChange", AnyChangeMultipleInputProperty.create(this._objectProperty));
		this._colorStops = ArrayHolder.create(true);
		this.addDestroyableObject(this._colorStops);
		
		this._order = this.createGhostProperty("order");
		this._order.setAsDirty();
		this.createUpdateFunction("default", this._updateOrderFlow, [this._colorStopChange], [this._order]);
		
		return this;
	};
	
	objectFunctions.createColorStopFromCssString = function(aPosition, aCssString) {
		var newColor = ColorFunctions.createColorFromCssString(aCssString);
		var newColorStop = ColorStop.create(aPosition, newColor);
		
		this.addColorStop(newColorStop);
		
		return newColorStop;
	};
	
	objectFunctions.getColorStops = function() {
		return this._colorStops.array;
	};
	
	objectFunctions.addColorStop = function(aColorStop) {
		
		this._colorStops.array.push(aColorStop);
		this._colorStopChange.connectInput(aColorStop._objectProperty); //MENOTE: change this to getObjectProperty when available
		aColorStop._objectProperty.setAsDirty(); //MENOTE: change this to getObjectProperty when available
		
	};
	
	objectFunctions.sortColorStops = function() {
		this._colorStops.array.sort(this._sortColorStopsOrderFunction);
	};
	
	objectFunctions._sortColorStopsOrderFunction = function(aColorStop1, aColorStop2) {
		return aColorStop1.getProperty("position").getValue()-aColorStop2.getProperty("position").getValue();
	};
	
	objectFunctions._updateOrderFlow = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.utils.graphics.gradient.Gradient::_updateOrderFlow");
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