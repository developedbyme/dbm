/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.data.ObjectVariablesNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.data.ObjectVariablesNode");
	//"use strict";
	
	//Self reference
	var ObjectVariablesNode = dbm.importClass("dbm.flow.nodes.data.ObjectVariablesNode");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.data.ObjectVariablesNode::_init");
		
		this.superCall();
		
		//METODO: this class needs to be so much better structured so that the whole object istn't passed all the time
		this._defaultPrefix = "parsed_";
		this._object = this.createProperty("object", null).setAlwaysUpdateFlow(true);
		this._parseProperties = this.addDestroyableObject(NamedArray.create(false));
		
		this._defaultUpdateFunction = this.createUpdateFunction("default", this._update, [this._object], []);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.data.ObjectVariablesNode::_update");
		
		var theObject = this._object.getValueWithoutFlow();
		
		if(VariableAliases.isSet(theObject)) {
			var currentArray = this._parseProperties.getNamesArray();
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentName = currentArray[i];
				var currentProperty = this._parseProperties.getObject(currentName);
				
				currentProperty.setValueWithFlow(theObject[currentName], aFlowUpdateNumber);
			}
		}
	};
	
	objectFunctions.getVariableProperty = function(aName) {
		if(this._parseProperties.select(aName)) {
			return this._parseProperties.currentSelectedItem;
		}
		else {
			var newProperty = this.createProperty(this._defaultPrefix + aName, null);
			
			this._defaultUpdateFunction.addOutputConnection(newProperty);
			this._parseProperties.addObject(aName, newProperty);
			this._object.setDependentConnectionsAsDirty();
			return newProperty;
		}
	};
	
	/**
	 * Sets all the references to null.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._object = null;
		this._parseProperties = null;
		this._defaultUpdateFunction = null;
		
		this.superCall();
		
	};
	
	staticFunctions.create = function(aObject) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("object", aObject);
		return newNode;
	};
});