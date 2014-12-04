/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.audiomanager.mixer.MixerChannel", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.audiomanager.mixer.MixerChannel");
	
	var MixerChannel = dbm.importClass("dbm.core.globalobjects.audiomanager.mixer.MixerChannel");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.audiomanager.mixer.MixerChannel::_init");
		
		this.superCall();
		
		this._name = dbm.singletons.dbmIdManager.getNewId("mixerChannel");
		
		this._masterInput = this.createProperty("masterInput", 1);
		this._input = this.createProperty("input", 1);
		this._output = this.createProperty("output", null);
		
		this.createUpdateFunction("default", this._updateFlow, [this._input, this._masterInput], [this._output]);
		
		return this;
	};
	
	objectFunctions.getName = function() {
		return this._name;
	};
	
	objectFunctions.setName = function(aName) {
		this._name = aName;
	};
	
	objectFunctions._updateFlow = function(aFlowUpdateNumber) {
		//console.log("dbm.core.globalobjects.audiomanager.mixer.MixerChannel::_updateFlow");
		//console.log(this._name, this._input.getValueWithoutFlow(), this._masterInput.getValueWithoutFlow());
		this._output.setValueWithFlow(this._input.getValueWithoutFlow()*this._masterInput.getValueWithoutFlow(), aFlowUpdateNumber);
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._masterInput = null;
		this._input = null;
		this._output = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aMasterInput, aInput) {
		var newMixerChannel = (new ClassReference()).init();
		newMixerChannel.setPropertyInputWithoutNull("masterInput", aMasterInput);
		newMixerChannel.setPropertyInputWithoutNull("input", aInput);
		return newMixerChannel;
	};
});