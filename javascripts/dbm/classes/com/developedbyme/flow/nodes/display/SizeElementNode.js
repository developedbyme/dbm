dbm.registerClass("com.developedbyme.flow.nodes.display.SizeElementNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.display.SizeElementNode");
	
	var SizeElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.SizeElementNode");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.display.SizeElementNode::_init");
		
		this.superCall();
		
		this._width = this.createProperty("width", null);
		this._height = this.createProperty("height", null);
		this._element = this.createProperty("element", null);
		this._display = this.createGhostProperty("display");
		
		this.createUpdateFunction("default", this._update, [this._width, this._height, this._element], [this._display]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.display.SizeElementNode::_update");
		
		var htmlElement = this._element.getValueWithoutFlow();
		if(htmlElement === null) {
			return;
		}
		
		try {
			
			var width = this._width.getValueWithoutFlow();
			if(width !== null) {
				htmlElement.style.setProperty("width", width + "px", "");
			}
			var height = this._height.getValueWithoutFlow();
			if(height !== null) {
				htmlElement.style.setProperty("height", height + "px", "");
			}
		}
		catch(theError) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_update", "Un error occured while setting properties.");
			ErrorManager.getInstance().reportError(this, "_update", theError);
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._width = null;
		this._height = null;
		this._element = null;
		this._display = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement, aWidth, aHeight) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("element", aElement);
		newNode.setPropertyInputWithoutNull("width", aWidth);
		newNode.setPropertyInputWithoutNull("height", aHeight);
		return newNode;
	};
});