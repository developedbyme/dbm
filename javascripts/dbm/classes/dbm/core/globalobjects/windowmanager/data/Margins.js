/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.windowmanager.data.Margins", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.windowmanager.data.Margins");
	
	var Margins = dbm.importClass("dbm.core.globalobjects.windowmanager.data.Margins");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.windowmanager.data.Margins::_init");
		
		this.superCall();
		
		this.horizontalMargin = null;
		this.verticalMargin = null;
		
		this._hasSpecificMargins = false;
		this.marginLeft = null;
		this.marginTop = null;
		this.marginRight = null;
		this.marginBottom = null;
		
		return this;
	};
	
	objectFunctions.setMargins = function(aHorizontal, aVertical) {
		//console.log("dbm.core.globalobjects.windowmanager.data.Margins::setMargins");
		
		this.horizontalMargin = aHorizontal;
		this.verticalMargin = aVertical;
		
		return this;
	};
	
	objectFunctions.setSpecifiedMargins = function(aLeft, aTop, aRight, aBottom) {
		//console.log("dbm.core.globalobjects.windowmanager.data.Margins::setSpecifiedMargins");
		
		this._hasSpecificMargins = true;
		this.marginLeft = aLeft;
		this.marginTop = aTop;
		this.marginRight = aRight;
		this.marginBottom = aBottom;
		
		return this;
	};
	
	objectFunctions.hasSpecifiedMargins = function() {
		//console.log("dbm.core.globalobjects.windowmanager.data.Margins::hasSpecifiedMargins");
		
		return this._hasSpecificMargins;
	};
	
	staticFunctions.create = function(aHorizontal, aVertical, aLeft, aTop, aRight, aBottom) {
		var newMargins = (new Margins()).init();
		
		newMargins.setMargins(aHorizontal, aVertical);
		
		if(VariableAliases.isSet(aLeft)) {
			newMargins.setSpecifiedMargins(aLeft, aTop, aRight, aBottom);
		}
		
		return newMargins;
	};
});