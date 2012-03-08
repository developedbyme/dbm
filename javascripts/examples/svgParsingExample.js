dbm.runTempFunction(function() {
	//"use strict";
	
	var SvgView = dbm.importClass("com.developedbyme.gui.svg.SvgView");
	var SvgPath = dbm.importClass("com.developedbyme.gui.svg.SvgPath");
	var Gradient = dbm.importClass("com.developedbyme.utils.graphics.gradient.Gradient");
	var Matrix = dbm.importClass("com.developedbyme.core.data.matrices.Matrix");
	var MatrixTransformation = dbm.importClass("com.developedbyme.utils.math.MatrixTransformation");
	
	var SvgPathFunctions = dbm.importClass("com.developedbyme.utils.svg.SvgPathFunctions");
	var SvgColorFunctions = dbm.importClass("com.developedbyme.utils.svg.SvgColorFunctions");
	var CssLanguageFunctions = dbm.importClass("com.developedbyme.utils.native.string.CssLanguageFunctions");
	var CurveMergeTypes = dbm.importClass("com.developedbyme.constants.CurveMergeTypes");
	
	var XmlCreator = dbm.importClass("com.developedbyme.utils.xml.XmlCreator");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var svgPath = "M 50,0 Q 50,5 45,10 L 5,60 Q 0,65 0,70 0,80 10,80 L 20,80 Q 25,80 25,85 L 25,150 Q 25,155 30,155 L 40,155 Q 50,155 50,165";
		//var svgPath = "M 0,0 L 0,200 500,200 500,0 0,0";
		
		var testCurve = SvgPathFunctions.createCurveFromPathString(svgPath);
		var mirrorXMatrix = Matrix.createWithValues(3, 3, [-1, 0, 100, 0, 1, 0, 0, 0, 1]);
		var mirroredTestCurve = testCurve.duplicate().reverse();
		MatrixTransformation.transform2dPointSet(mirrorXMatrix, mirroredTestCurve, mirroredTestCurve);
		var mergedCurve = dbm.singletons.dbmCurveCreator.combineCurves(testCurve, mirroredTestCurve, CurveMergeTypes.POINT_MERGE);
		
		console.log(testCurve, mirroredTestCurve, mergedCurve);
		
		var newDefinition = SvgPathFunctions.createDefinitionForCurve(testCurve);
		console.log(newDefinition);
		
		var svgCreator = dbm.singletons.dbmHtmlDomManager.getMasterSvgCreator();
		
		var svgView = SvgView.create(document.body, true);
		console.log(svgView);
		
		var svgElement = svgView.getElement();
		
		var linearGradient = svgView.createLinearGradient("test1", "30px", "30px", "41px", "41px", 1);
		console.log(linearGradient);
		
		var testGradient = CssLanguageFunctions.createGradientFromCss("linear-gradient(top, rgba(255, 0, 0, 0.5) 0%,rgba(0, 0, 255, 0.2) 100%)");
		
		console.log(testGradient);
		
		SvgColorFunctions.fillSvgGradient(linearGradient, testGradient);
		
		/*
		var pathElement = svgCreator.createNode("path");
		pathElement.style.setProperty("stroke", "#00FF00", "");
		pathElement.style.setProperty("fill", "url(#test1)", "");
		SvgPathFunctions.drawCurveToPath(pathElement, mergedCurve);
		var testTransform = svgElement.createSVGTransform();
		testTransform.setTranslate(50, 20)
		pathElement.transform.baseVal.appendItem(testTransform);
		console.log(pathElement);
		svgElement.appendChild(pathElement);
		*/
		
		svgView.getRootLayer().getProperty("x").setValue(100);
		
		var svgPath = SvgPath.createNew();
		svgView.getRootLayer().addGraphics(svgPath);
		svgPath.getProperty("stroke").setValue("#00FF00");
		svgPath.getProperty("fill").setValue("url(#test1)");
		svgPath.getProperty("curve").setValue(mergedCurve);
		svgPath.setElementAsTransformed();
		svgPath.getProperty("x").setValue(50);
		svgPath.getProperty("y").setValue(50);
		svgPath.getProperty("scaleX").setValue(2);
		svgPath.getProperty("rotate").setValue(2*Math.PI);
		svgPath.getProperty("pivotX").setValue(50);
		//svgPath.getProperty("pivotY").setValue(50);
		
		svgView.getProperty("display").update();
		svgView.getProperty("display").startUpdating();
		
		console.log(XmlCreator.createStringFromXml(svgElement));
	});
});