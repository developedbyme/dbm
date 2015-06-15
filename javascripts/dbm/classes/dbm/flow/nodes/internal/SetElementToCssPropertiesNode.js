/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.internal.SetElementToCssPropertiesNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.internal.SetElementToCssPropertiesNode");
	
	var SetElementToCssPropertiesNode = dbm.importClass("dbm.flow.nodes.internal.SetElementToCssPropertiesNode");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var ArrayHolder = dbm.importClass("dbm.utils.data.ArrayHolder");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.internal.SetElementToCssPropertiesNode::_init");
		
		this.superCall();
		
		this._updateProperties = this.addDestroyableObject(ArrayHolder.create(false));
		this._length = this.createProperty("length", 0);
		this._element = this.createProperty("element", null);
		this._elementSet = this.createGhostProperty("elementSet");
		
		this.createUpdateFunction("elementSet", this._updateElementSet, [this._length, this._element], [this._elementSet]);
		
		return this;
	};
	
	objectFunctions._updateElementSet = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.internal.SetElementToCssPropertiesNode::_updateElementSet");
		//console.log(this);
		
		var htmlElement = this._element.getValueWithoutFlow();
		
		var currentArray = this._updateProperties.array;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentProperty = currentArray[i];
			currentProperty.setExternalObject(htmlElement);
		}
	};
	
	objectFunctions.addUpdateProperty = function(aProperty) {
		this._updateProperties.array.push(aProperty);
		this._length.setValue(this._updateProperties.array.length);
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._updateProperties = null;
		this._length = null;
		this._element = null;
		this._elementSet = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("element", aElement);
		return newNode;
	};
});