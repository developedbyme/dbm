import Dbm from "../../index.js";

export const getObjectTypeEditor = function(aTypeName) {
    let objectTypeEditor = Dbm.repository.getItem("admin/objectTypeEditors/" + aTypeName);
    if(!objectTypeEditor.editors) {
        objectTypeEditor.setValue("editors", []);
    }

    return objectTypeEditor;
}