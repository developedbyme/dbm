/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.reevaluation.verificationreevaluation.NotNullObject", "dbm.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.verificationreevaluation.NotNullObject");
	
	var NotNullObject = dbm.importClass("dbm.utils.reevaluation.verificationreevaluation.NotNullObject");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.reevaluation.verificationreevaluation.NotNullObject::_init");
		
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
		//console.log("dbm.utils.reevaluation.verificationreevaluation.NotNullObject::reevaluate");
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