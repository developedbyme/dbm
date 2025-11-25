import Dbm from "../../../index.js";

export default class ItemEditor extends Dbm.core.BaseObject {

    _construct() {
        super._construct();

        this.item.requireProperty("status", "none");
        this.item.requireProperty("editors", []);

        let anyChange = Dbm.flow.updatefunctions.logic.any();
        
        this.item.requireProperty("anyChange", anyChange);
        this.item.requireProperty("changed", false).connectInput(anyChange.output.properties.value);
    }

    getEditor(aField) {
        return this.item["editor_" + aField];
    }

    addEditor(aName, aInitialValue, aSaveFunction, aUpdateEncoding = null) {
        let valueEditor = this.item["editor_" + aName];
        if(!valueEditor) {
            valueEditor = new Dbm.graphapi.webclient.admin.ValueEditor();
            valueEditor.item.editValue.setInitialValue(aInitialValue);

            valueEditor.item.setValue("itemEditor", this.item);
            valueEditor.item.setValue("name", aName);
            valueEditor.item.setValue("updateEncoding", aUpdateEncoding);

            this.item.anyChange.addCheck(valueEditor.item.properties.changed);
            this.item.setValue("editor_" + aName, valueEditor); 
            this.item.editors = [].concat(this.item.editors, valueEditor);
            
            valueEditor.addSaveFunction(aSaveFunction);
        }

        return valueEditor;
    }

    addFieldEditor(aField, aInitialValue, aUpdateEncoding = null) {
        return this.addEditor(aField, aInitialValue, Dbm.graphapi.webclient.admin.SaveFunctions.setField, aUpdateEncoding);
    }

    getAdminFieldEditor(aField) {
        let item = this.item.editedItem;
        
        let initialDataPath = "fields." + aField;
        let initialData = Dbm.objectPath(item, initialDataPath);

        return this.addFieldEditor(aField, initialData);
    }

    addFieldTranslationEditor(aField, aLanguage, aInitialValue, aUpdateEncoding = null) {
        let name = "translation_" + aField + "_" + aLanguage;
        let valueEditor = this.item["editor_" + name];
        if(!valueEditor) {
            valueEditor = this.addEditor(name, aInitialValue, Dbm.graphapi.webclient.admin.SaveFunctions.setFieldTranslation, aUpdateEncoding);
            valueEditor.item.setValue("name", aField);
            valueEditor.item.setValue("language", aLanguage);
        }
        
        return valueEditor;
    }

    _addRelationEditor(aName, aType, aObjectType, aInitialValue, aSaveFunction, aUpdateEncoding = null) {
        let valueEditor = this.item["editor_relation_" + aName];
        if(!valueEditor) {
            valueEditor = new Dbm.graphapi.webclient.admin.ValueEditor();
            valueEditor.item.editValue.setInitialValue(aInitialValue);

            valueEditor.item.setValue("itemEditor", this.item);
            valueEditor.item.setValue("type", aType);
            valueEditor.item.setValue("objectType", aObjectType);
            valueEditor.item.setValue("updateEncoding", aUpdateEncoding);

            this.item.anyChange.addCheck(valueEditor.item.properties.changed);
            this.item.setValue("editor_relation_" + aName, valueEditor); 
            this.item.editors = [].concat(this.item.editors, valueEditor);
            
            valueEditor.addSaveFunction(aSaveFunction);
        }

        return valueEditor;
    }

    addIncomingRelationEditor(aType, aObjectType, aInitialValue, aUpdateEncoding = null) {
        let name = "in_" + aType + "_" + aObjectType;
        return this._addRelationEditor(name, aType, aObjectType, aInitialValue, Dbm.graphapi.webclient.admin.SaveFunctions.incomingRelation, aUpdateEncoding);
    }

    getDefaultIncomingRelationEditor(aType, aObjectType) {
        let item = this.item.editedItem;
        
        let relations = Dbm.utils.ArrayFunctions.filterByField(Dbm.objectPath(item, "relations/in." + aType + ".objects"), "objectTypes", aObjectType, "arrayContains");
        let relation = (relations && relations.length) ? relations[0].id : null;
        
        return this.addIncomingRelationEditor(aType, aObjectType, relation, ["relations"]);     
    }

    addOutgoingRelationEditor(aType, aObjectType, aInitialValue, aUpdateEncoding = null) {
        let name = "out_" + aType + "_" + aObjectType;
        return this._addRelationEditor(name, aType, aObjectType, aInitialValue, Dbm.graphapi.webclient.admin.SaveFunctions.outgoingRelation, aUpdateEncoding);
    }

    getDefaultOutgoingRelationEditor(aType, aObjectType) {
        let item = this.item.editedItem;
        
        let relations = Dbm.utils.ArrayFunctions.filterByField(Dbm.objectPath(item, "relations/out." + aType + ".objects"), "objectTypes", aObjectType, "arrayContains");
        let relation = (relations && relations.length) ? relations[0].id : null;
        
        return this.addOutgoingRelationEditor(aType, aObjectType, relation, ["relations"]);     
    }

    _addMultipleRelationsEditor(aName, aType, aObjectType, aInitialValue, aSaveFunction, aUpdateEncoding = null) {
        let valueEditor = this.item["editor_relation_" + aName];
        if(!valueEditor) {
            valueEditor = new Dbm.graphapi.webclient.admin.ValueEditor();
            valueEditor.item.editValue.setInitialValue(aInitialValue);

            valueEditor.item.setValue("itemEditor", this.item);
            valueEditor.item.setValue("type", aType);
            valueEditor.item.setValue("objectType", aObjectType);
            valueEditor.item.setValue("updateEncoding", aUpdateEncoding);

            this.item.anyChange.addCheck(valueEditor.item.properties.changed);
            this.item.setValue("editor_multipleRelations_" + aName, valueEditor); 
            this.item.editors = [].concat(this.item.editors, valueEditor);
            
            valueEditor.addSaveFunction(aSaveFunction);
        }

        return valueEditor;
    }

    addMultipleIncomingRelationsEditor(aType, aObjectType, aInitialValue, aUpdateEncoding = null) {
        let name = "in_" + aType + "_" + aObjectType;
        return this._addMultipleRelationsEditor(name, aType, aObjectType, aInitialValue, Dbm.graphapi.webclient.admin.SaveFunctions.multipleIncomingRelations, aUpdateEncoding);
    }

    addMultipleOutgoingRelationsEditor(aType, aObjectType, aInitialValue, aUpdateEncoding = null) {
        let name = "out_" + aType + "_" + aObjectType;
        return this._addMultipleRelationsEditor(name, aType, aObjectType, aInitialValue, Dbm.graphapi.webclient.admin.SaveFunctions.multipleOutgoingRelations, aUpdateEncoding);
    }

    getAdminMultipleIncomingRelationsEditor(aType, aObjectType) {
        let name = "in_" + aType + "_" + aObjectType;
        let valueEditor = this.item["editor_multipleRelations_" + name];
        if(!valueEditor) {
            let relations = Dbm.utils.ArrayFunctions.filterByField(Dbm.objectPath(this.item.editedItem, "relations/in." + aType + ".objects"), "objectTypes", aObjectType, "arrayContains");
            let ids = Dbm.utils.ArrayFunctions.mapField(relations, "id");

            valueEditor = this.addMultipleIncomingRelationsEditor(aType, aObjectType, ids, "relations");
        }

        return valueEditor;
    }

    getAdminMultipleOutgoingRelationsEditor(aType, aObjectType) {
        let name = "out_" + aType + "_" + aObjectType;
        let valueEditor = this.item["editor_multipleRelations_" + name];
        if(!valueEditor) {
            let relations = Dbm.utils.ArrayFunctions.filterByField(Dbm.objectPath(this.item.editedItem, "relations/in." + aType + ".objects"), "objectTypes", aObjectType, "arrayContains");
            let ids = Dbm.utils.ArrayFunctions.mapField(relations, "id");

            valueEditor = this.addMultipleOutgoingRelationsEditor(aType, aObjectType, ids, "relations");
        }

        return valueEditor;
    }
    

    getVisibilityEditor(aInitialValue) {
        let name = "visibility";
        let valueEditor = this.item["visibility"];
        if(!valueEditor) {
            valueEditor = new Dbm.graphapi.webclient.admin.ValueEditor();
            valueEditor.item.editValue.setInitialValue(aInitialValue);

            valueEditor.item.setValue("itemEditor", this.item);
            valueEditor.item.setValue("updateEncoding", "visibility");

            this.item.anyChange.addCheck(valueEditor.item.properties.changed);
            this.item.setValue(name, valueEditor); 
            this.item.editors = [].concat(this.item.editors, valueEditor);
            
            valueEditor.addSaveFunction(Dbm.graphapi.webclient.admin.SaveFunctions.setVisibility);
        }

        return valueEditor;
    }

    getIdentiferEditor(aInitialValue) {
        let name = "identifer";
        let valueEditor = this.item["identifer"];
        if(!valueEditor) {
            valueEditor = new Dbm.graphapi.webclient.admin.ValueEditor();
            valueEditor.item.editValue.setInitialValue(aInitialValue);

            valueEditor.item.setValue("itemEditor", this.item);
            valueEditor.item.setValue("updateEncoding", "identifer");

            this.item.anyChange.addCheck(valueEditor.item.properties.changed);
            this.item.setValue(name, valueEditor); 
            this.item.editors = [].concat(this.item.editors, valueEditor);
            
            valueEditor.addSaveFunction(Dbm.graphapi.webclient.admin.SaveFunctions.setIdentifier);
        }

        return valueEditor;
    }

    getUrlEditor(aInitialValue) {
        let name = "url";
        let valueEditor = this.item["url"];
        if(!valueEditor) {
            valueEditor = new Dbm.graphapi.webclient.admin.ValueEditor();
            valueEditor.item.editValue.setInitialValue(aInitialValue);

            valueEditor.item.setValue("itemEditor", this.item);
            valueEditor.item.setValue("updateEncoding", "url");

            this.item.anyChange.addCheck(valueEditor.item.properties.changed);
            this.item.setValue(name, valueEditor); 
            this.item.editors = [].concat(this.item.editors, valueEditor);
            
            valueEditor.addSaveFunction(Dbm.graphapi.webclient.admin.SaveFunctions.setUrl);
        }

        return valueEditor;
    }

    getAdminUrlEditor() {
        let item = this.item.editedItem;
        let value = Dbm.objectPath(item, "url");
        
        return this.getUrlEditor(value);     
    }

    addCommandsToSaveData(aSaveData) {

        let editedItemId = Dbm.objectPath(this.item, "editedItem.id");
        let itemSaveData = aSaveData.getItemSaveData(editedItemId);

        let currentArray = this.item.editors;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentEditor = currentArray[i];
            
            if(currentEditor.item.changed) {
                currentEditor.addCommandsToSaveData(aSaveData);
            }
        }

        itemSaveData.addStartCommand(Dbm.commands.setProperty(this.item.properties.status, "loading"));
        itemSaveData.addSavedCommand(Dbm.commands.setProperty(this.item.properties.status, "none"));
    }

    getSaveData() {
        let saveData = new Dbm.graphapi.webclient.admin.SaveData();
        this.addCommandsToSaveData(saveData);
        return saveData;
    }

    save() {
        let saveData = this.getSaveData();
        saveData.save();
    }
}