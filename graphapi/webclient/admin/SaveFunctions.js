export const setField = function(aEditor, aItemSaveData) {
    aItemSaveData.setField(aEditor.item.name, aEditor.item.editValue.getValue());
}

export const setUrl = function(aEditor, aItemSaveData) {
    aItemSaveData.createChange("setUrl", {"value": aEditor.item.editValue.getValue()});
}