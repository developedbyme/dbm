dbm.runTempFunction(function() {
	
	var PlaceElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.PlaceElementNode");
	var RepeadedRange = dbm.importClass("com.developedbyme.flow.nodes.math.range.RepeatedRangeNode");
	
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var htmlCreator = dbm.singletons["dbmHtmlDomManager"].getHtmlCreator(document);
		
		var numberOfItems = 15;
		
		var repeatedRangeNode = RepeadedRange.create(dbm.singletons.dbmAnimationManager.globalTimeProperty, 0, ((numberOfItems-1)*0.5*0.25+1+1));
		dbm.singletons.dbmAnimationManager.globalTimeProperty = repeatedRangeNode.getProperty("outputValue");
		
		for(var i = 0; i < numberOfItems; i++) {
			
			var newNode = htmlCreator.createNode("div", {style: "position: absolute; background-color: #FF0000"});
			document.body.appendChild(newNode);
			
			var placeElementNode = PlaceElementNode.create(newNode);
			placeElementNode.getProperty("y").setValue(50*i);
			placeElementNode.getProperty("width").setValue(200);
			placeElementNode.getProperty("height").setValue(50);
			
			var newTimeline = dbm.singletons.dbmAnimationManager.createTimeline(0, placeElementNode.getProperty("x"));
			
			newTimeline.animateValue(800, 1, InterpolationTypes.QUADRATIC, i*0.5*0.25);
			newTimeline.animateValue(0, 1, InterpolationTypes.INVERTED_QUADRATIC, i*0.5*0.25+1);
			
			placeElementNode.getProperty("display").startUpdating();
		}	
	});
});