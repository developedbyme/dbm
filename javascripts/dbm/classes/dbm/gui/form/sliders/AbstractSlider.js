/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.form.sliders.AbstractSlider", "dbm.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.form.sliders.AbstractSlider");
	
	var AbstractSlider = dbm.importClass("dbm.gui.form.sliders.AbstractSlider");
	
	var BooleanSwitchedNode = dbm.importClass("dbm.flow.nodes.logic.BooleanSwitchedNode");
	var MousePositionNode = dbm.importClass("dbm.flow.nodes.userinput.MousePositionNode");
	var ConditionNode = dbm.importClass("dbm.flow.nodes.logic.ConditionNode");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var SetPropertyCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.SetPropertyCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	var JavascriptEventIds = dbm.importClass("dbm.constants.htmlevents.JavascriptEventIds");
	var PlaybackExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.PlaybackExtendedEventIds");
	var ButtonExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ButtonExtendedEventIds");
	
	staticFunctions._ACTIVE = "active";
	staticFunctions._SCRUB_ENABLED = "scrubEnabled";
	staticFunctions._SCRUBBING = "scrubbing";
	
	objectFunctions._init = function() {
		//console.log("dbm.gui.form.sliders.AbstractSlider::_init");
		
		this.superCall();
		
		this._canScrub = true;
		this._isActive = false;
		this._clampScrubValue = true;
		this._isScrubbing = this.createProperty("isScrubbing", false);
		this._scrubValue = this.createProperty("scrubValue", 0);
		this._playbackValue = this.createProperty("playbackValue", 0);
		this._noPlaybackSwitchNode = ConditionNode.create("||", this._isScrubbing, true);
		this._switchNode = BooleanSwitchedNode.create(this._noPlaybackSwitchNode.getProperty("outputValue"), this._scrubValue, this._playbackValue);
		this.addDestroyableObject(this._switchNode);
		this.addDestroyableObject(this._noPlaybackSwitchNode);
		this._outputValue = this.createProperty("outputValue", 0);
		this._outputValue.connectInput(this._switchNode.getProperty("outputValue"));
		
		this._minValue = this.createProperty("minValue", 0);
		this._maxValue = this.createProperty("maxValue", 1);
		
		var valueUpdate = this.createGhostProperty("valueUpdate");
		this._display.connectInput(valueUpdate);
		
		this.createUpdateFunction("value", this._updateValueFlow, [this._outputValue, this._minValue, this._maxValue], [valueUpdate]);
		
		this._mousePositionNode = null;
		
		this.getExtendedEvent().createEventLinkGroup(staticFunctions._ACTIVE);
		
		this.getExtendedEvent().addCommandToEvent(PlaybackExtendedEventIds.START_SCRUBBING, SetPropertyCommand.createCommand(this._isScrubbing, true));
		this.getExtendedEvent().addCommandToEvent(PlaybackExtendedEventIds.START_SCRUBBING, SetPropertyCommand.createCommand(this._scrubValue, GetVariableObject.createSelectDataCommand()));
		this.getExtendedEvent().addCommandToEvent(PlaybackExtendedEventIds.UPDATE_SCRUBBING, SetPropertyCommand.createCommand(this._scrubValue, GetVariableObject.createSelectDataCommand()));
		this.getExtendedEvent().addCommandToEvent(PlaybackExtendedEventIds.STOP_SCRUBBING, SetPropertyCommand.createCommand(this._isScrubbing, false));
		this.getExtendedEvent().addCommandToEvent(PlaybackExtendedEventIds.STOP_SCRUBBING, SetPropertyCommand.createCommand(this._scrubValue, GetVariableObject.createSelectDataCommand()));
		
		this.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.PRESS, CallFunctionCommand.createCommand(this, this._startScrubbing, []));
		this.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.RELEASE, CallFunctionCommand.createCommand(this, this._stopScrubbing, []));
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		
		this._mousePositionNode = MousePositionNode.create(aElement.ownerDocument);
		this.addDestroyableObject(this._mousePositionNode);
		this._setupLinkedEvents(aElement);
		
		return this;
	};
	
	objectFunctions._setupLinkedEvents = function(aElement) {
		//MENOTE: should be overridden
	};
	
	objectFunctions.enablePlayback = function() {
		this._noPlaybackSwitchNode.getProperty("inputValue2").setValue(false);
		
		return this;
	};
	
	objectFunctions.connectPlaybackNode = function(aPlaybackNode) {
		
		this._noPlaybackSwitchNode.getProperty("inputValue2").setValue(false);
		this._playbackValue.connectInput(aPlaybackNode.getProperty("outputTime"));
		
		this.getExtendedEvent().addCommandToEvent(PlaybackExtendedEventIds.START_SCRUBBING, CallFunctionCommand.createCommand(aPlaybackNode, aPlaybackNode.startScrubbing, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(PlaybackExtendedEventIds.UPDATE_SCRUBBING, CallFunctionCommand.createCommand(aPlaybackNode, aPlaybackNode.updateScrubbing, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(PlaybackExtendedEventIds.STOP_SCRUBBING, CallFunctionCommand.createCommand(aPlaybackNode, aPlaybackNode.stopScrubbing, [GetVariableObject.createSelectDataCommand()]));
		
		var minValue = aPlaybackNode.getProperty("minTime").getValue();
		if(isFinite(minValue)) {
			this._minValue.setValue(minValue);
		}
		var maxValue = aPlaybackNode.getProperty("maxTime").getValue();
		if(isFinite(maxValue)) {
			this._maxValue.setValue(maxValue);
		}
	};
	
	objectFunctions.connectVideoView = function(aVideoView) {
		
		this._noPlaybackSwitchNode.getProperty("inputValue2").setValue(false);
		this._playbackValue.connectInput(aVideoView.getProperty("outputTime"));
		
		this.getExtendedEvent().addCommandToEvent(PlaybackExtendedEventIds.START_SCRUBBING, CallFunctionCommand.createCommand(aVideoView, aVideoView.startScrubbing, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(PlaybackExtendedEventIds.UPDATE_SCRUBBING, CallFunctionCommand.createCommand(aVideoView, aVideoView.updateScrubbing, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(PlaybackExtendedEventIds.STOP_SCRUBBING, CallFunctionCommand.createCommand(aVideoView, aVideoView.stopScrubbing, [GetVariableObject.createSelectDataCommand()]));
		
	};
	
	objectFunctions.activate = function() {
		//console.log("dbm.gui.form.sliders.AbstractSlider::activate");
		this._isActive = true;
		
		this.getExtendedEvent().activateJavascriptEventLink(ClassReference._ACTIVE);
		this._display.startUpdating();
		
		if(this._canScrub) {
			this.getExtendedEvent().activateJavascriptEventLink(ClassReference._SCRUB_ENABLED);
			this._mousePositionNode.start();
		}
		
		return this;
	};
	
	objectFunctions.deactivate = function() {
		//console.log("dbm.gui.form.sliders.AbstractSlider::deactivate");
		this._isActive = false;
		
		this.getExtendedEvent().deactivateJavascriptEventLink(ClassReference._ACTIVE);
		this._display.stopUpdating();
		
		if(this._canScrub) {
			this.getExtendedEvent().deactivateJavascriptEventLink(ClassReference._SCRUB_ENABLED);
			this._mousePositionNode.stop();
		}
		
		return this;
	};
	
	objectFunctions._clampCurrentScrubValue = function(aValue, aMinValue, aMaxValue) {
		if(this._clampScrubValue) {
			return Math.max(aMinValue, Math.min(aMaxValue, aValue));
		}
		return aValue;
	};
	
	objectFunctions._getCurrentScrubValue = function() {
		//MENOTE: should be overridden
		return 0;
	};
	
	objectFunctions._startScrubbing = function() {
		//console.log("dbm.gui.form.sliders.AbstractSlider::_startScrubbing");
		this.getExtendedEvent().perform(PlaybackExtendedEventIds.START_SCRUBBING, this._getCurrentScrubValue());
		dbm.singletons.dbmUpdateManager.addUpdater(this, "updateInput");
		this.getExtendedEvent().activateJavascriptEventLink(ClassReference._SCRUBBING);
	};
	
	objectFunctions._updateScrubbing = function() {
		//console.log("dbm.gui.form.sliders.AbstractSlider::_updateScrubbing");
		this.getExtendedEvent().perform(PlaybackExtendedEventIds.UPDATE_SCRUBBING, this._getCurrentScrubValue());
	};
	
	objectFunctions._stopScrubbing = function() {
		//console.log("dbm.gui.form.sliders.AbstractSlider::_stopScrubbing");
		
		if(this._playbackValue.canBeSet()) {
			this._playbackValue.setValue(this._outputValue.getValue());
		}
		
		dbm.singletons.dbmUpdateManager.removeUpdater(this, "updateInput");
		this.getExtendedEvent().deactivateJavascriptEventLink(ClassReference._SCRUBBING);
		this.getExtendedEvent().perform(PlaybackExtendedEventIds.STOP_SCRUBBING, this._getCurrentScrubValue());
	};
	
	objectFunctions.updateTime = function(aTime, aFrame) {
		//console.log("dbm.gui.form.sliders.AbstractSlider::updateTime");
		if(this._isScrubbing.getValue()) {
			this._updateScrubbing();
		}
		else {
			//MENOTE: this case should never happend
		}
	};
	
	objectFunctions._updateValueFlow = function(aFlowUpdateNumber) {
		//MENOTE: should be overridden
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._isScrubbing = null;
		this._scrubValue = null;
		this._playbackValue = null;
		this._noPlaybackSwitchNode = null;
		this._switchNode = null;
		this._outputValue = null;
		this._display = null;
		
		this._minValue =  null;
		this._maxValue =  null;
		
		this._mousePositionNode = null;
		
		this.superCall();
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case PlaybackExtendedEventIds.START_SCRUBBING:
			case PlaybackExtendedEventIds.UPDATE_SCRUBBING:
			case PlaybackExtendedEventIds.STOP_SCRUBBING:
			case ButtonExtendedEventIds.PRESS:
			case ButtonExtendedEventIds.RELEASE:
				return true;
		}
		
		return this.superCall(aName);
	};
});