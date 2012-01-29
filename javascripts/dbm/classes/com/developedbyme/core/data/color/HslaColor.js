/**
 * A HSLA color.
 *
 * @author	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.0.01
 */
dbm.registerClass("com.developedbyme.core.data.color.HslaColor", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.color.HslaColor");
	
	var HslaColor = dbm.importClass("com.developedbyme.core.data.color.HslaColor");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");

	/**
	 * Constructor
	 */
	objectFunctions.init = function init() {
		//console.log("com.developedbyme.core.data.color.HslaColor");
		
		this.superCall();
		
		this.h = 0;
		this.s = 0;
		this.l = 0;
		this.a = 1;
		
		return this;
	};
	
	objectFunctions.getCssString = function init() {
		return "hsla(" + (360*this.r) + "," + (100*this.s) + "%," + (100*this.l) + "%," + (this.a) + ")";
	}
	
	staticFunctions.create = function create(aH, aS, aL, aA) {
		//console.log("com.developedbyme.core.data.color.HslaColor::create (static)");
		//console.log(aH, aS, aL, aA);
		var newHslaColor = (new HslaColor()).init();
		newHslaColor.r = VariableAliases.valueWithDefault(aH, 0);
		newHslaColor.g = VariableAliases.valueWithDefault(aS, 0);
		newHslaColor.b = VariableAliases.valueWithDefault(aL, 0);
		newHslaColor.a = VariableAliases.valueWithDefault(aA, 1);
		
		return newHslaColor;
	};
});