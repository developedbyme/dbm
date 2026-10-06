import Dbm from "../../index.js";

export const getObjectTypeEditor = function(aTypeName) {
    let objectTypeEditor = Dbm.repository.getItem("admin/objectTypeEditors/" + aTypeName);
    if(!objectTypeEditor.editors) {
        objectTypeEditor.setValue("editors", []);
    }

    return objectTypeEditor;
}

export const addElementToObjectTypeEditor = function(aObjectTypeEditor, aElement) {
    let itemEditor = new Dbm.repository.Item();
    itemEditor.setValue("element", aElement);

    aObjectTypeEditor.addToArray("editors", itemEditor);

    return itemEditor;
}