dbm.registerClass("com.developedbyme.utils.reevaluation.verificationreevaluation.NotNullObject", "com.developedbyme.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.verificationreevaluation.NotNullObject");
	
	var NotNullObject = dbm.importClass("com.developedbyme.utils.reevaluation.verificationreevaluation.NotNullObject");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.reevaluation.verificationreevaluation.NotNullObject::_init");
		
		this.superCall();
		
		this.reevaluationObject = null;
		this._errorText = "";
		
		return this;
	};
	
	objectFunctions.setErrorText = function(aText) {
		this._errorText = aText;
		
		return this;
	};
	
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("com.developedbyme.utils.reevaluation.verificationreevaluation.NotNullObject::reevaluate");
		//console.log(this);
		
		var returnData = this.reevaluationObject.reevaluate(aBaseObject);
		//console.log(returnData);
		
		if(!VariableAliases.isSet(returnData)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "reevaluate", "Return value is null. " + this._errorText);
		}
		
		return returnData;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.reevaluationObject = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(aReevaluationObject, aErrorText) {
		var newNotNullObject = (new NotNullObject()).init();
		
		newNotNullObject.reevaluationObject = aReevaluationObject;
		newNotNullObject.setErrorText(aErrorText);
		
		return newNotNullObject;
	};
});