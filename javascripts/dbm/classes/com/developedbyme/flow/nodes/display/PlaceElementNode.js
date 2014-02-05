dbm.registerClass("com.developedbyme.flow.nodes.display.PlaceElementNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.display.PlaceElementNode");
	
	var PlaceElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.PlaceElementNode");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	var ExternalCssVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalCssVariableProperty");
	var SetElementToCssPropertiesNode = dbm.importClass("com.developedbyme.flow.nodes.internal.SetElementToCssPropertiesNode");
	
	var RoundNode = dbm.importClass("com.developedbyme.flow.nodes.math.round.RoundNode");
	
	var UnitTypes = dbm.importClass("com.developedbyme.constants.UnitTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.display.PlaceElementNode::_init");
		
		this.superCall();
		
		this._x = this.createProperty("x", null);
		var roundXNode = this.addDestroyableObject(RoundNode.create(this._x));
		this._roundedX = this.addProperty("roundedX", ExternalCssVariableProperty.createWithoutExternalObject(this._objectProperty)).setup("left", UnitTypes.PX, null).connectInput(roundXNode.getProperty("outputValue"));
		this._y = this.createProperty("y", null);
		var roundYNode = this.addDestroyableObject(RoundNode.create(this._y));
		this._roundedY = this.addProperty("roundedY", ExternalCssVariableProperty.createWithoutExternalObject(this._objectProperty)).setup("top", UnitTypes.PX, null).connectInput(roundYNode.getProperty("outputValue"));
		this._z = this.createProperty("z", null);
		var roundZNode = this.addDestroyableObject(RoundNode.create(this._z));
		this._roundedZ = this.addProperty("roundedZ", ExternalCssVariableProperty.createWithoutExternalObject(this._objectProperty)).setup("z-index", null, null).connectInput(roundZNode.getProperty("outputValue"));
		this._width = this.addProperty("width", ExternalCssVariableProperty.createWithoutExternalObject(this._objectProperty).setup("width", UnitTypes.PX, null));
		this._height = this.addProperty("height", ExternalCssVariableProperty.createWithoutExternalObject(this._objectProperty).setup("height", UnitTypes.PX, null));
		this._element = this.createProperty("element", null);
		this._elementSet = this.createGhostProperty("elementSet");
		this._display = this.addProperty("display", AnyChangeMultipleInputProperty.create(this._objectProperty));
		
		this.createUpdateFunction("elementSet", this._updateElementSet, [this._element], [this._elementSet]);
		
		this._display.connectInput(this._roundedX).connectInput(this._roundedY).connectInput(this._roundedZ).connectInput(this._width).connectInput(this._height).connectInput(this._elementSet);
		
		return this;
	};
	
	objectFunctions._updateElementSet = function(aFlowUpdateNumber) {
		console.log("com.developedbyme.flow.nodes.display.PlaceElementNode::_updateElementSet");
		console.log(this);
		
		var htmlElement = this._element.getValueWithoutFlow();
		
		this._roundedX.setExternalObject(htmlElement);
		this._roundedY.setExternalObject(htmlElement);
		this._roundedZ.setExternalObject(htmlElement);
		this._width.setExternalObject(htmlElement);
		this._height.setExternalObject(htmlElement);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._x = null;
		this._y = null;
		this._z = null;
		this._width = null;
		this._height = null;
		this._element = null;
		this._display = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement, aX, aY, aZ, aWidth, aHeight) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("element", aElement);
		newNode.setPropertyInputWithoutNull("x", aX);
		newNode.setPropertyInputWithoutNull("y", aY);
		newNode.setPropertyInputWithoutNull("z", aZ);
		newNode.setPropertyInputWithoutNull("width", aWidth);
		newNode.setPropertyInputWithoutNull("height", aHeight);
		return newNode;
	};
});