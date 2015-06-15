/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A breakdown for any code.
 */
dbm.registerClass("dbm.compiler.breakdown.ScriptBreakdownCodePart", "dbm.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.compiler.breakdown.ScriptBreakdownCodePart");
	
	//Self reference
	var ScriptBreakdownCodePart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownCodePart");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var ScriptBreakdownLinePart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownLinePart");
	var StringFunctions = dbm.importClass("dbm.utils.native.string.StringFunctions");
	
	//Utils
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var ScopeFunctions = dbm.importClass("dbm.utils.native.string.ScopeFunctions");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var BreakdownTypes = dbm.importClass("dbm.constants.compiler.BreakdownTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownCodePart::_init");
		
		this.superCall();
		
		this._type = BreakdownTypes.CODE;
		this._startsWithScopeRegExp = new RegExp("^[\\s]*[\\{\\(]");
		this._lastLineIsOpen = false;
		this._scopeStart = "";
		this._scopeEnd = "";
		
		return this;
	};
	
	/**
	 * Sets the scope containing this code.
	 *
	 * @param	aStart	String	The start scope for this code.
	 * @param	aEnd	String	The end scope for this code.
	 */
	objectFunctions.setScope = function(aStart, aEnd) {
		this._scopeStart = aStart;
		this._scopeEnd = aEnd;
	};
	
	objectFunctions._addCodeLine = function(aLine, aIsOpen) {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownCodePart::_addCodeLine");
		//console.log(aLine.substring(0, 60));
		//console.log(aLine.match(this._startsWithScopeRegExp), this._lastLineIsOpen, aLine.match(this._startsWithScopeRegExp) && this._lastLineIsOpen);
		
		if(aLine.match(this._startsWithScopeRegExp) !== null && this._lastLineIsOpen) {
			this._childBreakdowns[this._childBreakdowns.length-1].appendScript(StringFunctions.trim(aLine));
		}
		else {
			this._childBreakdowns.push(ScriptBreakdownLinePart.create(this, StringFunctions.trim(aLine)));
		}
		
		this._lastLineIsOpen = aIsOpen;
	};
	
	objectFunctions._breakdown = function() {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownCodePart::_breakdown");
		
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
			
			while((endLinePosition < scopeStartPosition || scopeStartPosition === -1) && endLinePosition !== -1) {
				var currentLine = this._script.substring(currentStartPosition, endLinePosition);
				//console.log(currentLine, VariableAliases.isEmptyText(currentLine));
				if(!VariableAliases.isEmptyText(currentLine)) {
					this._addCodeLine(currentLine, (this._script.charAt(endLinePosition) !== ";"));
				}
				else {
					if(this.keepBlankLines) {
						this._addCodeLine(currentLine, false);
					}
					this._lastLineIsOpen = false;
				}
				
				currentPosition = endLinePosition+1;
				currentStartPosition = currentPosition;
				
				endLinePosition = ScopeFunctions.getScopeStart(this._script, currentPosition, lineEndArray);
			}
			
			if(endLinePosition === -1) {
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
			var currentScope = ScopeFunctions.getAnyScope(this._script, scopeStartPosition, currentScopeStartType, currentEndScopeType);
			if(currentScope.end === -1) {
				break;
			}
			
			if(currentEndScopeType === "}") {
				var currentLine = this._script.substring(currentStartPosition, currentScope.end+currentEndScopeType.length);
				if(!VariableAliases.isEmptyText(currentLine)) {
					this._addCodeLine(currentLine, true);
				}
				else {
					this._lastLineIsOpen = false;
				}
				currentStartPosition = currentScope.end+currentEndScopeType.length;
			}
			else if(currentEndScopeType === "\n" || currentEndScopeType === "*/") {
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
	};
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownCodePart::compile");
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