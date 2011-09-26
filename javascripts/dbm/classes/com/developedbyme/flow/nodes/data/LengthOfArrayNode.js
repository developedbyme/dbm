dbm.registerClass("com.developedbyme.flow.nodes.data.LengthOfArrayNodes", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.data.LengthOfArrayNodes");

	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var LengthOfArrayNodes = dbm.importClass("com.developedbyme.flow.nodes.data.LengthOfArrayNodes");
	
	/**
	 * Constructor
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.data.LengthOfArrayNodes::init");
		
		this.superCall();
		
		this._array = this.createProperty("array", null);
		this._length = this.createProperty("length", 0);
		
		this.createUpdateFunction("default", this._update, [this._array], [this._length]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.math.AdditionNode::_update");
		this._length.setValueWithFlow(this._array.getValueWithoutFlow().length, aFlowUpdateNumber);
	};
	
	/**
	 * Sets all the references to null.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._array = null;
		this._length = null;
		
		this.superCall();
		
	};
	
	staticFunctions.create = function(aArray) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("array", aArray);
		return newNode;
	};
});