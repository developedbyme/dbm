/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.workspace.gui.parts.areas.SizedElementAreaPart", "dbm.workspace.gui.parts.BaseWorkspacePart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.workspace.gui.parts.areas.SizedElementAreaPart");
	//"use strict";
	
	var SizedElementAreaPart = dbm.importClass("dbm.workspace.gui.parts.areas.SizedElementAreaPart");
	
	var PositionRectangleNode = dbm.importClass("dbm.flow.nodes.math.geometry.PositionRectangleNode");
	var Rectangle = dbm.importClass("dbm.core.data.geometry.Rectangle");
	var ValuesFromRectangleNode = dbm.importClass("dbm.flow.nodes.math.geometry.ValuesFromRectangleNode");
	var ScaleRectangleNode = dbm.importClass("dbm.flow.nodes.math.geometry.ScaleRectangleNode");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.workspace.gui.parts.areas.SizedElementAreaPart::_init");
		
		this.superCall();
		
		this._inputArea = this.createProperty("inputArea", null).setAlwaysUpdateFlow();
		this._outputArea = this.createProperty("outputArea", null).setAlwaysUpdateFlow();
		this._parentElement = this.createProperty("parentElement", null);
		this._element = this.createProperty("element", null);
		
		this._inputAreaValuesNode = ValuesFromRectangleNode.create(this._inputArea);
		
		this._rectangleTransformationNode = ScaleRectangleNode.create(this._inputArea, 1, 1, 0, 0);
		this._outputArea.connectInput(this._rectangleTransformationNode.getProperty("outputRectangle"));
		
		this._area = null;
		
		return this;
	};
	
	objectFunctions.setDisplayObject = function(aArea) {
		
		this._area = aArea;
		
		this._area.setPropertyInput("x", this._inputAreaValuesNode.getProperty("x"));
		this._area.setPropertyInput("y", this._inputAreaValuesNode.getProperty("y"));
		this._area.setPropertyInput("width", this._inputAreaValuesNode.getProperty("width"));
		this._area.setPropertyInput("height", this._inputAreaValuesNode.getProperty("height"));
		
		//this._area.setPropertyInput("parentElement", this._parentElement); //MENOTE: should layout add this kind of hierarchy?
		this._element.connectInput(this._area.getProperty("element"));
		
		return this;
	};
	
	objectFunctions._setupHierarchy = function() {
		//console.log("dbm.workspace.gui.parts.areas.SizedElementAreaPart::_setupHierarchy");
		
		this.superCall();
		
		this._parentElement.connectInput(this._treeStructureItem.getAttribute("properties").getProperty("parent"));
		this._inputArea.connectInput(this._treeStructureItem.getAttribute("properties").getProperty("inputArea"));
		
		this._treeStructureItem.getAttribute("properties").getProperty("defaultChildParent").disconnectInput().connectInput(this._element);
		this._treeStructureItem.getAttribute("properties").getProperty("defaultChildArea").disconnectInput().connectInput(this._outputArea);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputAreaNode = null;
		this._area = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aArea) {
		var newSizedElementAreaPart = (new ClassReference()).init();
		
		newSizedElementAreaPart.setDisplayObject(aArea);
		
		return newSizedElementAreaPart;
	};
});