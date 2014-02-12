dbm.registerClass("com.developedbyme.gui.abstract.switchablearea.SwitchableAreaHolder", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var SwitchableAreaHolder = dbm.importClass("com.developedbyme.gui.abstract.switchablearea.SwitchableAreaHolder");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.abstract.switchablearea.SwitchableAreaHolder::_init");
		
		this.superCall();
		
		this._swichableArea = null;
		this._visibleArea = this.createProperty("visibleArea", null);
		
		return this;
	};
	
	objectFunctions.setSwitchableArea = function(aSwitchableArea) {
		this._swichableArea = aSwitchableArea;
		this._swichableArea.setPropertyInput("visibleArea", this._visibleArea);
		
		return this;
	};
	
	objectFunctions.getSwitchableArea = function() {
		return this._swichableArea;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._swichableArea = null;
		this._visibleArea = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		return ClassReference._createAndInitClassWithElement(ClassReference, aElement);
	};
});