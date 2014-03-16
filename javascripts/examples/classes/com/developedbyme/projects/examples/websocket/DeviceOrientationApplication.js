dbm.registerClass("com.developedbyme.projects.examples.websocket.DeviceOrientationApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var DeviceOrientationApplication = dbm.importClass("com.developedbyme.projects.examples.websocket.DeviceOrientationApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var WebSocketConnection = dbm.importClass("com.developedbyme.utils.websocket.WebSocketConnection");
	var SharedPropertiesConnection = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.SharedPropertiesConnection");
	var MousePositionNode = dbm.importClass("com.developedbyme.flow.nodes.userinput.MousePositionNode");
	var DisplayBaseObject = dbm.importClass("com.developedbyme.gui.DisplayBaseObject");
	var TransformElement3dNode = dbm.importClass("com.developedbyme.flow.nodes.display.TransformElement3dNode");
	var DeviceOrientation = dbm.importClass("com.developedbyme.utils.device.DeviceOrientation");
	var TextElement = dbm.importClass("com.developedbyme.gui.text.TextElement");
	var AdditionNode = dbm.importClass("com.developedbyme.flow.nodes.math.AdditionNode");
	var MultiplicationNode = dbm.importClass("com.developedbyme.flow.nodes.math.MultiplicationNode");
	var WindowSizeNode = dbm.importClass("com.developedbyme.flow.nodes.browser.WindowSizeNode");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var BinaryCommandFlowSetup = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.setup.BinaryCommandFlowSetup");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	var SharedPropertyDataTypes = dbm.importClass("com.developedbyme.constants.websocket.SharedPropertyDataTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.websocket.DeviceOrientationApplication::_init");
		
		this.superCall();
		
		this._webSocket = null;
		this._encodingConnection = null;
		
		this._alpha = null;
		this._beta = null;
		this._gamma = null;
		
		var serverUrl = (dbm.singletons.dbmPageManager.hasQueryStringParameter("serverUrl")) ? decodeURIComponent(dbm.singletons.dbmPageManager.getQueryStringParameter("serverUrl")) : "ws://localhost:8080/dbm/examples/";
		if(dbm.singletons.dbmBrowserDetector.deviceType === "handheld") {
			serverUrl += "input";
		}
		else {
			serverUrl += "output";
		}
		
		this.addCssLink("../assets/examples/websocket/phoneLayout.css");
		this._mainTemplatePath = "../assets/examples/websocket/phoneTemplate.html#phone";
		this._assetsLoader.addAssetsByPath(this._mainTemplatePath);
		this._addStartFunction(this._connect, [serverUrl]);
		
		return this;
	};
	
	objectFunctions._connect = function(aUrl) {
		console.log("com.developedbyme.projects.examples.websocket.DeviceOrientationApplication::_connect");
		
		this._webSocket = WebSocketConnection.create(aUrl);
		this._encodingConnection = SharedPropertiesConnection.create(this._webSocket);
		BinaryCommandFlowSetup.setup(this._encodingConnection);
		
		this._webSocket.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.OPEN, LogCommand.createCommand("Connection opened"));
		if(dbm.singletons.dbmBrowserDetector.deviceType === "handheld") {
			this._webSocket.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.OPEN, CallFunctionCommand.createCommand(this, this._createOutgoingFlow, []));
		}
		else {
			this._webSocket.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.OPEN, CallFunctionCommand.createCommand(this, this._createIncomingFlow, []));
		}
		
		this._webSocket.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.CLOSE, LogCommand.createCommand("Connection closed", GetVariableObject.createSelectDataCommand()));
		this._webSocket.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.ERROR, LogCommand.createCommand("Error", GetVariableObject.createSelectDataCommand()));
		
		this._webSocket.connect();
		console.log(this._webSocket);
	};
	
	objectFunctions._setupSharedProperties = function() {
		this._alpha = this._encodingConnection.createSharedProperty("alpha", 0, 0, SharedPropertyDataTypes.FLOAT_32);
		this._beta = this._encodingConnection.createSharedProperty("beta", 1, 0, SharedPropertyDataTypes.FLOAT_32);
		this._gamma = this._encodingConnection.createSharedProperty("gamma", 2, 0, SharedPropertyDataTypes.FLOAT_32);
		
		this._encodingConnection.startUpdatingTransfer();
		
		var body = dbm.getDocument().body;
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(dbm.getDocument());
		
		var alphaHolder = htmlCreator.createDiv(null, htmlCreator.createText("Alpha: "));
		body.appendChild(alphaHolder);
		var printAlphaText = TextElement.create(alphaHolder, true, this._alpha);
		printAlphaText.getProperty("display").startUpdating();
		
		var betaHolder = htmlCreator.createDiv(null, htmlCreator.createText("Beta: "));
		body.appendChild(betaHolder);
		var printBetaText = TextElement.create(betaHolder, true, this._beta);
		printBetaText.getProperty("display").startUpdating();
		
		var gammaHolder = htmlCreator.createDiv(null, htmlCreator.createText("Gamma: "));
		body.appendChild(gammaHolder);
		var printGammaText = TextElement.create(gammaHolder, true, this._gamma);
		printGammaText.getProperty("display").startUpdating();
	};
	
	objectFunctions._createOutgoingFlow = function() {
		console.log("com.developedbyme.projects.examples.websocket.DeviceOrientationApplication::_createOutgoingFlow");
		
		this._setupSharedProperties();
		
		var deviceOrientation = DeviceOrientation.create();
		deviceOrientation.startUpdating();
		
		this._alpha.connectInput(deviceOrientation.getProperty("alphaValue"));
		this._beta.connectInput(deviceOrientation.getProperty("betaValue"));
		this._gamma.connectInput(deviceOrientation.getProperty("gammaValue"));
		
	};
	
	objectFunctions._createIncomingFlow = function() {
		console.log("com.developedbyme.projects.examples.websocket.DeviceOrientationApplication::_createIncomingFlow");
		
		this._setupSharedProperties();
		
		var body = dbm.getDocument().body;
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(dbm.getDocument());
		
		var windowSizeNode = (new WindowSizeNode()).init();
		windowSizeNode.start();
		
		var scaleXNode = MultiplicationNode.create(windowSizeNode.getProperty("width"), 0.5);
		var scaleYNode = MultiplicationNode.create(windowSizeNode.getProperty("height"), 0.5);
		
		var holder = DisplayBaseObject.createDiv(dbm.getDocument().body, true, {"style": "position: absolute; width: 0px; height: 0px;"});
		holder.setElementAsPositioned();
		holder.setPropertyInput("x", scaleXNode.getProperty("outputValue"));
		holder.setPropertyInput("y", scaleYNode.getProperty("outputValue"));
		
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(this._mainTemplatePath, {}, true, holder.getElement(), true);
		console.log(templateResult);
		var newDisplayObject = templateResult.mainController;
		
		var alphaInvertNode = MultiplicationNode.create(this._alpha, -1);
		var alphaOffsetNode = AdditionNode.create(alphaInvertNode.getProperty("outputValue"), -1*Math.PI);
		var betaInvertNode = MultiplicationNode.create(this._beta, -1);
		//var betaOffsetNode = AdditionNode.create(betaInvertNode.getProperty("outputValue"), -0.5*Math.PI);
		var gammaInvertNode = MultiplicationNode.create(this._gamma, -1);
		
		var transformationNode = TransformElement3dNode.create(newDisplayObject.getElement(), 800, 0, 0, 0, 1, 1, 1, betaInvertNode.getProperty("outputValue"), this._gamma, alphaInvertNode.getProperty("outputValue"));
		
		holder.getProperty("display").startUpdating();
		newDisplayObject.getProperty("display").startUpdating();
		transformationNode.getProperty("display").startUpdating();
		
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._webSocket = null;
		this._encodingConnection = null;
		
		this.superCall();
	};
});