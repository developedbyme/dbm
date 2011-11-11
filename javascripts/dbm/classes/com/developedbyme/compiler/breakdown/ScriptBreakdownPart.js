dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownPart", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownPart");
	
	var ScriptBreakdownPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownPart");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var ScopeFunctions = dbm.importClass("com.developedbyme.utils.native.string.ScopeFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownPart::init");
		
		this.superCall();
		
		this._type = null;
		this._parent = null;
		this._script = null;
		this._isBrokenDown = false;
		this._isNewScope = false;
		this._executesInitially = false;
		this._childBreakdowns = new Array();
		this.executesDirectly = true;
		
		return this;
	};
	
	objectFunctions.setParent = function(aParent) {
		
		this._parent = aParent;
	};
	
	objectFunctions.setScript = function(aScript) {
		
		this._script = aScript;
	};
	
	objectFunctions.appendScript = function(aScript) {
		
		this._script += aScript;
	};
	
	objectFunctions._breakdown = function() {
		console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownPart::_breakdown");
		
		//MENOTE: should be overridden
		
		this._isBrokenDown = true;
	}
	
	objectFunctions.breakdownForInitialExecution = function() {
		if(this._isBrokenDown) {
			return;
		}
		
		this._breakdown();
		
		var currentArray = this._childBreakdowns;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPart = currentArray[i];
			if(currentPart.executesDirectly) {
				currentPart.breakdownForInitialExecution();
			}
		}
	};
	
	objectFunctions.fullBreakdown = function() {
		
		this._script = aScript;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._parent = null;
		this._script = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParent, aScript) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setScript(aScript);
		return newScriptBreakDown;
	};
});