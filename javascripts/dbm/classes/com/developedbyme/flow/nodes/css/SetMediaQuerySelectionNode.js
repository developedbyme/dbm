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
		//console.log("com.developedbyme.flow.nodes.css.SetMediaQuerySelectionNode::_update");
		
		var query = this._query.getValueWithoutFlow();
		var rule = this._rule.getValueWithoutFlow();
		
		var mediaList = rule.media;
		var mediaLength = mediaList.length;
		
		var currentArray = ProgrammingLanguageFunctions.getSeparatedArray(query, ClassReference._SPLIT_SEPARATORS);
		var currentArrayLength = currentArray.length;
		
		var maxAddLength = Math.min(mediaLength, currentArrayLength);
		
		if(currentArrayLength < mediaLength) {
			var removeLength = mediaLength-currentArrayLength;
			for(var i = 0; i < removeLength; i++) {
				mediaList.deleteMedium(mediaList[mediaLength-i-1]);
			}
		}
		else if(currentArrayLength < mediaLength) {
			var addLength = currentArrayLength-mediaLength;
			for(var i = 0; i < removeLength; i++) {
				mediaList.appendMedium(currentArray[mediaLength+i]);
			}
		}
		
		for(var i = 0; i < maxAddLength; i++) {
			mediaList[i] = currentArray[i];
		}
		
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