dbm.registerClass("com.developedbyme.projects.examples.websocket.SharedPropertiesApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var SharedPropertiesApplication = dbm.importClass("com.developedbyme.projects.examples.websocket.SharedPropertiesApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var WebSocketConnection = dbm.importClass("com.developedbyme.utils.websocket.WebSocketConnection");
	var SharedPropertiesConnection = dbm.importClass("com.developedbyme.utils.websocket.binarycommand.SharedPropertiesConnection");
	var MousePositionNode = dbm.importClass("com.developedbyme.flow.nodes.userinput.MousePositionNode");
	var DisplayBaseObject = dbm.importClass("com.developedbyme.gui.DisplayBaseObject");
	
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
		//console.log("com.developedbyme.projects.examples.websocket.SharedPropertiesApplication::_init");
		
		this.superCall();
		
		this._webSocket = null;
		this._encodingConnection = null;
		this._addStartFunction(this._connect, ["ws://localhost:8080/dbm/examples/command"]);
		
		return this;
	};
	
	objectFunctions._connect = function(aUrl) {
		console.log("com.developedbyme.projects.examples.websocket.SharedPropertiesApplication::_connect");
		
		this._webSocket = WebSocketConnection.create(aUrl);
		this._encodingConnection = SharedPropertiesConnection.create(this._webSocket);
		BinaryCommandFlowSetup.setup(this._encodingConnection);
		
		this._webSocket.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.OPEN, LogCommand.createCommand("Connection opened"));
		this._webSocket.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.OPEN, CallFunctionCommand.createCommand(this, this._createOutgoingFlow, []));
		
		this._webSocket.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.CLOSE, LogCommand.createCommand("Connection closed", GetVariableObject.createSelectDataCommand()));
		this._webSocket.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.ERROR, LogCommand.createCommand("Error", GetVariableObject.createSelectDataCommand()));
		
		this._webSocket.connect();
		console.log(this._webSocket);
	};
	
	objectFunctions._createOutgoingFlow = function() {
		console.log("com.developedbyme.projects.examples.websocket.SharedPropertiesApplication::_createOutgoingFlow");
		
		var mousePositionNode = (new MousePositionNode()).init();
		mousePositionNode.start();
		
		var xOutProperty = this._encodingConnection.createSharedProperty("xOut", 0, mousePositionNode.getProperty("x"), SharedPropertyDataTypes.UINT_14);
		var yOutProperty = this._encodingConnection.createSharedProperty("yOut", 1, mousePositionNode.getProperty("y"), SharedPropertyDataTypes.UINT_14);
		
		var xInProperty = this._encodingConnection.createSharedProperty("xIn", 2, 0, SharedPropertyDataTypes.UINT_14);
		var yInProperty = this._encodingConnection.createSharedProperty("yIn", 3, 0, SharedPropertyDataTypes.UINT_14);
		
		this._encodingConnection.startUpdatingTransfer();
		
		//Display
		var newDisplayObject = DisplayBaseObject.createDiv(dbm.getDocument().body, true, {"style": "position: absolute; background-color: #FF0000"});
		newDisplayObject.setElementAsPositioned().setElementAsSized();
			
		newDisplayObject.getProperty("x").connectInput(xInProperty);
		newDisplayObject.getProperty("y").connectInput(yInProperty);
		newDisplayObject.getProperty("width").setValue(50);
		newDisplayObject.getProperty("height").setValue(50);
		newDisplayObject.getProperty("display").startUpdating();
		
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._webSocket = null;
		this._encodingConnection = null;
		
		this.superCall();
	};
});