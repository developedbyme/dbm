dbm.registerClass("com.developedbyme.utils.data.PartiallyOwnedNamedArray", "com.developedbyme.utils.data.NamedArray", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.PartiallyOwnedNamedArray");
	//"use strict";
	
	var PartiallyOwnedNamedArray = dbm.importClass("com.developedbyme.utils.data.PartiallyOwnedNamedArray");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.PartiallyOwnedNamedArray::_init");
		
		this.superCall();
		
		this._ownedOverridesObject = new Object();
		
		return this;
	};
	
	objectFunctions.addOwnedOverride = function(aName, aOwned) {
		this._ownedOverridesObject[aName] = !VariableAliases.isFalse(aOwned);
		
		return this;
	};
	
	objectFunctions.removedOwnedOverride = function(aName) {
		delete this._ownedOverridesObject[aName];
		
		return this;
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		var ownedOverrides = new Array();
		var notOwnedOverrides = new Array();
		for(var objectName in this._ownedOverridesObject) {
			var isOwned = this._ownedOverridesObject[objectName];
			if(isOwned) {
				ownedOverrides.push(objectName);
			}
			else {
				notOwnedOverrides.push(objectName);
			}
		}
		
		aReturnArray.push("ownedOverrides: " + ownedOverrides.join(", "));
		aReturnArray.push("notOwnedOverrides: " + notOwnedOverrides.join(", "));
	};
	
	objectFunctions._performDestroyObjects = function() {
		
		for(var objectName in this._objectObjects) {
			var shouldDestroy = (this._ownedOverridesObject[objectName] !== undefined) ? this._ownedOverridesObject[objectName] : this.ownsObjects;
			if(shouldDestroy) {
				ClassReference.softDestroyArrayIfExists(this._objectObjects[objectName]);
			}
		}
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._ownedOverridesObject = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aOwnsObjects) {
		var newReaction = (new ClassReference()).init();
		newReaction.ownsObjects = VariableAliases.isTrue(aOwnsObjects);
		return newReaction;
	};
});