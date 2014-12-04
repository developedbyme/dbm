/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.experiments.imagesequenceplayer.ImageSequencePlayer", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.projects.experiments.imagesequenceplayer.ImageSequencePlayer");
	//"use strict";
	
	var ImageSequencePlayer = dbm.importClass("dbm.projects.experiments.imagesequenceplayer.ImageSequencePlayer");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var LoadingSequence = dbm.importClass("dbm.core.globalobjects.assetrepository.loaders.LoadingSequence");
	var StaticImage = dbm.importClass("dbm.gui.images.StaticImage");
	var PadNumberNode = dbm.importClass("dbm.flow.nodes.text.PadNumberNode");
	var TextReplacementNode = dbm.importClass("dbm.flow.nodes.text.TextReplacementNode");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var ArrayGenerator = dbm.importClass("dbm.utils.native.array.ArrayGenerator");
	var NumberFunctions = dbm.importClass("dbm.utils.native.number.NumberFunctions");
	
	var SequencedMultipleOrderSelector = dbm.importClass("dbm.utils.data.orderselector.SequencedMultipleOrderSelector");
	var OrderedOrderSelector = dbm.importClass("dbm.utils.data.orderselector.OrderedOrderSelector");
	var ModifiedSteppedOrderSelector = dbm.importClass("dbm.utils.data.orderselector.ModifiedSteppedOrderSelector");
	var ReservedData = dbm.importClass("dbm.utils.data.orderselector.ReservedData");
	
	var RepeatedRangeInterpolation = dbm.importClass("dbm.utils.math.interpolation.RepeatedRangeInterpolation");
	var OffsettedInterpolation = dbm.importClass("dbm.utils.math.interpolation.OffsettedInterpolation");
	var LinearInterpolation = dbm.importClass("dbm.utils.math.interpolation.LinearInterpolation");
	
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	var InterpolationTypes = dbm.importClass("dbm.constants.InterpolationTypes");
	var AssetStatusTypes = dbm.importClass("dbm.constants.AssetStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.projects.experiments.imagesequenceplayer.ImageSequencePlayer::_init");
		
		this.superCall();
		
		this._loader = LoadingSequence.create();
		this._loader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.REQUEST_MORE_LOADERS, CallFunctionCommand.createCommand(this, this._callback_addMoreLoaders, []));
		
		this._length = 0;
		this._orderSelector = null;
		this._reservedData = null;
		this._resetPositionObjects = new Array();
		this._positionOffsets = new Array();
		
		this._image = StaticImage.create(dbm.getDocument().body, true, null);
		
		this._aimedPosition = this.createProperty("aimedPosition", 0);
		this._currentPosition = this.createProperty("currentPosition", 0);
		
		this._padFileNameNode = PadNumberNode.create(this._currentPosition, 5);
		this._generateFileNameNode = TextReplacementNode.create("../assets/experiments/imageSequencePlayer/Previz360_[number].jpg");
		this._generateFileNameNode.addReplacement("[number]", this._padFileNameNode.getProperty("outputValue"));
		
		this._loadingPadFileNameNode = PadNumberNode.create(0, 5);
		this._loadingGenerateFileNameNode = TextReplacementNode.create("../assets/experiments/imageSequencePlayer/Previz360_[number].jpg");
		this._loadingGenerateFileNameNode.addReplacement("[number]", this._loadingPadFileNameNode.getProperty("outputValue"));
		
		this._image.setPropertyInput("source", this._generateFileNameNode.getProperty("outputValue"));
		
		this.createUpdateFunction("updateCurrentPosition", this._updateCurrentPositionFlow, [this._aimedPosition], [this._currentPosition]);
		
		return this;
	};
	
	objectFunctions._updateCurrentPositionFlow = function(aFlowUpdateNumber) {
		//console.log("dbm.projects.experiments.imagesequenceplayer.ImageSequencePlayer::_updateCurrentPositionFlow");
		var aimedPosition = this._aimedPosition.getValueWithoutFlow();
		
		this._resetPositionSelectors();
		this._changedAimedOffset(aimedPosition);
		
		for(var i = 0; i < this._length; i++) {
			var currentNumber = Math.ceil(0.5*i);
			if(i % 2 === 1) {
				currentNumber *= -1;
			}
			currentNumber = (aimedPosition+currentNumber+this._length)%this._length;
			this._loadingPadFileNameNode.setPropertyInput("inputValue", currentNumber);
			var filePath = this._loadingGenerateFileNameNode.getProperty("outputValue").getValue();
			
			var asset = dbm.singletons.dbmAssetRepository.getAsset(filePath);
			if(asset.getStatus() === AssetStatusTypes.LOADED) {
				this._currentPosition.setValueWithFlow(currentNumber, aFlowUpdateNumber);
				break;
			}
		}
	};
	
	objectFunctions._resetPositionSelectors = function() {
		var currentArray = this._resetPositionObjects;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			currentObject.setCurrentStep(0);
		}
	};
	
	objectFunctions._changedAimedOffset = function(aPosition) {
		var currentArray = this._positionOffsets;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			currentObject.offset = aPosition;
		}
	};
	
	objectFunctions.createOrderSelector = function(aStartPosition, aLength) {
		//console.log("dbm.projects.experiments.imagesequenceplayer.ImageSequencePlayer::createOrderSelector");
		//console.log(aStartPosition, aLength);
		
		this._length = aLength;
		var orderArray = ArrayGenerator.createHalfSplitOrderArray(aLength);
		
		var linearInterpolation = LinearInterpolation.create();
		var forwardOffset = OffsettedInterpolation.create(linearInterpolation, 1, aStartPosition);
		this._positionOffsets.push(forwardOffset);
		var forwardOrderSelector = ModifiedSteppedOrderSelector.create(0, aLength, RepeatedRangeInterpolation.create(forwardOffset, 0, aLength));
		this._resetPositionObjects.push(forwardOrderSelector);
		var backwardOffset = OffsettedInterpolation.create(linearInterpolation, -1, aStartPosition);
		this._positionOffsets.push(backwardOffset);
		var backwardOrderSelector = ModifiedSteppedOrderSelector.create(0, aLength, RepeatedRangeInterpolation.create(backwardOffset, 0, aLength));
		this._resetPositionObjects.push(backwardOrderSelector);
		
		this._orderSelector = SequencedMultipleOrderSelector.create([
			SequencedMultipleOrderSelector.create([
				forwardOrderSelector,
				backwardOrderSelector
			]),
			OrderedOrderSelector.create(orderArray)
		]);
		
		this._reservedData = ReservedData.create(aLength);
		
		return this;
		
	};
	
	objectFunctions.start = function() {
		//console.log("dbm.projects.experiments.imagesequenceplayer.ImageSequencePlayer::start");
		
		this._loader.load();
		this._image.getProperty("display").startUpdating();
	};
	
	objectFunctions._callback_addMoreLoaders = function() {
		console.log("dbm.projects.experiments.imagesequenceplayer.ImageSequencePlayer::_callback_addMoreLoaders");
		
		var currentImageNumber = this._orderSelector.getNextValue(this._reservedData);
		
		if(currentImageNumber !== -1) {
			this._loadingPadFileNameNode.setPropertyInput("inputValue", currentImageNumber);
			var filePath = this._loadingGenerateFileNameNode.getProperty("outputValue").getValue();
			
			var asset = dbm.singletons.dbmAssetRepository.getAsset(filePath);
			asset.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._callback_imageLoaded, [currentImageNumber]));
			
			this._loader.addAsset(asset);
		}
	};
	
	objectFunctions._callback_imageLoaded = function(aIndex) {
		console.log("dbm.projects.experiments.imagesequenceplayer.ImageSequencePlayer::_callback_imageLoaded");
		console.log(aIndex, this._aimedPosition.getValue());
		
		if(aIndex === this._aimedPosition.getValue()) {
			this._aimedPosition.setAsDirty();
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		
		
		this.superCall();
	};
	
	staticFunctions.create = function(aStartPosition, aLength) {
		//console.log("dbm.projects.experiments.imagesequenceplayer.ImageSequencePlayer::create");
		//console.log(aElement);
		
		var newImageSequencePlayer = (new ClassReference()).init();
		newImageSequencePlayer.createOrderSelector(aStartPosition, aLength);
		return newImageSequencePlayer;
	};
});