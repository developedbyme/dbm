import Dbm from "../../../index.js";

export default class SingleArrayValues extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("array", []);
        this.item.requireProperty("items", []);

        let arrayUpdatedCommand = Dbm.commands.callFunction(this._arrayUpdated.bind(this));
        Dbm.flow.addUpdateCommand(this.item.properties.array, arrayUpdatedCommand);

        this._valueUpdatedCommand = Dbm.commands.callFunction(this._valueUpdated.bind(this));
        
    }

    _createItem(aInitialValue = null) {
        let newItem = new Dbm.repository.Item();
        newItem.setId("_dbmInternal/" + Dbm.getInstance().getNextId());
        Dbm.flow.addUpdateCommand(newItem.requireProperty("value", aInitialValue), this._valueUpdatedCommand);

        return newItem;
    }

    push(aValue = null) {
        let item = this._createItem(aValue);
        
        let dataArray = [].concat(this.item.array);
        let itemsArray = [].concat(this.item.items);

        itemsArray.push(item);
        dataArray.push(aValue);
        
        this.item.items = itemsArray;
        this.item.properties.array.getMostUpstreamProperty().value = dataArray;
    }

    removeItem(aItem) {
        //console.log("removeItem");
        //console.log(aItem);

        let dataArray = [].concat(this.item.array);
        let itemsArray = [].concat(this.item.items);

        let index = itemsArray.indexOf(aItem);
        if(index >= 0) {
            itemsArray.splice(index, 1);
            dataArray.splice(index, 1);
            
            this.item.items = itemsArray;
            this.item.properties.array.getMostUpstreamProperty().value = dataArray;
        }
    }

    _movePosition(aFromIndex, aToIndex) {
        //METODO
    }

    moveItem(aItem, aPosition) {
        let index = this.item.items.indexOf(aItem);
        if(index >= 0) {
            this._movePosition(index, aPosition);
        }
    }

    moveUpItem(aItem, aPosition) {

        let index = this.item.items.indexOf(aItem);
        if(index >= 0) {
            if(index > 0) {
                this._movePosition(index, index-1);
            }
        }
    }

    moveDownItem(aItem, aPosition) {
        let index = this.item.items.indexOf(aItem);
        if(index >= 0) {
            if(index < this.item.items.length-1) {
                this._movePosition(index, index+1);
            }
        }
    }

    _arrayUpdated() {
        console.log("_arrayUpdated");

        let dataArray = this.item.array;
        let itemsArray = this.item.items;

        let dataLength = dataArray.length;
        let itemsLength = itemsArray.length;
        let itemChange = dataLength-itemsLength;
        if(itemChange !== 0) {
            itemsArray = [].concat(itemsArray);
            if(itemChange < 0) {
                itemsArray.splice(itemsArray.length, Math.abs(itemChange));
            }
            else if(itemChange > 0) {
                for(let i = 0; i < itemChange; i++) {
                    itemsArray.push(this._createItem(dataArray[itemsLength+i]));
                }
            }
        }
        
        let currentArray = dataArray;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            itemsArray[i].value = currentArray[i];
        }

        if(itemChange !== 0) {
            this.item.items = itemsArray;
        }
        
    }

    _valueUpdated() {
        console.log("_valueUpdated");

        let values = Dbm.utils.ArrayFunctions.mapField(this.item.items, "value");
        console.log(values); 
        this.item.properties.array.getMostUpstreamProperty().value = values;
    }
}