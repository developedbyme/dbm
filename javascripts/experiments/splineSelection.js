dbm.runTempFunction(function() {
	
	var SplineSelectionPlayer = dbm.importClass("com.developedbyme.projects.experiments.splineselection.SplineSelectionPlayer");
	var Card = dbm.importClass("com.developedbyme.projects.experiments.splineselection.gui.Card");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var DomManipulationFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomManipulationFunctions");
	var NumberFunctions = dbm.importClass("com.developedbyme.utils.native.number.NumberFunctions");
	
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
	var WindowSizeNode = dbm.importClass("com.developedbyme.flow.nodes.browser.WindowSizeNode");
	var MultiplicationNode = dbm.importClass("com.developedbyme.flow.nodes.math.MultiplicationNode");
	var FlowGroup = dbm.importClass("com.developedbyme.flow.FlowGroup");
	var MousePositionNode = dbm.importClass("com.developedbyme.flow.nodes.userinput.MousePositionNode");
	var RangeNode = dbm.importClass("com.developedbyme.flow.nodes.math.range.RangeNode");
	var RoundNode = dbm.importClass("com.developedbyme.flow.nodes.math.round.RoundNode");
	
	var PrintTextHandler = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.handlers.PrintTextHandler");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		//ErrorManager.getInstance().addHandler(PrintTextHandler.createWithDiv(document));
		
		var splineSelectionPlayerTemplatePath = "../assets/experiments/splineSelection/templates.xml#splineSelectionPlayer";
		var cardTemplatePath = "../assets/experiments/splineSelection/templates.xml#card";
		
		var fileLoaded = function() {
			console.log("fileLoaded");
			
			dbm.singletons.dbmTemplateManager.registerClassShortcut("dbm.experiment.splineselection:SplineSelectionPlayer", SplineSelectionPlayer);
			dbm.singletons.dbmTemplateManager.registerClassShortcut("dbm.experiment.splineselection:Card", Card);
			
			//Center of page
			var windowSizeNode = (new WindowSizeNode()).init();
			windowSizeNode.start();
		
			//Group
			var scalePoint = FlowGroup.create({x: windowSizeNode.getProperty("width"), y: windowSizeNode.getProperty("height"), scale: 0.5}, {x: 0, y: 0});
		
			var scaleXNode = MultiplicationNode.create(scalePoint.getInputProperty("x"), scalePoint.getInputProperty("scale"));
			var scaleYNode = MultiplicationNode.create(scalePoint.getInputProperty("y"), scalePoint.getInputProperty("scale"));
		
			dbm.singletons.dbmFlowManager.connectProperties(scaleXNode.getProperty("outputValue"), scalePoint.getOutputProperty("x"));
			dbm.singletons.dbmFlowManager.connectProperties(scaleYNode.getProperty("outputValue"), scalePoint.getOutputProperty("y"));
		
			//Mouse position
			var mousePositionNode = (new MousePositionNode()).init();
			mousePositionNode.start();
		
			//Mouse parameteric node
			var parameterangeNode = RangeNode.create(mousePositionNode.getProperty("x"), 0, windowSizeNode.getProperty("width"), 0, 3);
			
			var splineSelectionPlayerElement = dbm.singletons.dbmAssetRepository.getAsset(splineSelectionPlayerTemplatePath).getData();
			splineSelectionPlayerElement = DomManipulationFunctions.importNode(splineSelectionPlayerElement, true, dbm.getDocument());
			var templateResult = dbm.singletons.dbmTemplateManager.createControllersForTemplate(splineSelectionPlayerElement);
			var newSplineSelectionPlayer = templateResult.mainController;
			document.body.appendChild(newSplineSelectionPlayer.getElement());
			
			newSplineSelectionPlayer.setPropertyInput("x", scaleXNode.getProperty("outputValue"));
			newSplineSelectionPlayer.setPropertyInput("y", scaleYNode.getProperty("outputValue"));
			//newSplineSelectionPlayer.setPropertyInput("position", parameterangeNode.getProperty("outputValue"));
			newSplineSelectionPlayer.start();
			
			var mainCardTemplateElement = dbm.singletons.dbmAssetRepository.getAsset(cardTemplatePath).getData();
			
			var names = [
				"Mixed seafood soup",
				"Fresh pasta salad",
				"Potatoes dauphinoise",
				"Pork in green shells",
				"Lasagna al forno",
				"Asian chicken skewers",
				"Salmon on a bed of asparagus",
				"Spicy tacos",
				"Prawn stir-fry",
				"Perfect chicken",
				"Pasta bolognese",
				"Classic ham sub",
				"Salmon in white wine",
				"Veal with season veg",
				"Duck in pesto sauce",
				"Left-over tarte tatin",
				"Tuna on beets",
				"Simple peppercorn steak",
				"Cod and carrots",
				"Sausage rolls for the picnic"
			];
			
			var numberOfCards = 20;
			for(var i = 0; i < numberOfCards; i++) {
				
				var cardTemplateElement = DomManipulationFunctions.importNode(mainCardTemplateElement, true, dbm.getDocument());
			
				var templateResult = dbm.singletons.dbmTemplateManager.createControllersForTemplate(cardTemplateElement);
			
				templateResult.mainController.getElement().id = null;
				var image = templateResult.getController("image");
				image.getProperty("source").setValue("../assets/experiments/splineSelection/meals/meal." + NumberFunctions.getPaddedNumber(i+1, 3) + ".jpg");
				templateResult.mainController.getElement().querySelector(".text").innerHTML = names[i];
			
				newSplineSelectionPlayer.addCard(templateResult.mainController, 3*i/numberOfCards);
			}
			
			
			
		}
		
		var templateLoader = dbm.singletons.dbmAssetRepository.getAsset(cardTemplatePath);
		templateLoader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, fileLoaded, []));
		templateLoader.load();
		
	});
});