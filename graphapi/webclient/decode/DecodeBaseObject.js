import Dbm from "../../../index.js";

export default class DecodeBaseObject extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    updateItemWithEncoding(aItem, aData) {
        this.updateItem(aItem, aData);
        aItem.setValue("has/encoding/" +  this.item.encodingType, true);
    }

    updateItem(aItem, aData) {
        if(this.item.copyFields) {
            let currentArray = this.item.copyFields;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let currentField = currentArray[i];
                aItem.setValue(currentField, aData[currentField]);
            }
        }

        if(this.item.copyLink) {
            let currentArray = this.item.copyLink;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let currentField = currentArray[i];
                let currentId = aData[currentField];
                if(currentId) {
                    aItem.setValue(currentField, Dbm.getInstance().repository.getItem(currentId));
                }
                else {
                    aItem.setValue(currentField, null);
                }
            }
        }

        if(this.item.copyLinks) {
            let currentArray = this.item.copyLinks;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let currentField = currentArray[i];
                let currentIds = aData[currentField];
                aItem.setValue(currentField, Dbm.getInstance().repository.getItems(currentIds));
            }
        }
    }
}