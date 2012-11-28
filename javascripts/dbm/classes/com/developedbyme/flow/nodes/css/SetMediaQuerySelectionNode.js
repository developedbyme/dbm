dbm.registerClass("com.developedbyme.flow.nodes.css.SetMediaQuerySelectionNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.css.SetMediaQuerySelectionNode");
	//"use strict";
	
	var SetMediaQuerySelectionNode = dbm.importClass("com.developedbyme.flow.nodes.css.SetMediaQuerySelectionNode");
	
	var FunctionFunctions = dbm.importClass("com.developedbyme.utils.native.function.FunctionFunctions");
	var ProgrammingLanguageFunctions = dbm.importClass("com.developedbyme.utils.native.string.ProgrammingLanguageFunctions");
	
	staticFunctions._SPLIT_SEPARATORS = [","];
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.css.SetMediaQuerySelectionNode::_init");
		
		this.superCall();
		
		this._query = this.createProperty("query", null);
		this._rule = this.createProperty("rule", null);
		
		this.createUpdateFunction("default", this._update, [this._query], [this._rule]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		console.log("com.developedbyme.flow.nodes.css.SetMediaQuerySelectionNode::_update");
		
		var query = this._query.getValueWithoutFlow();
		var rule = this._rule.getValueWithoutFlow();
		
		var mediaList = rule.media;
		var mediaLength = mediaList.length;
		
		console.log(query, rule);
		var currentArray = ProgrammingLanguageFunctions.getSeparatedArray(query, ClassReference._SPLIT_SEPARATORS);
		var currentArrayLength = currentArray.length;
		
		for(var i = 0; i < mediaLength; i++) {
			console.log(i, mediaList);
			console.log(mediaList[0]);
			mediaList.deleteMedium(mediaList[0]);
		}
		
		for(var i = 0; i < currentArrayLength; i++) {
			mediaList.appendMedium(currentArray[i]);
		}
		
		console.log(rule);
		
		this._rule.setFlowAsUpdated(aFlowUpdateNumber);
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