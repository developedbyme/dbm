dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownVarPart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownVarPart");
	
	var ScriptBreakdownVarPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownVarPart");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ScriptBreakdownLinePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownLinePart");
	var ScriptBreakdownCodePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCodePart");
	var ScriptBreakdownDbmImportClassPart = dbm.importClass("com.developedbyme.compiler.breakdown.dbm.ScriptBreakdownDbmImportClassPart");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var ScopeFunctions = dbm.importClass("com.developedbyme.utils.native.string.ScopeFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var JavascriptLanguageFunctions = dbm.importClass("com.developedbyme.utils.native.string.JavascriptLanguageFunctions");
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownVarPart::_init");
		
		this.superCall();
		
		this._type = "declareVariable";
		this._variableName = null;
		this._set = null;
		this._in = null;
		
		return this;
	};
	
	objectFunctions._replaceChildBreakdown = function(aCurrentPart, aNewPart) {
		
		if(this._set === aCurrentPart) {
			this._set = aNewPart;
			this.addDestroyableObject(this._set);
		}
		if(this._in === aCurrentPart) {
			this._in = aNewPart;
			this.addDestroyableObject(this._in);
		}
		
		this.superCall(aCurrentPart, aNewPart);
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownVarPart::_breakdown");
		var evaluationIndex = this._script.indexOf("=");
		var inIndex = this._script.indexOf(" in ");
		//console.log(this._script.substring(0, 60));
		
		//METODO: need to handle comments in variable name
		
		if(evaluationIndex !== -1) {
			this._variableName = StringFunctions.trim(this._script.substring(0, evaluationIndex));
			
			//console.log(StringFunctions.trim(this._script.substring(evaluationIndex+1, this._script.length)).substring(0, 60));
			this._set = ScriptBreakdownLinePart.create(this, StringFunctions.trim(this._script.substring(evaluationIndex+1, this._script.length)));
			this._childBreakdowns.push(this._set);
			
		}
		else if(inIndex !== -1) {
			this._variableName = StringFunctions.trim(this._script.substring(0, inIndex));
			this._in = ScriptBreakdownLinePart.create(this, StringFunctions.trim(this._script.substring(inIndex+4, this._script.length)));
			this._childBreakdowns.push(this._in);
		}
		else {
			this._variableName = StringFunctions.trim(this._script);
		}
	};
	
	objectFunctions._childsBrokenDown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownVarPart::_childsBrokenDown");
		
		if(this._set !== null) {
			var setChildBreakdowns = this._set.getChildBreakdowns();
			
			//console.log(setChildBreakdowns);
			
			if(setChildBreakdowns.length === 2) { //METODO: fix that it can be more than 2
				var functionCallBreakdown = setChildBreakdowns[1];
				if(functionCallBreakdown.getType() === "callFunction") {
					var functionNameBreakdown = setChildBreakdowns[0];
					if(functionNameBreakdown.getType() === "variableOnObjectReference" && functionNameBreakdown.getVariableName() === "importClass" && functionNameBreakdown.getObject().getVariableName() === "dbm") {
						
						var classPath = functionCallBreakdown.getChildBreakdowns()[0].getString();
						
						var replacementPart = ScriptBreakdownDbmImportClassPart.create(this._parent, this._script, this._variableName, classPath);
						
						this._replaceablePart = replacementPart;
					}
				}
			}
			
		}
	};
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownVarPart::compile");
		//console.log(aCompileData);
		
		var compiledName = aCompileData.createVariableReference(this._variableName, "variable");
		
		var returnString = "var " + compiledName;
		
		if(this._set !== null) {
			returnString += "=" + this._set.compile(aCompileData);
		}
		else if(this._in !== null) {
			returnString += " in " + this._in.compile(aCompileData);
		}
		
		return returnString;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._evaluation = null;
		this._result = null;
		this._set = null;
		this._in = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParent, aScript) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setScript(aScript);
		return newScriptBreakDown;
	};
});