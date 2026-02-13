import Dbm from "../index.js";

export default class NamedArray extends Dbm.core.BaseObject {
    
    _construct() {
		super._construct();
		
		this.item.requireProperty("allRecords", []);
		this.item.requireProperty("records", new Dbm.repository.Item());

		{
			let updateFunction = Dbm.flow.updatefunctions.basic.transformValue(this.item.properties.allRecords, this._transform_updateKeys.bind(this));
			this.item.requireProperty("keys", []).connectInput(updateFunction.output.properties.value);
		}

		{
			let updateFunction = Dbm.flow.updatefunctions.basic.transformValue(this.item.properties.allRecords, this._transform_updateValueProperties.bind(this));
			this.item.requireProperty("valueProperties", []).connectInput(updateFunction.output.properties.value);
		}
		
		{
			let updateFunction = Dbm.flow.updatefunctions.basic.transformValue(this.item.properties.valueProperties, this._transform_updateValues.bind(this));
			updateFunction.input.register("_valueChange", 0).connectInput(this.item.requireProperty("_valueChange", 0));
			this.item.requireProperty("values", []).connectInput(updateFunction.output.properties.value);
		}

		this._valueUpdateCommand = Dbm.commands.increaseProperty(this.item.properties._valueChange);
		
		return this;
	}

	_transform_updateKeys(aRecords) {
		return Dbm.utils.ArrayFunctions.mapField(aRecords, "key");
	}

	_transform_updateValueProperties(aRecords) {
		return Dbm.utils.ArrayFunctions.mapField(aRecords, "value");
	}

	_transform_updateValues(aProperties) {
		return Dbm.utils.ArrayFunctions.mapField(aProperties, "value");
	}
	
	addValue(aKey, aValue) {

		let property = this.item.records.requireProperty(aKey);
		property.setOrConnect(aValue);
		property.addUpdate(this._valueUpdateCommand);

		let record = {key: aKey, value: property};

		this.item.addToArray("allRecords", record);
	}

	addUnnamedValue(aValue) {
		let key = "internal/" + Dbm.getInstance().getNextId();
		this.addValue(key, aValue);
	}

	setValue(aKey, aValue) {
		let existingRecord = Dbm.utils.ArrayFunctions.getItemByIfExists(this.item.allRecords, "key", aKey);
		if(existingRecord) {
			existingRecord.value.value = aValue;
		}
		else {
			this.addValue(aKey, aValue);
		}
	}

	removeValue() {
		//METODO
	}

	getAsObject() {
		console.log("getAsObject");
		let returnObject = {};

		let currentArray = this.item.allRecords;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentRecord = currentArray[i];

			console.log(currentRecord["key"], currentRecord["value"].value);
			returnObject[currentRecord["key"]] = currentRecord["value"].value;
		}

		console.log(returnObject);

		return returnObject;
	}
}