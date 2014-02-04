dbm.registerClass("com.developedbyme.utils.reevaluation.manipulationreevaluation.SplitStringObject", "com.developedbyme.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.manipulationreevaluation.ObjectReevaluationBaseObject");
	
	var SplitStringObject = dbm.importClass("com.developedbyme.utils.reevaluation.manipulationreevaluation.SplitStringObject");
	
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.reevaluation.manipulationreevaluation.SplitStringObject::_init");
		
		this.superCall();
		
		this.stringReevaluator = null;
		this.separatorReevaluator = null;
		this.trimLeftReevaluator = null;
		this.trimRightReevaluator = null;
		
		return this;
	};
	
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("com.developedbyme.utils.reevaluation.manipulationreevaluation.SplitStringObject::reevaluate");
		//console.log(this, aBaseObject);
		
		var string = this.stringReevaluator.reevaluate(aBaseObject);
		var separator = this.separatorReevaluator.reevaluate(aBaseObject);
		var trimLeft = this.trimLeftReevaluator.reevaluate(aBaseObject);
		var trimRight = this.trimLeftReevaluator.reevaluate(aBaseObject);
		
		return StringFunctions.splitSeparatedString(string, separator, trimLeft, trimRight);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.stringReevaluator = null;
		this.separatorReevaluator = null;
		this.trimLeftReevaluator = null;
		this.trimRightReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(aString, aSeparator, aTrimLeft, aTrimRight) {
		//console.log("com.developedbyme.utils.reevaluation.manipulationreevaluation.SplitStringObject::createCommand (static)");
		var newCommand = (new SplitStringObject()).init();
		
		aSeparator = VariableAliases.valueWithDefault(aSeparator, ",");
		aTrimLeft = VariableAliases.valueWithDefault(aTrimLeft, true);
		aTrimRight = VariableAliases.valueWithDefault(aTrimRight, true);
		
		newCommand.stringReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aString);
		newCommand.separatorReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aSeparator);
		newCommand.trimLeftReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aTrimLeft);
		newCommand.trimRightReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aTrimRight);
		
		return newCommand;
	};
});