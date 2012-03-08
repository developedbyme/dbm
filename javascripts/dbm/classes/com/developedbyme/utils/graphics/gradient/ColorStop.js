dbm.registerClass("com.developedbyme.utils.graphics.gradient.ColorStop", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.graphics.gradient.ColorStop");
	
	var ColorStop = dbm.importClass("com.developedbyme.utils.graphics.gradient.ColorStop");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var RgbaColor = dbm.importClass("com.developedbyme.core.data.color.RgbaColor");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.graphics.gradient.ColorStop::_init");
		
		this.superCall();
		
		this._position = this.createProperty("position", 0);
		this._value = this.createProperty("value", RgbaColor.create());
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._position = null;
		this._value = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aPosition, aValue) {
		var newColorStop = (new ClassReference()).init();
		newColorStop.setPropertyInputWithoutNull("position", aPosition);
		newColorStop.setPropertyInputWithoutNull("value", aValue);
		return newColorStop;
	};
});