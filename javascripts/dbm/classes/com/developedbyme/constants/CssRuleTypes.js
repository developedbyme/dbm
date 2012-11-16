dbm.registerClass("com.developedbyme.constants.CssRuleTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.CssRuleTypes");
	//"use strict";
	
	var CssRuleTypes = dbm.importClass("com.developedbyme.constants.CssRuleTypes");
	
	CssRuleTypes.UNKNOWN_RULE = 0;
	CssRuleTypes.STYLE_RULE = 1;
	CssRuleTypes.CHARSET_RULE = 2;
	CssRuleTypes.IMPORT_RULE = 3;
	CssRuleTypes.MEDIA_RULE = 4;
	CssRuleTypes.FONT_FACE_RULE = 5;
	CssRuleTypes.PAGE_RULE = 6;
	CssRuleTypes.KEYFRAMES_RULE = 7;
	CssRuleTypes.KEYFRAME_RULE = 8;
	
	CssRuleTypes.NAMESPACE_RULE = 10;
	CssRuleTypes.COUNTER_STYLE_RULE = 11;
	CssRuleTypes.SUPPORTS_RULE = 12;
	CssRuleTypes.DOCUMENT_RULE = 13;
	CssRuleTypes.FONT_FEATURE_VALUES_RULE = 14;
	CssRuleTypes.VIEWPORT_RULE = 15;
	CssRuleTypes.REGION_STYLE_RULE = 16;
});