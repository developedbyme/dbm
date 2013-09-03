/**
 * A value with a unit.
 *
 * @author	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.0.01
 */
dbm.registerClass("com.developedbyme.core.data.number.ValueWithUnit", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.number.ValueWithUnit");
	
	var ValueWithUnit = dbm.importClass("com.developedbyme.core.data.number.ValueWithUnit");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ParseFunctions = dbm.importClass("com.developedbyme.utils.native.string.ParseFunctions");
	
	var UnitTypes = dbm.importClass("com.developedbyme.constants.UnitTypes");
	var JavascriptObjectTypes = dbm.importClass("com.developedbyme.constants.JavascriptObjectTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function _init() {
		//console.log("com.developedbyme.core.data.number.ValueWithUnit");
		
		this.superCall();
		
		this.value = 0;
		this.unitType = UnitTypes.UNKNOWN;
		
		return this;
	};
	
	objectFunctions.getCssString = function getCssString() {
		if(this.unitType === UnitTypes.NONE || this.unitType === UnitTypes.UNKNOWN) {
			return this.value.toString();
		}
		return this.value + this.unitType;
	};
	
	staticFunctions.create = function create(aValue, aUnitType) {
		//console.log("com.developedbyme.core.data.number.ValueWithUnit::create (static)");
		//console.log(aValue, aUnitType);
		var newValueWithUnit = (new ValueWithUnit()).init();
		newValueWithUnit.value = aValue;
		newValueWithUnit.unitType = aUnitType;
		
		return newValueWithUnit;
	};
	
	staticFunctions.parseValue = function parseValue(aValue, aReturnValueWithUnit, aDefaultUnitType) {
		//console.log("com.developedbyme.core.data.number.ValueWithUnit::parseValue (static)");
		//console.log(aValue, typeof(aValue), aReturnValueWithUnit, aDefaultUnitType);
		
		var aDefaultUnitType = VariableAliases.valueWithDefault(aDefaultUnitType, UnitTypes.UNKNOWN);
		
		if(aValue instanceof ValueWithUnit) {
			aReturnValueWithUnit.value = aValue.value;
			aReturnValueWithUnit.unitType = aValue.unitType;
		}
		else if(typeof(aValue) === JavascriptObjectTypes.TYPE_NUMBER) {
			aReturnValueWithUnit.value = aValue;
			aReturnValueWithUnit.unitType = aDefaultUnitType;
		}
		else if(typeof(aValue) === JavascriptObjectTypes.TYPE_STRING) {
			//METODO
			
			var numberEndPosition = ParseFunctions.getEndOfCssNumber(aValue, 0);
			if(numberEndPosition > 0) {
				aReturnValueWithUnit.value = parseFloat(aValue.substring(0, numberEndPosition));
				if(numberEndPosition !== aValue.length) {
					var unitType = aValue.substring(numberEndPosition, aValue.length);
					switch(unitType.toLowerCase()) {
						case UnitTypes.PX:
						case UnitTypes.PERCENTAGE:
						case UnitTypes.EM:
						case UnitTypes.EX:
						case UnitTypes.IN:
						case UnitTypes.CM:
						case UnitTypes.MM:
						case UnitTypes.PT:
						case UnitTypes.PC:
							//MENOTE: do nothing
							break;
						default:
							//METODO: warning message
							break;
					}
					aReturnValueWithUnit.unitType = unitType;
				}
				else {
					//METODO: warning message
					aReturnValueWithUnit.unitType = aDefaultUnitType;
				}
			}
			else {
				//METODO: error message
			}
		}
		else {
			//METODO: error message
		}
	};
});