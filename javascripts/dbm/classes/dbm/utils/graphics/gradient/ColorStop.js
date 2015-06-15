/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.graphics.gradient.ColorStop", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.graphics.gradient.ColorStop");
	
	//Self reference
	var ColorStop = dbm.importClass("dbm.utils.graphics.gradient.ColorStop");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var RgbaColor = dbm.importClass("dbm.core.data.color.RgbaColor");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.graphics.gradient.ColorStop::_init");
		
		this.superCall();
		
		this._position = this.createProperty("position", 0);
		this._value = this.createProperty("value", RgbaColor.create());
		
		return this;
	};
	
	/**
	 * Set all the reference to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._position = null;
		this._value = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new object of this class.
	 *
	 * @param	aPosition	Number	Parameter fow the position of the stop.
	 * @param	aValue		Color	The color for this stop.
	 *
	 * @return	ColorStop	The newly created object.
	 */
	staticFunctions.create = function(aPosition, aValue) {
		var newColorStop = (new ClassReference()).init();
		newColorStop.setPropertyInputWithoutNull("position", aPosition);
		newColorStop.setPropertyInputWithoutNull("value", aValue);
		return newColorStop;
	};
});