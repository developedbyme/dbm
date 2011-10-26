dbm.registerClass("com.developedbyme.core.globalobjects.audiomanager.mixer.MixerChannel", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.audiomanager.mixer.MixerChannel");
	
	var MixerChannel = dbm.importClass("com.developedbyme.core.globalobjects.audiomanager.mixer.MixerChannel");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.audiomanager.mixer.MixerChannel::init");
		
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