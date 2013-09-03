dbm.registerClass("com.developedbyme.gui.abstract.switchablearea.SwitchableAreaBaseObject", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	var SwitchableAreaBaseObject = dbm.importClass("com.developedbyme.gui.abstract.switchablearea.SwitchableAreaBaseObject");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var PartiallyOwnedNamedArray = dbm.importClass("com.developedbyme.utils.data.PartiallyOwnedNamedArray");
	var DisplayBaseObject = dbm.importClass("com.developedbyme.gui.DisplayBaseObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.abstract.switchablearea.SwitchableAreaBaseObject::_init");
		
		this.superCall();
		
		this._visibleArea = this.createProperty("visibleArea", null);
		this._areas = NamedArray.create(true);
		this.addDestroyableObject(this._areas);
		
		this._display = this.addProperty("display", AnyChangeMultipleInputProperty.create(this._objectProperty));
		
		return this;
	};
	
	objectFunctions._setupAreaFlow = function(aName, aDisplayObject, aAreaData) {
		//MENOTE: should be overridden
		//METODO: error message
	};
	
	objectFunctions.addArea = function(aName, aDisplayObject, aOwnsObject) {
		//console.log("com.developedbyme.gui.abstract.switchablearea.SwitchableAreaBaseObject::addArea");
		//console.log(aName, aDisplayObject, aOwnsObject);
		
		var areaData = PartiallyOwnedNamedArray.create(true);
		areaData.addOwnedOverride("displayObject", VariableAliases.isTrue(aOwnsObject));
		areaData.addObject("displayObject", aDisplayObject);
		
		this._setupAreaFlow(aName, aDisplayObject, areaData);
		this._display.connectInput(aDisplayObject.getProperty("display"));
		
		this._areas.addObject(aName, areaData);
		
		return this;
	};
	
	objectFunctions.addHtmlArea = function(aName, aElement) {
		//console.log("com.developedbyme.gui.abstract.switchablearea.SwitchableAreaBaseObject::addHtmlArea");
		//console.log(aName, aElement);
		
		var controller = dbm.singletons.dbmHtmlDomManager.getControllerForHtmlElementIfExists(aElement);
		
		if(controller === null) {
			
			controller = DisplayBaseObject.create(aElement);
			this.addDestroyableObject(controller);
		}
		
		this.addArea(aName, controller);
		
		return this;
	};
	
	objectFunctions.removeAreaByName = function(aName) {
		
		return this;
	};
	
	objectFunctions.showArea = function(aName) {
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._visibleArea = null;
		this._areas = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return (new SwitchableAreaBaseObject()).init();
	};
});