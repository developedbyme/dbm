dbm.runTempFunction(function() {
	
	var BaseButton = dbm.importClass("dbm.gui.buttons.BaseButton");
	
	var ValueToAnimationNode = dbm.importClass("dbm.flow.nodes.animation.ValueToAnimationNode");
	var PlaceElementNode = dbm.importClass("dbm.flow.nodes.display.PlaceElementNode");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var InterpolationTypes = dbm.importClass("dbm.constants.InterpolationTypes");
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var htmlCreator = dbm.singletons["dbmHtmlDomManager"].getHtmlCreator(document);
		
		//dbm.singletons.dbmAnimationManager.globalTimeProperty = repeatedRangeNode.getProperty("outputValue");
		
		var currentButton = BaseButton.create(htmlCreator.createDiv({style: "position: absolute; background-color: #0000FF"}, htmlCreator.createText("Roll over")));
		currentButton.addToParent(document.body);
		currentButton.activate();
		
		var newNode = htmlCreator.createNode("div", {style: "position: absolute; background-color: #FF0000"});
		document.body.appendChild(newNode);
		
		var placeElementNode = PlaceElementNode.create(newNode);
		placeElementNode.getProperty("y").setValue(50);
		placeElementNode.getProperty("width").setValue(200);
		placeElementNode.getProperty("height").setValue(50);
		
		var newTimeline = dbm.singletons.dbmAnimationManager.createTimeline(0, placeElementNode.getProperty("x"));
		
		//console.log(newTimeline);
		
		var animationFunction = function(aOwnerObject, aValueChange) {
			if(aValueChange.newValue === true) {
				aOwnerObject.getTimeline().animateValue(800, 0.5, InterpolationTypes.QUADRATIC, 0);
			}
			else {
				aOwnerObject.getTimeline().animateValue(0, 0.5, InterpolationTypes.INVERTED_QUADRATIC, 0);
			}
		}
		
		var valueToAnimationNode = ValueToAnimationNode.create(currentButton.getProperty("rollOverState"), newTimeline);
		//valueToAnimationNode.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.VALUE_CHANGED, CallFunctionCommand.createCommand(console, console.log, [GetVariableObject.createSelectOwnerObjectCommand(), GetVariableObject.createSelectDataCommand()]));
		valueToAnimationNode.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.VALUE_CHANGED, CallFunctionCommand.createCommand(this, animationFunction, [GetVariableObject.createSelectOwnerObjectCommand(), GetVariableObject.createSelectDataCommand()]));
		
		//console.log(valueToAnimationNode);
		
		placeElementNode.getProperty("display").startUpdating();
	});
});