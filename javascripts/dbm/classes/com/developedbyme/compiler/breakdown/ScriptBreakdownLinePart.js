dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownLinePart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownLinePart");
	
	var ScriptBreakdownLinePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownLinePart");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ScriptBreakdownConditionPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownConditionPart");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var ScopeFunctions = dbm.importClass("com.developedbyme.utils.native.string.ScopeFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var JavascriptLanguageFunctions = dbm.importClass("com.developedbyme.utils.native.string.JavascriptLanguageFunctions");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownLinePart::init");
		
		this.superCall();
		
		this._type = "line";
		this._debugCompileString = "";
		
		return this;
	};
	
	objectFunctions._breakdown = function() {
		console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownLinePart::_breakdown");
		console.log(this._script.substring(0, 30));
		
		var keywordType = JavascriptLanguageFunctions.startsWithKeyword(this._script);
		console.log(keywordType);
		if(keywordType != null) {
			switch(keywordType) {
				case "if":
				case "else if":
				case "else":
					this._childBreakdowns.push(ScriptBreakdownConditionPart.create(this, keywordType, this._script));
					break;
				case "do":
				case "while":
					this._childBreakdowns.push(ScriptBreakdownWhilePart.create(this, keywordType, this._script));
					break;
				case "for":
					this._childBreakdowns.push(ScriptBreakdownForPart.create(this, keywordType, this._script));
					break;
				case "var":
					this._childBreakdowns.push(ScriptBreakdownVarPart.create(this, keywordType, this._script));
					break;
				case "function":
					this._childBreakdowns.push(ScriptBreakdownFunctionPart.create(this, keywordType, this._script));
					break;
				default:
					//this._debugCompileString = this._script;
					break;
			}
		}
		else {
			//this._debugCompileString = this._script;
		}
	}
	
	objectFunctions.compile = function() {
		
		return this._debugCompileString + this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParent, aScript) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setScript(aScript);
		return newScriptBreakDown;
	};
});