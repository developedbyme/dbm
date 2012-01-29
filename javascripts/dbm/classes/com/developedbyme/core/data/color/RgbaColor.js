/**
 * A RGBA color.
 *
 * @author	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.0.01
 */
dbm.registerClass("com.developedbyme.core.data.color.RgbaColor", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.color.RgbaColor");
	
	var RgbaColor = dbm.importClass("com.developedbyme.core.data.color.RgbaColor");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");

	/**
	 * Constructor
	 */
	objectFunctions.init = function init() {
		//console.log("com.developedbyme.core.data.color.RgbaColor");
		
		this.superCall();
		
		this.r = 0;
		this.g = 0;
		this.b = 0;
		this.a = 1;
		
		return this;
	};
	
	objectFunctions.getCssString = function init() {
		return "rgba(" + (100*this.r) + "%," + (100*this.g) + "%," + (100*this.b) + "%," + (this.a) + ")";
	}
	
	staticFunctions.create = function create(aR, aG, aB, aA) {
		//console.log("com.developedbyme.core.data.color.RgbaColor::create (static)");
		//console.log(aR, aG, aB, aA);
		var newRgbaColor = (new RgbaColor()).init();
		newRgbaColor.r = VariableAliases.valueWithDefault(aR, 0);
		newRgbaColor.g = VariableAliases.valueWithDefault(aG, 0);
		newRgbaColor.b = VariableAliases.valueWithDefault(aB, 0);
		newRgbaColor.a = VariableAliases.valueWithDefault(aA, 1);
		
		return newRgbaColor;
	};
});