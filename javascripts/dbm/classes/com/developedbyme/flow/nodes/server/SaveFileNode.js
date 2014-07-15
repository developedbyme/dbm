/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.server.SaveFileNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.server.SaveFileNode");
	
	//Self reference
	var SaveFileNode = dbm.importClass("com.developedbyme.flow.nodes.server.SaveFileNode");
	
	//Error report
	
	//Dependencies
	var JsonAsset = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assets.JsonAsset");
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		console.log("com.developedbyme.flow.nodes.server.SaveFileNode::_init");
		
		this.superCall();
		
		this._url = this.createProperty("url", null);
		this._fileName = this.createProperty("fileName", null);
		this._data = this.createProperty("data", null);
		this._dataEncoding = this.createProperty("dataEncoding", "ascii");
		this._loaders = this.createProperty("laoders", new Array());
		
		this._updateProperty = this.createGhostProperty("update");
		
		this.createUpdateFunction("default", this._update, [this._url, this._fileName, this._data, this._dataEncoding], [this._updateProperty]);
		
		console.log(this);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.server.SaveFileNode::_update");
		
		var url = this._url.getValueWithoutFlow();
		var fileName = this._fileName.getValueWithoutFlow();
		var data = this._data.getValueWithoutFlow();
		var dataEncoding = this._dataEncoding.getValueWithoutFlow();
		
		if(data !== null) {
			var loader = JsonAsset.create(url);
			loader.setupAsFormObjectPost({"fileName": fileName, "dataEncoding": dataEncoding, "data": data});
			
			var loadersArray = this._loaders.getValueWithoutFlow();
			loadersArray.push(loader);
			
			loader.load();
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._url = null;
		this._fileName = null;
		this._data = null;
		this._dataEncoding = null;
		this._loaders = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aUrl, aFileName, aData, aDataEncoding) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("url", aUrl);
		newNode.setPropertyInputWithoutNull("fileName", aFileName);
		newNode.setPropertyInputWithoutNull("data", aData);
		newNode.setPropertyInputWithoutNull("dataEncoding", aDataEncoding);
		return newNode;
	};
});