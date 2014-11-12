/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.nodejs.projects.examples.basic.server.SaveFileServerApplication", "com.developedbyme.nodejs.projects.examples.basic.server.FileServerApplication", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var SaveFileServerApplication = dbm.importClass("com.developedbyme.nodejs.projects.examples.basic.server.SaveFileServerApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var IncomingRequestLoader = dbm.importClass("com.developedbyme.nodejs.utils.network.IncomingRequestLoader");
	var ApiCallRouter = dbm.importClass("com.developedbyme.nodejs.server.router.api.ApiCallRouter");
	var FileWriter = dbm.importClass("com.developedbyme.nodejs.utils.file.FileWriter");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var UrlFunctions = dbm.importClass("com.developedbyme.utils.native.string.UrlFunctions");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.projects.examples.basic.server.SaveFileServerApplication::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.start = function() {
		console.log("com.developedbyme.nodejs.projects.examples.basic.server.SaveFileServerApplication::start");
		
		this.superCall();
		
		var saveFileApiPoint = ApiCallRouter.create("dbm/examples/saveFile");
		saveFileApiPoint.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, CallFunctionCommand.createCommand(this, this._saveFileRequest, [GetVariableObject.createSelectDataCommand()]));
		
		this._server.addRequestRouter(saveFileApiPoint);
	};
	
	objectFunctions._saveFileRequest = function(aApiCallData) {
		//console.log("com.developedbyme.nodejs.projects.examples.basic.server.SaveFileServerApplication::_saveFileRequest");
		//console.log(aApiCallData);
		
		var routingData = aApiCallData.routingData;
		
		var incomingLoader = IncomingRequestLoader.create(routingData.request);
		incomingLoader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._callback_incomingDataLoaded, [aApiCallData, GetVariableObject.createSelectDataCommand()]));
		incomingLoader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(incomingLoader, incomingLoader.destroy, []));
		
	};
	
	objectFunctions._callback_incomingDataLoaded = function(aApiCallData, aData) {
		//console.log("com.developedbyme.nodejs.projects.examples.basic.server.SaveFileServerApplication::_callback_incomingDataLoaded");
		//console.log(aData);
		
		var parameters = NamedArray.create(false);
		UrlFunctions.parseQueryString(aData, parameters);
		//console.log(parameters.generateObjectsObject());
		
		var requiredFields = ["fileName", "dataEncoding", "data"];
		if(!parameters.hasObjects(requiredFields)) {
			//METODO: error message
			//METODO: error reponse
			aApiCallData.callError("Request doesn't have all required fields");
			parameters.destroy();
			return;
		}
		
		//var filePath = dbm.singletons.dbmAssetRepository.getAbsoultePath("assets/temp/saveFilesServerApplication_output.txt");
		//METODO: add security to this
		var filePath = dbm.singletons.dbmAssetRepository.getAbsoultePath("assets/temp/savedFiles/" + parameters.getObject("fileName"));
		
		var writer = FileWriter.create(filePath);
		writer.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.SAVED, CallFunctionCommand.createCommand(this, this._callback_dataSaved, [aApiCallData]));
		writer.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.SAVED, CallFunctionCommand.createCommand(writer, writer.destroy, []));
		
		writer.setEncoding(parameters.getObject("dataEncoding"));
		writer.setData(parameters.getObject("data"));
		writer.write();
		parameters.destroy();
	};
	
	objectFunctions._callback_dataSaved = function(aApiCallData) {
		//console.log("com.developedbyme.nodejs.projects.examples.basic.server.SaveFileServerApplication::_callback_dataSaved");
		
		var theResponse = aApiCallData.routingData.response;
		
		theResponse.writeHead(200, {"Access-Control-Allow-Origin": "*"});
		theResponse.end("{\"status\": 1}");
		aApiCallData.callDone();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return ClassReference._createAndInitClass(ClassReference);
	};
});