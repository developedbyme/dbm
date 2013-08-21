dbm.registerClass("com.developedbyme.projects.tests.imagesequencerendering.ImageSequenceRenderingApplication", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.projects.tests.imagesequencerendering.ImageSequenceRenderingApplication");
	//"use strict";
	
	var ImageSequenceRenderingApplication = dbm.importClass("com.developedbyme.projects.tests.imagesequencerendering.ImageSequenceRenderingApplication");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var DisplayBaseObject = dbm.importClass("com.developedbyme.gui.DisplayBaseObject");
	var BaseButton = dbm.importClass("com.developedbyme.gui.buttons.BaseButton");
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var ButtonExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ButtonExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.tests.imagesequencerendering.ImageSequenceRenderingApplication::_init");
		
		this.superCall();
		
		this._currentPosition = 0;
		this._numberOfCanvases = 0;
		this._canvasWidth = -1;
		this._canvasHeight = -1;
		
		//METODO: this would be better as one array with another datatype in
		this._positioners = null;
		this._masks = null;
		this._holders = null;
		this._canvases = null;
		this._canvasContexts = null;
		
		this._currentSequenceIndex = 0;
		this._imageSequences = null;
		
		this._grids = [
			[
				{x: 0, y: 0, width: 320, height: 200},
				{x: 330, y: 0, width: 470, height: 200},
				{x: 0, y: 210, width: 100, height: 190},
				{x: 110, y: 210, width: 300, height: 190},
				{x: 420, y: 210, width: 50, height: 190},
				{x: 480, y: 210, width: 320, height: 190}
			],
			[
				{x: 0, y: 0, width: 200, height: 120},
				{x: 0, y: 130, width: 200, height: 80},
				{x: 0, y: 220, width: 200, height: 180},
				{x: 210, y: 0, width: 430, height: 400},
				{x: 650, y: 0, width: 150, height: 270},
				{x: 650, y: 280, width: 150, height: 120}
			],
			[
				{x: 0, y: 0, width: 400, height: 50},
				{x: 410, y: 0, width: 390, height: 50},
				{x: 0, y: 60, width: 150, height: 200},
				{x: 0, y: 270, width: 150, height: 130},
				{x: 160, y: 60, width: 340, height: 340},
				{x: 510, y: 60, width: 290, height: 340}
			]
		];
		
		this._changeLayoutButton = null;
		
		return this;
	};
	
	objectFunctions.setup = function(aNumberOfCanvases, aCanvasWidth, aCanvasHeight, aImageSequences) {
		this._createCanvases(aNumberOfCanvases, aCanvasWidth, aCanvasHeight);
		this._imageSequences = aImageSequences;
		
		this._updateToGrid(this._grids[this._currentSequenceIndex]);
		
		this._changeLayoutButton = BaseButton.createButton(this.getElement(), true, {"style": "position: absolute; top: 420px; left: 380px;"}, "Change layout");
		this._changeLayoutButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.CLICK, CallFunctionCommand.createCommand(this, this._changeLayout, []));
		
		return this;
	};
	
	objectFunctions._changeLayout = function() {
		this._currentSequenceIndex = (this._currentSequenceIndex+1)%this._grids.length;
		this._updateToGrid(this._grids[this._currentSequenceIndex]);
	};
	
	objectFunctions._updateToGrid = function(aGridPositions) {
		var currentArray = this._imageSequences;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPosition = aGridPositions[i%aGridPositions.length];
			this._updatePosition(i, currentPosition.x, currentPosition.y, currentPosition.width, currentPosition.height);
		}
	};
	
	objectFunctions._createCanvases = function(aNumberOfCanvases, aCanvasWidth, aCanvasHeight) {
		//console.log("com.developedbyme.projects.tests.imagesequencerendering.ImageSequenceRenderingApplication::_createCanvases");
		//console.log(aNumberOfCanvases, aCanvasWidth, aCanvasHeight);
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(this.getElement());
		
		this._numberOfCanvases = aNumberOfCanvases;
		
		this._canvasWidth = aCanvasWidth;
		this._canvasHeight = aCanvasHeight;
		
		this._positioners = new Array(this._numberOfCanvases);
		this._masks = new Array(this._numberOfCanvases);
		this._holders = new Array(this._numberOfCanvases);
		this._canvases = new Array(this._numberOfCanvases);
		this._canvasContexts = new Array(this._numberOfCanvases);
		
		var currentArrayLength = this._numberOfCanvases;
		for(var i = 0; i < currentArrayLength; i++) {
			var positioner = DisplayBaseObject.createDiv(this.getElement(), true, {"style": "position: absolute; left: 0px; top: 0px;"});
			positioner.setElementAsTransformed();
			positioner.setPropertyInput("pivotX", 0);
			positioner.setPropertyInput("pivotY", 0);
			var mask = DisplayBaseObject.createDiv(positioner.getElement(), true, {"style": "position: relative; overflow: hidden;"});
			mask.setElementAsSized();
			var holder = DisplayBaseObject.createDiv(mask.getElement(), true, {"style": "position: absolute;"});
			holder.setElementAsPositioned();
			var canvas = htmlCreator.createNode("canvas", {"width": this._canvasWidth, "height": this._canvasHeight});
			holder.getElement().appendChild(canvas);
			var canvasContext = canvas.getContext("2d");
			
			this._positioners[i] = positioner;
			this._masks[i] = mask;
			this._holders[i] = holder;
			this._canvases[i] = canvas;
			this._canvasContexts[i] = canvasContext;
		}
	};
	
	objectFunctions._updatePosition = function(aIndex, aX, aY, aWidth, aHeight) {
		var minRatio = Math.min(this._canvasWidth/aWidth, this._canvasHeight/aHeight);
		
		var displayWidth = Math.round(minRatio*aWidth);
		var displayHeight = Math.round(minRatio*aHeight);
		
		var scaleSize = aWidth/displayWidth;
		
		var positioner = this._positioners[aIndex];
		var holder = this._holders[aIndex];
		var mask = this._masks[aIndex];
		
		mask.getProperty("width").setValue(displayWidth);
		mask.getProperty("height").setValue(displayHeight);
		mask.getProperty("display").update();
		
		holder.getProperty("x").setValue(Math.round(0.5*(displayWidth-this._canvasWidth)));
		holder.getProperty("y").setValue(Math.round(0.5*(displayHeight-this._canvasHeight)));
		holder.getProperty("display").update();
		
		positioner.getProperty("x").setValue(aX);
		positioner.getProperty("y").setValue(aY);
		positioner.getProperty("scaleX").setValue(scaleSize);
		positioner.getProperty("scaleY").setValue(scaleSize);
		positioner.getProperty("display").update();
	};
	
	objectFunctions.start = function() {
		//console.log("com.developedbyme.projects.tests.imagesequencerendering.ImageSequenceRenderingApplication::start");
		
		dbm.singletons.dbmUpdateManager.addUpdater(this, "default");
		this._changeLayoutButton.activate();
	};
	
	objectFunctions.updateTime = function(aTime, aFrame) {
		var startTime = Date.now();
		
		this._currentPosition++;
		
		var currentArray = this._canvasContexts;
		var currentArrayLength = this._numberOfCanvases;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentImageSequence = this._imageSequences[i];
			var image = dbm.singletons.dbmAssetRepository.getAsset(currentImageSequence[this._currentPosition%currentImageSequence.length]).getData();
			currentArray[i].drawImage(image, 0, 0, this._canvasWidth, this._canvasHeight, 0, 0, this._canvasWidth, this._canvasHeight);
		}
		var endTime = Date.now();
		console.log(0.001*(endTime-startTime));
	}
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._positioners = null;
		this._masks = null;
		this._holders = null;
		this._canvases = null;
		this._canvasContexts = null;
		
		this._imageSequences = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement, aNumberOfCanvases, aCanvasWidth, aCanvasHeight, aImageSequences) {
		//console.log("com.developedbyme.projects.tests.imagesequencerendering.ImageSequenceRenderingApplication::create");
		//console.log(aElement);
		
		var newImageSequenceRenderingApplication = (new ClassReference()).init();
		newImageSequenceRenderingApplication.setElement(aElement);
		newImageSequenceRenderingApplication.setup(aNumberOfCanvases, aCanvasWidth, aCanvasHeight, aImageSequences);
		return newImageSequenceRenderingApplication;
	};
});