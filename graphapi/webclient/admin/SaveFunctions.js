import Dbm from "../../../index.js";

export const setField = function(aEditor, aItemSaveData) {
    aItemSaveData.setField(aEditor.item.name, aEditor.item.editValue.getValue());
}

export const setUrl = function(aEditor, aItemSaveData) {
    aItemSaveData.createChange("setUrl", {"value": aEditor.item.editValue.getValue()});
}

export const setIdentifier = function(aEditor, aItemSaveData) {
    aItemSaveData.createChange("setIdentifier", {"value": aEditor.item.editValue.getValue()});
}

export const setVisibility = function(aEditor, aItemSaveData) {
    aItemSaveData.createChange("setVisibility", {"value": aEditor.item.editValue.getValue()});
}

export const incomingRelation = function(aEditor, aItemSaveData) {
    let id = aEditor.item.editValue.getValue();

    aItemSaveData.createChange("replaceIncomingRelation", {"value": id, "type": aEditor.item.type, "objectType": aEditor.item.objectType});
}

export const outgoingRelation = function(aEditor, aItemSaveData) {
    let id = aEditor.item.editValue.getValue();

    aItemSaveData.createChange("replaceOutgoingRelation", {"value": id, "type": aEditor.item.type, "objectType": aEditor.item.objectType});
}

export const multipleIncomingRelations = function(aEditor, aItemSaveData) {
    let ids = Dbm.utils.ArrayFunctions.removeValues(aEditor.item.editValue.getValue(), [0, null, undefined]);

    aItemSaveData.createChange("replaceMultipleIncomingRelations", {"value": ids, "type": aEditor.item.type, "objectType": aEditor.item.objectType});
}

export const multipleOutgoingRelations = function(aEditor, aItemSaveData) {
    let ids = Dbm.utils.ArrayFunctions.removeValues(aEditor.item.editValue.getValue(), [0, null, undefined]);

    aItemSaveData.createChange("replaceMultipleOutgoingRelations", {"value": ids, "type": aEditor.item.type, "objectType": aEditor.item.objectType});
}