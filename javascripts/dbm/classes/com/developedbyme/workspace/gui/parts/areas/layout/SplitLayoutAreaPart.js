/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.workspace.gui.parts.areas.layout.SplitLayoutAreaPart", "com.developedbyme.workspace.gui.parts.BaseWorkspacePart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.workspace.gui.parts.areas.layout.SplitLayoutAreaPart");
	//"use strict";
	
	var SplitLayoutAreaPart = dbm.importClass("com.developedbyme.workspace.gui.parts.areas.layout.SplitLayoutAreaPart");
	
	var ScaleAndPositionRectangleNode = dbm.importClass("com.developedbyme.flow.nodes.math.geometry.ScaleAndPositionRectangleNode");
	var SubtractionNode = dbm.importClass("com.developedbyme.flow.nodes.math.SubtractionNode");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.workspace.gui.parts.areas.layout.SplitLayoutAreaPart::_init");
		
		this.superCall();
		
		this._inputArea = this.createProperty("inputArea", null).setAlwaysUpdateFlow();
		this._outputArea1 = this.createProperty("outputArea1", null).setAlwaysUpdateFlow();
		this._outputArea2 = this.createProperty("outputArea2", null).setAlwaysUpdateFlow();
		
		this._splitPosition = this.createProperty("splitPosition", 0);
		this._splitOffset = this.createProperty("splitOffset", 0);
		this._invertedSplitPositionNode = this.addDestroyableObject(SubtractionNode.create(1, this._splitPosition));
		this._invertedSplitOffsetNode = this.addDestroyableObject(SubtractionNode.create(0, this._splitOffset));
		
		this._scaleNode1 = this.addDestroyableObject(ScaleAndPositionRectangleNode.create(this._inputArea, 0, 0, 0, 0));
		this._scaleNode2 = this.addDestroyableObject(ScaleAndPositionRectangleNode.create(this._inputArea, 1, 1, 1, 1));
		
		this._outputArea1.connectInput(this._scaleNode1.getProperty("outputRectangle"));
		this._outputArea2.connectInput(this._scaleNode2.getProperty("outputRectangle"));
		
		return this;
	};
	
	objectFunctions._setupHierarchy = function() {
		
		this.superCall();
		
		this._inputArea.connectInput(this._treeStructureItem.getAttribute("properties").getProperty("inputArea"));
		
		var childName1 = "area1";
		var childName2 = "area2";
		
		var child1 = this._treeStructureItem.getChildByName(childName1);
		var child2 = this._treeStructureItem.getChildByName(childName2);
		if(child1 === null) {
			child1 = this._treeStructureItem.getRoot().createItem(childName1, this._treeStructureItem);
		}
		if(child2 === null) {
			child2 = this._treeStructureItem.getRoot().createItem(childName2, this._treeStructureItem);
		}
		
		child1.getAttribute("properties").getProperty("inputArea").disconnectInput().connectInput(this._outputArea1);
		child2.getAttribute("properties").getProperty("inputArea").disconnectInput().connectInput(this._outputArea2);
	};
	
	objectFunctions.setupHorizontalSplit = function() {
		this._scaleNode1.setPropertyInput("scaleY", this._splitPosition);
		this._scaleNode2.setPropertyInput("scaleY", this._invertedSplitPositionNode.getProperty("outputValue"));
		this._scaleNode1.setPropertyInput("scaleOffsetY", this._splitOffset);
		this._scaleNode2.setPropertyInput("scaleOffsetY", this._invertedSplitOffsetNode.getProperty("outputValue"));
		
		return this;
	};
	
	objectFunctions.setupVerticalSplit = function() {
		this._scaleNode1.setPropertyInput("scaleX", this._splitPosition);
		this._scaleNode2.setPropertyInput("scaleX", this._invertedSplitPositionNode.getProperty("outputValue"));
		this._scaleNode1.setPropertyInput("scaleOffsetX", this._splitOffset);
		this._scaleNode2.setPropertyInput("scaleOffsetX", this._invertedSplitOffsetNode.getProperty("outputValue"));
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputArea = null;
		this._outputArea1 = null;
		this._outputArea2 = null;
		
		this._splitPosition = null;
		this._splitOffset = null;
		this._invertedSplitPositionNode = null;
		this._invertedSplitOffsetNode = null;
		
		this._scaleNode1 = null;
		this._scaleNode2 = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newSplitLayoutAreaPart = (new ClassReference()).init();
		
		return newSplitLayoutAreaPart;
		
	};
});