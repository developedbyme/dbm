/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.css.CssFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.css.CssFunctions");
	//"use strict";
	
	//Self reference
	var CssFunctions = dbm.importClass("com.developedbyme.utils.css.CssFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	//Constants
	var UnitTypes = dbm.importClass("com.developedbyme.constants.UnitTypes");
	
	staticFunctions.BROWSER_CSS_PREFIXES = ["-webkit-", "-khtml-", "-moz-", "-o-", "-ms-"];
	staticFunctions.LENGTH_PROPERTIES = ["border-top-width", "border-right-width", "border-bottom-width", "border-left-width", "border-width", "bottom", "height", "left", "letter-spacing", "line-height", "margin-top", "margin-right", "margin-bottom", "margin-left", "margin", "max-height", "max-width", "min-height", "min-width", "outline-width", "padding-top", "padding-right", "padding-bottom", "padding-left", "padding", "right", "text-indent", "top", "width", "word-spacing"];
	staticFunctions.PREFIXED_PROPERTIES = ["align-items", "animation", "animation-name", "animation-duration", "animation-timing-function", "animation-delay", "animation-iteration-count", "animation-direction", "animation-play-state", "backface-visibility", "box-shadow", "box-sizing", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "column-span", "column-width", "columns", "column-count", "flex-wrap", "font-feature-setting", "hyphens", "image-rendering", "marquee-direction", "marquee-play-count", "marquee-speed", "marquee-style", "perspective", "perspective-origin", "tab-size", "text-align-last", "text-decoration-color", "text-decoration-line", "text-decoration-style", "transform", "transform-origin", "transform-style", "transition", "transition-property", "transition-duration", "transition-timing-function", "transition-delay", "writing-mode"]
	
	staticFunctions.setStyleProperty = function(aElement, aName, aValue, aUnit, aImportant) {
		if(!VariableAliases.isSet(aValue)) {
			aElement.style.setProperty(aName);
			return;
		}
		
		aImportant = VariableAliases.valueWithDefault(aImportant, "");
		aUnit = VariableAliases.valueWithDefault(aUnit, "");
		
		if(aUnit === UnitTypes.NONE) {
			aUnit = "";
		}
		
		aElement.style.setProperty(aName, aValue + "" + aUnit, aImportant);
	};
	
	staticFunctions.isLengthProperty = function(aProperty) {
		return (ArrayFunctions.indexOfInArray(ClassReference.LENGTH_PROPERTIES, aProperty) !== -1);
	};
	
	staticFunctions.isPrefixedProperty = function(aProperty) {
		return (ArrayFunctions.indexOfInArray(ClassReference.PREFIXED_PROPERTIES, aProperty) !== -1);
	};
	
	staticFunctions.getBrowserSpecificCssString = function(aProperty, aValue) {
		var currentArray = ClassReference.BROWSER_CSS_PREFIXES;
		var currentArrayLength = currentArray.length;
		var returnString = aProperty + ": " + aValue + ";";
		for(var i = 0; i < currentArrayLength; i++) {
			returnString += " " + currentArray[i]+aProperty + ": " + aValue + ";";
		}
		
		return returnString;
	};
	
	staticFunctions.getBrowserSpecificCssObject = function(aProperty, aValue) {
		var currentArray = ClassReference.BROWSER_CSS_PREFIXES;
		var currentArrayLength = currentArray.length;
		var returnObject = new Object();
		returnObject[aProperty] = aValue;
		for(var i = 0; i < currentArrayLength; i++) {
			returnObject[currentArray[i]+aProperty] = aValue;
		}
	};
	
	staticFunctions.setBrowserSpecificCssToElement = function(aElement, aProperty, aValue, aUnit, aImportant) {
		
		aImportant = VariableAliases.valueWithDefault(aImportant, "");
		aUnit = VariableAliases.valueWithDefault(aUnit, "");
		
		if(aUnit === UnitTypes.NONE) {
			aUnit = "";
		}
		
		var currentArray = ClassReference.BROWSER_CSS_PREFIXES;
		var currentArrayLength = currentArray.length;
		var returnObject = new Object();
		returnObject[aProperty] = aValue;
		for(var i = 0; i < currentArrayLength; i++) {
			aElement.style.setProperty(currentArray[i]+aProperty, aValue + "" + aUnit, aImportant);
		}
	};
});


/* Properties
	background-attachment					scroll | fixed
	background-color						<color> 
	background-image						<uri> | none
	background-position						[ [ <percentage> | <length> | left | center | right ] [ <percentage> | <length> | top | center | bottom ]? ] | [ [ left | center | right ] || [ top | center | bottom ] ]
	background-repeat						repeat | repeat-x | repeat-y | no-repeat
	background								['background-color' || 'background-image' || 'background-repeat' || 'background-attachment' || background-position]
	border-collapse							collapse | separate
	border-color							[ <color> ]{1,4}
	border-spacing							<length> <length>?
	border-style							<border-style>{1,4}
	border-[top|right|bottom|left]			[ <border-width> || <border-style> || border-top-color ]
	border-[top|right|bottom|left]-color	<color>
	border-[top|right|bottom|left]-style	<border-style>
	border-[top|right|bottom|left]-width	<border-width>
	border-width							<border-width>{1,4}
	border									[ <border-width> || <border-style> || border-top-color ]
	bottom									<length> | <percentage> | auto
	caption-side							top | bottom
	clear									none | left | right | both
	clip									<shape> | auto
	color									<color>
	content									normal | none | [ <string> | <uri> | <counter> | attr(<identifier>) | open-quote | close-quote | no-open-quote | no-close-quote ]+
	counter-increment						[ <identifier> <integer>? ]+ | none
	counter-reset							[ <identifier> <integer>? ]+ | none
	cursor									[ [<uri> ,]* [ auto | crosshair | default | pointer | move | e-resize | ne-resize | nw-resize | n-resize | se-resize | sw-resize | s-resize | w-resize | text | wait | help | progress ] ]
	direction								ltr | rtl
	display									inline | block | list-item | inline-block | table | inline-table | table-row-group | table-header-group | table-footer-group | table-row | table-column-group | table-column | table-cell | table-caption | none
	empty-cells								show | hide
	float									left | right | none
	font-family								[ [ <family-name> | <generic-family> ] [, <family-name>| <generic-family> ]* ]
	font-size								<absolute-size> | <relative-size> | <length> | <percentage>
	font-style								normal | italic | oblique
	font-variant							normal | small-caps
	font-weight								normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
	font									[ [ 'font-style' || 'font-variant' || 'font-weight' ]? 'font-size' [ / 'line-height' ]? font-family ] | caption | icon | menu | message-box | small-caption | status-bar
	height									<length> | <percentage> | auto
	left									<length> | <percentage> | auto
	letter-spacing							normal | <length>
	line-height								normal | <number> | <length> | <percentage>
	list-style-image						<uri> | none
	list-style-position						inside | outside
	list-style-type							disc | circle | square | decimal | decimal-leading-zero | lower-roman | upper-roman | lower-greek | lower-latin | upper-latin | armenian | georgian | lower-alpha | upper-alpha | none
	list-style								[ 'list-style-type' || 'list-style-position' || list-style-image ]
	margin-[top|right|bottom|left]			<margin-width>
	margin									<margin-width>{1,4}
	max-height								<length> | <percentage> | none
	max-width								<length> | <percentage> | none
	min-height								<length> | <percentage>
	min-width								<length> | <percentage>
	opacity									<number>
	orphans									<integer>
	outline-color							<color> | invert
	outline-style							<border-style>
	outline-width							<border-width>
	outline									[ 'outline-color' || 'outline-style' || outline-width ]
	overflow								visible | hidden | scroll | auto
	padding-[top|right|bottom|left]			<padding-width>
	padding									<padding-width>{1,4}
	page-break-after						auto | always | avoid | left | right
	page-break-before						auto | always | avoid | left | right
	page-break-inside						avoid | auto
	position								static | relative | absolute | fixed
	quotes									[<string> <string>]+ | none
	right									<length> | <percentage> | auto
	table-layout							auto | fixed
	text-align								left | right | center | justify
	text-decoration							none | [ underline || overline || line-through || blink ]
	text-indent								<length> | <percentage>
	text-transform							capitalize | uppercase | lowercase | none
	top										<length> | <percentage> | auto
	unicode-bidi							normal | embed | bidi-override
	vertical-align							baseline | sub | super | top | text-top | middle | bottom | text-bottom | <percentage> | <length>
	visibility								visible | hidden | collapse
	white-space								normal | pre | nowrap | pre-wrap | pre-line
	widows									<integer>
	width									<length> | <percentage> | auto
	word-spacing							normal | <length>
	z-index									auto | <integer>
*/