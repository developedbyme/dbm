dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownLiteralObjectPart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownLiteralObjectPart");
	
	var ScriptBreakdownLiteralObjectPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownLiteralObjectPart");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ScriptBreakdownLinePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownLinePart");
	var ScriptBreakdownCodePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCodePart");
	var ScriptBreakdownListPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownListPart");
	var ScriptBreakdownLiteralNamePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownLiteralNamePart");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var ScopeFunctions = dbm.importClass("com.developedbyme.utils.native.string.ScopeFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var JavascriptLanguageFunctions = dbm.importClass("com.developedbyme.utils.native.string.JavascriptLanguageFunctions");
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownLiteralObjectPart::init");
		
		this.superCall();
		
		this._type = "literalObject";
		this._names = new Array();
		this._values = new Array();
		
		return this;
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownLiteralObjectPart::_breakdown");
		
		var currentArray = this._getCommaArray(this._script);
		var currentArrayLength = currentArray.length;
		var currentPosition = 0;
		for(var i = 0; i < currentArrayLength; i++) {
			
			var currentLine =StringFunctions.trim(this._script.substring(currentPosition, currentArray[i]));
			var colonPosition = this._getColonPosition(currentLine);
			if(colonPosition == -1) {
				continue;
			}
			else {
				var namePart = ScriptBreakdownLiteralNamePart.create(this, StringFunctions.trim(currentLine.substring(0, colonPosition)));
				var valuePart = ScriptBreakdownLinePart.create(this, StringFunctions.trim(currentLine.substring(colonPosition+1, currentLine.length)));
				this._names.push(namePart);
				this._childBreakdowns.push(namePart);
				this._values.push(valuePart);
				this._childBreakdowns.push(valuePart);
			}
			currentPosition = currentArray[i]+1;
		}
		
		var currentLine =StringFunctions.trim(this._script.substring(currentPosition, this._script.length));
		var colonPosition = this._getColonPosition(currentLine);
		if(colonPosition != -1) {
			var namePart = ScriptBreakdownLiteralNamePart.create(this, StringFunctions.trim(currentLine.substring(0, colonPosition)));
			var valuePart = ScriptBreakdownLinePart.create(this, StringFunctions.trim(currentLine.substring(colonPosition+1, currentLine.length)));
			this._names.push(namePart);
			this._childBreakdowns.push(namePart);
			this._values.push(valuePart);
			this._childBreakdowns.push(valuePart);
		}
		
	}
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownLiteralObjectPart::compile");
		
		var argumentsArray = new Array();
		var currentArray = this._names;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentName = currentArray[i];
			var currentValue = this._values[i];
			argumentsArray.push(currentName.compile(aCompileData) + ":" + currentValue.compile(aCompileData));
		}
		
		returnString = "{" + argumentsArray.join(",") + "}";
		
		return returnString;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._arguments = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParent, aScript) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setScript(aScript);
		return newScriptBreakDown;
	};
});