dbm.registerClass("com.developedbyme.core.globalobjects.windowmanager.data.Margins", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.windowmanager.data.Margins");
	
	var Margins = dbm.importClass("com.developedbyme.core.globalobjects.windowmanager.data.Margins");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	/**
	 * Constructor
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.data.Margins::init");
		
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
		//console.log("com.developedbyme.core.globalobjects.windowmanager.data.Margins::setMargins");
		
		this.horizontalMargin = aHorizontal;
		this.verticalMargin = aVertical;
		
		return this;
	};
	
	objectFunctions.setSpecifiedMargins = function(aLeft, aTop, aRight, aBottom) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.data.Margins::setSpecifiedMargins");
		
		this._hasSpecificMargins = true;
		this.marginLeft = aLeft;
		this.marginTop = aTop;
		this.marginRight = aRight;
		this.marginBottom = aBottom;
		
		return this;
	};
	
	objectFunctions.hasSpecifiedMargins = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.data.Margins::hasSpecifiedMargins");
		
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