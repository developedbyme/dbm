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
    aItemSaveData.createChange("replaceIncomingRelation", {"value": aEditor.item.editValue.getValue(), "type": aEditor.item.type, "objectType": aEditor.item.objectType});
}

export const outgoingRelation = function(aEditor, aItemSaveData) {
    aItemSaveData.createChange("replaceOutgoingRelation", {"value": aEditor.item.editValue.getValue(), "type": aEditor.item.type, "objectType": aEditor.item.objectType});
}

export const multipleIncomingRelations = function(aEditor, aItemSaveData) {
    aItemSaveData.createChange("replaceMultipleIncomingRelations", {"value": aEditor.item.editValue.getValue(), "type": aEditor.item.type, "objectType": aEditor.item.objectType});
}

export const multipleOutgoingRelations = function(aEditor, aItemSaveData) {
    aItemSaveData.createChange("replaceMultipleOutgoingRelations", {"value": aEditor.item.editValue.getValue(), "type": aEditor.item.type, "objectType": aEditor.item.objectType});
}