dbm.registerClass("com.developedbyme.flow.nodes.css.SetMediaQuerySelectionNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.css.SetMediaQuerySelectionNode");
	//"use strict";
	
	var SetMediaQuerySelectionNode = dbm.importClass("com.developedbyme.flow.nodes.css.SetMediaQuerySelectionNode");
	
	var FunctionFunctions = dbm.importClass("com.developedbyme.utils.native.function.FunctionFunctions");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.css.SetMediaQuerySelectionNode::_init");
		
		this.superCall();
		
		this._query = this.createProperty("query", null);
		this._rule = this.createProperty("rule", null);
		
		this.createUpdateFunction("default", this._update, [this._query], [this._rule]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.css.SetMediaQuerySelectionNode::_update");
		
		var query = this._query.getValueWithoutFlow();
		var rule = this._rule.getValueWithoutFlow();
		
		rule.media = query;
		
		this._rule.setAsClean();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._query = null;
		this._rule = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aQuery, aRule) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("query", aQuery);
		newNode.setPropertyInputWithoutNull("rule", aRule);
		return newNode;
	};
});