dbm.registerClass("com.developedbyme.core.globalobjects.idmanager.objects.CustomBaseIdGroup", "com.developedbyme.core.globalobjects.idmanager.objects.NormalIdGroup", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.idmanager.objects.CustomBaseIdGroup");
	
	var CustomBaseIdGroup = dbm.importClass("com.developedbyme.core.globalobjects.idmanager.objects.CustomBaseIdGroup");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.idmanager.objects.CustomBaseIdGroup::_init");
		
		this.superCall();
		
		this.baseArray = null;
		
		return this;
	}
	
	objectFunctions._getBaseNumber = function(aNumber) {
		var returnString = "";
		var tempNumber = aNumber;
		
		var debugCounter = 0;
		
		while(true) {
			if(debugCounter++ > 1000) {
				break;
			}
			
			var currentIndex = tempNumber%(this.baseArray.length);
			
			returnString = this.baseArray[currentIndex] + returnString;
			
			tempNumber -= currentIndex;
			if(tempNumber === 0) {
				break;
			}
			tempNumber /= this.baseArray.length;
		}
		
		return returnString;
	}
	
	objectFunctions.getId = function(aNumber) {
		return this.superCall(this._getBaseNumber(aNumber));
	}
	
	staticFunctions.create = function(aPrefix, aSuffix, aBaseArray) {
		var newCustomBaseIdGroup = (new ClassReference()).init();
		newCustomBaseIdGroup.prefix = VariableAliases.valueWithDefault(aPrefix, "");
		newCustomBaseIdGroup.suffix = VariableAliases.valueWithDefault(aSuffix, "");
		newCustomBaseIdGroup.baseArray = aBaseArray;
		return newCustomBaseIdGroup;
	}
	
	staticFunctions.createFullAlphabet = function(aPrefix, aSuffix) {
		var newCustomBaseIdGroup = (new ClassReference()).init();
		newCustomBaseIdGroup.prefix = VariableAliases.valueWithDefault(aPrefix, "");
		newCustomBaseIdGroup.suffix = VariableAliases.valueWithDefault(aSuffix, "");
		newCustomBaseIdGroup.baseArray = new Array('0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
		return newCustomBaseIdGroup;
	}
});