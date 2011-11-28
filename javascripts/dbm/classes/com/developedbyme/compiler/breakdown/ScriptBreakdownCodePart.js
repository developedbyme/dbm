dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCodePart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownCodePart");
	
	var ScriptBreakdownCodePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCodePart");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ScriptBreakdownLinePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownLinePart");
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var ScopeFunctions = dbm.importClass("com.developedbyme.utils.native.string.ScopeFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownCodePart::init");
		
		this.superCall();
		
		this._type = "code";
		this._startsWithScopeRegExp = new RegExp("^[ \t\f\n\r]*[\\{\\(]");
		this._lastLineIsOpen = false;
		this._scopeStart = "";
		this._scopeEnd = "";
		
		return this;
	};
	
	objectFunctions.setScope = function(aStart, aEnd) {
		this._scopeStart = aStart;
		this._scopeEnd = aEnd;
	};
	
	objectFunctions._addCodeLine = function(aLine, aIsOpen) {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownCodePart::_addCodeLine");
		//console.log(aLine.substring(0, 60));
		
		if(aLine.match(this._startsWithScopeRegExp) && this._lastLineIsOpen) {
			this._childBreakdowns[this._childBreakdowns.length-1].appendScript(StringFunctions.trim(aLine));
		}
		else {
			this._childBreakdowns.push(ScriptBreakdownLinePart.create(this, StringFunctions.trim(aLine)));
		}
		
		this._lastLineIsOpen = aIsOpen;
	}
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownCodePart::_breakdown");
		
		if(this._isBrokenDown) {
			return;
		}
		
		var currentPosition = 0;
		var currentStartPosition = 0;
		var debugCounter = 0;
		
		var lineEndArray = [";", "\n"];
		
		while(true) {
			if(debugCounter++ > 10000) {
				break;
			}
			var scopeStartPosition = ScopeFunctions.getScopeStart(this._script, currentPosition);
			var endLinePosition = ScopeFunctions.getScopeStart(this._script, currentPosition, lineEndArray);
			
			while((endLinePosition < scopeStartPosition || scopeStartPosition == -1) && endLinePosition != -1) {
				var currentLine = this._script.substring(currentStartPosition, endLinePosition);
				//console.log(currentLine, VariableAliases.isEmptyText(currentLine));
				if(!VariableAliases.isEmptyText(currentLine)) {
					this._addCodeLine(currentLine, !(this._script.charAt(endLinePosition) == ";"));
				}
				else {
					this._lastLineIsOpen = false;
				}
				
				currentPosition = endLinePosition+1;
				currentStartPosition = currentPosition;
				
				endLinePosition = ScopeFunctions.getScopeStart(this._script, currentPosition, lineEndArray);
			}
			if(endLinePosition == -1) {
				var currentLine = this._script.substring(currentStartPosition, this._script.length);
				if(!VariableAliases.isEmptyText(currentLine)) {
					this._addCodeLine(currentLine, false);
				}
				else {
					this._lastLineIsOpen = false;
				}
				break;
			}
			var currentScopeStartType = ScopeFunctions.getTypeOfScopeStart(this._script, scopeStartPosition);
			var currentEndScopeType = ScopeFunctions.getTypeOfScopeEndForScopeStart(currentScopeStartType);
			var currentScope = ScopeFunctions.getAnyScope(this._script, scopeStartPosition, currentScopeStartType, currentEndScopeType)
			if(currentScope.end == -1) {
				break;
			}
			if(currentEndScopeType == "}") {
				var currentLine = this._script.substring(currentStartPosition, currentScope.end+currentEndScopeType.length);
				if(!VariableAliases.isEmptyText(currentLine)) {
					this._addCodeLine(currentLine, true);
				}
				else {
					this._lastLineIsOpen = false;
				}
				currentStartPosition = currentScope.end+currentEndScopeType.length;
			}
			else if(currentEndScopeType == "\n") {
				var currentLine = this._script.substring(currentStartPosition, currentScope.end+currentEndScopeType.length);
				if(!VariableAliases.isEmptyText(currentLine)) {
					this._addCodeLine(currentLine, false);
				}
				else {
					this._lastLineIsOpen = false;
				}
				currentStartPosition = currentScope.end+currentEndScopeType.length;
			}
			currentPosition = currentScope.end+currentEndScopeType.length;
		}
		
		this._isBrokenDown = true;
	}
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownCodePart::compile");
		//console.log(aCompileData);
		return this._scopeStart + this.superCall(aCompileData) + this._scopeEnd;
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