dbm.registerClass("com.developedbyme.gui.images.StateImage", "com.developedbyme.gui.images.StaticImage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	var StateImage = dbm.importClass("com.developedbyme.gui.images.StateImage");
	
	var NameSwitchedNode = dbm.importClass("com.developedbyme.flow.nodes.logic.NameSwitchedNode");
	var BooleanSwitchedNode = dbm.importClass("com.developedbyme.flow.nodes.logic.BooleanSwitchedNode");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.images.StateImage::_init");
		
		this.superCall();
		
		this._state = this.createProperty("state");
		this._switchNode = NameSwitchedNode.create(this._state);
		this._source.connectInput(this._switchNode.getProperty("outputValue"));
		
		return this;
	};
	
	objectFunctions.addStateFromAsset = function(aName, aUrl, aPreload) {
		
		aPreload = VariableAliases.valueWithDefault(aPreload, false);
		
		var asset = dbm.singletons.dbmAssetRepository.getAsset(aUrl);
		if(aPreload) {
			asset.load();
		}
		this.addState(aName, asset.getUrl());
		
		return this;
	};
	
	objectFunctions.addState = function(aName, aUrl) {
		
		if(aName === null) {
			this._switchNode.getProperty("defaultValue").setValue(aUrl);
		}
		else {
			this._switchNode.addItem(aName, aUrl);
		}
		
		return this;
	};
	
	staticFunctions.connectRollOverToImage = function(aButton, aImage, aNormalName, aOverName) {
		
		var aNormalName = VariableAliases.valueWithDefault(aNormalName, "normal");
		var aOverName = VariableAliases.valueWithDefault(aOverName, "over");
		
		var switchNode = BooleanSwitchedNode.create(aButton.getProperty("rollOverState"), aOverName, aNormalName);
		aImage.getProperty("state").connectInput(switchNode.getProperty("outputValue"));
		aImage.getProperty("source").startUpdating();
	};
	
	staticFunctions.create = function(aParentOrDocument, aAddToParent, aUrl, aDefaultState, aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var theDocument = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(theDocument);
		
		newNode.setElement(htmlCreator.createImage(aUrl, aAttributes));
		newNode.addState(aDefaultState, aUrl);
		newNode.getProperty("state").setValue(aDefaultState);
		newNode.setParent(theParent);
		if(aAddToParent !== false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
});