import Dbm from "../../index.js";
import {createElement} from "react";

export * as gallery from "./gallery/index.js";
export * as content from "./content/index.js";
export * as admin from "./admin/index.js";
export * as faq from "./faq/index.js";

export {default as Image} from "./Image.js";

export let createToolConfiguration = function(aId, aName, aInitialData = {}, aSanitizeSettings = {}, aIcon = null) {

    class DynamicEditorBlock extends Dbm.react.admin.editor.EditorBlock {

        _construct() {
            super._construct();
        }

        static get toolbox() {

            return {
                title: aName,
                icon: aIcon
            };
        }

        static get sanitize() {
            return aSanitizeSettings;
        }
    }

    let returnObject = {
        "class": DynamicEditorBlock,
        "config": {
            "module": aId,
            "name": aName,
        },
        "data": aInitialData,
        "inlineToolbar": true,
        "toolbox": {
            title: aName,
            icon: aIcon
        }
    }

    return returnObject;
}

export let registerEditorBlock = function(aModuleName, aName, aEditorModule = null, aInitialData = {}, aSanitizeSettings = {}) {

    if(!aEditorModule) {
        aEditorModule = getDefaultEditorModule();
    }

    let editorConfigItem = Dbm.getInstance().repository.getItem("editorjs");
    let tools = editorConfigItem.tools ? {...editorConfigItem.tools} : {};

    let editorItem = new Dbm.repository.Item();
    editorItem.setValue("controller", aEditorModule);
    editorItem.register("moduleCreators/blocks/editor/" + aModuleName);

    tools[aModuleName] = createToolConfiguration(aModuleName, aName, aInitialData, aSanitizeSettings);

    editorConfigItem.setValue("tools", tools);
}

export let registerFrontBlock = function(aModuleName, aElement) {
    
    let elementItem = new Dbm.repository.Item();
    elementItem.setValue("element", aElement);
    elementItem.register("blocks/" + aModuleName);
}

export let registerBlock = function(aModuleName, aName, aElement, aEditorElement = null, aInitialData = {}, aSanitizeSettings = {}) {

    let editorModule;
    if(!aEditorElement) {
        editorModule = getDefaultEditorModule();
    }
    else {
        editorModule = new Dbm.react.modules.ModuleCreator();
        editorModule.setMainElement(aEditorElement);
    }

    registerEditorBlock(aModuleName, aName, editorModule, aInitialData, aSanitizeSettings);
    registerFrontBlock(aModuleName, aElement);
} 

export let getDefaultEditorModule = function() {
    let moduleItem = Dbm.getInstance().repository.getItem("editorjs");

    let displayNameModule = moduleItem.defaultEditor;
    if(!displayNameModule) {
        displayNameModule = new Dbm.react.modules.ModuleCreator();

        let displayNameEditor = createElement(Dbm.react.admin.editor.EditorBlockName, {});
        displayNameModule.setMainElement(displayNameEditor);

        moduleItem.setValue("defaultEditor", displayNameModule);
    }

    return displayNameModule;
}

export let registerAllBlocks = function() {
    registerBlock("cookie/settings", "Cookie settings", createElement(Dbm.react.cookies.CookieSettings));
    registerBlock("login/loginForm", "Login form", createElement(Dbm.react.login.LoginForm));
    registerBlock("admin/pageList", "Admin / Page list", createElement(Dbm.react.admin.pages.PageList), createElement(Dbm.react.admin.pages.PageList));
    registerBlock("admin/website", "Admin / Edit website", createElement(Dbm.react.admin.website.EditWebsite));

    {
        let editor = createElement(Dbm.react.admin.editor.EditorBlockName, {},
            createElement(Dbm.react.form.LabelledArea, {label: "Object type"},
                createElement(Dbm.react.admin.editor.fields.TextField, {name: "objectType"})
            ),
            createElement("div", {className: "spacing medium"}),
            createElement(Dbm.react.form.LabelledArea, {label: "Encodings"},
                createElement(Dbm.react.admin.editor.fields.TextField, {name: "encodings"})
            ),
            createElement("div", {className: "spacing medium"}),
            createElement(Dbm.react.form.LabelledArea, {label: "Name field"},
                createElement(Dbm.react.admin.editor.fields.TextField, {name: "nameField"})
            ),
            createElement("div", {className: "spacing medium"}),
            createElement(Dbm.react.form.LabelledArea, {label: "Visibility"},
                createElement(Dbm.react.admin.editor.fields.SelectionField, {name: "visibility"},
                    createElement("option", {value: null}, "Default"),
                    createElement("option", {value: "draft"}, "Draft"),
                    createElement("option", {value: "public"}, "Public"),
                    createElement("option", {value: "private"}, "Private"),
                )
            ),
        );

        registerBlock("admin/objects/list", "Admin / Object list", createElement(Dbm.react.blocks.admin.objects.List), editor);
        
    }
    
    registerBlock("admin/objects/edit", "Admin / Edit object", createElement(Dbm.react.blocks.admin.objects.Edit));
    registerBlock("admin/objects/apiCommands", "Admin / Object API commands", createElement(Dbm.react.blocks.admin.objects.RunObjectCommands));

    {
        let editor = createElement(Dbm.react.admin.editor.EditorBlockName, {},
            createElement(Dbm.react.form.LabelledArea, {label: "Image 1"},
                createElement(Dbm.react.admin.editor.fields.ImageField, {name: "image1"})
            ),
            createElement("div", {className: "spacing medium"}),
            createElement(Dbm.react.form.LabelledArea, {label: "Image 2"},
                createElement(Dbm.react.admin.editor.fields.ImageField, {name: "image2"})
            ),
            createElement("div", {className: "spacing medium"}),
            createElement(Dbm.react.form.LabelledArea, {label: "Image 3"},
                createElement(Dbm.react.admin.editor.fields.ImageField, {name: "image3"})
            ),
            createElement("div", {className: "spacing medium"}),
            createElement(Dbm.react.form.LabelledArea, {label: "Image 4"},
                createElement(Dbm.react.admin.editor.fields.ImageField, {name: "image4"})
            ),
            createElement("div", {className: "spacing medium"})
        );
        registerBlock("gallery/imageGallery", "Image gallery", createElement(Dbm.react.blocks.gallery.ImageGallery, {}), editor);
    }

    {
        let editor = createElement(Dbm.react.admin.editor.EditorBlockName, {},
            createElement(Dbm.react.form.LabelledArea, {label: "Image 1"},
                createElement(Dbm.react.admin.editor.fields.ImageField, {name: "image1"})
            ),
            createElement("div", {className: "spacing medium"}),
            createElement(Dbm.react.form.LabelledArea, {label: "Image 2"},
                createElement(Dbm.react.admin.editor.fields.ImageField, {name: "image2"})
            )
        );
        registerBlock("gallery/doubleImage", "Double image", createElement(Dbm.react.blocks.gallery.DoubleImage, {}), editor);
    }

    {
        let editor = createElement(Dbm.react.admin.editor.EditorBlockName, {},
            createElement(Dbm.react.form.LabelledArea, {label: "Image"},
                createElement(Dbm.react.admin.editor.fields.ImageField, {name: "image"})
            ),
            createElement("div", {className: "spacing medium"}),
            createElement(Dbm.react.form.LabelledArea, {label: "Title"},
                createElement(Dbm.react.admin.editor.fields.TextField, {name: "title"})
            ),
            createElement("div", {className: "spacing medium"}),
            createElement(Dbm.react.form.LabelledArea, {label: "Content"},
                createElement(Dbm.react.admin.editor.fields.RichTextField, {name: "text"})
            ),
            createElement("div", {className: "spacing medium"}),
            createElement(Dbm.react.form.LabelledArea, {label: "Url"},
                createElement(Dbm.react.admin.editor.fields.TextField, {name: "url"})
            ),
            createElement("div", {className: "spacing medium"}),
            createElement(Dbm.react.form.LabelledArea, {label: "Button"},
                createElement(Dbm.react.admin.editor.fields.TextField, {name: "buttonText"})
            )
        );
        registerBlock("content/card", "Card", createElement(Dbm.react.blocks.content.Card, {}), editor, {}, {"title": true, "text": true, "button": true});
    }

    {
        let editor = createElement(Dbm.react.admin.editor.EditorBlockName, {},
            createElement(Dbm.react.form.LabelledArea, {label: "Content block"},
                createElement(Dbm.react.admin.editor.fields.SelectObjectField, {name: "contentBlock", "objectType": "contentBlock"})
            )
        );
        registerBlock("content/contentBlock", "Content block", createElement(Dbm.react.blocks.content.ContentBlock, {}), editor, {}, {});
    }

    {
        let editor = createElement(Dbm.react.admin.editor.EditorBlockName, {},
            createElement(Dbm.react.form.LabelledArea, {label: "Text 1"},
                createElement(Dbm.react.admin.editor.fields.TextField, {name: "text1"})
            ),
            createElement("div", {className: "spacing medium"}),
            createElement(Dbm.react.form.LabelledArea, {label: "Url 1"},
                createElement(Dbm.react.admin.editor.fields.TextField, {name: "url1"})
            ),
            createElement("div", {className: "spacing medium"}),
            createElement(Dbm.react.form.LabelledArea, {label: "Text 2"},
                createElement(Dbm.react.admin.editor.fields.TextField, {name: "text2"})
            ),
            createElement("div", {className: "spacing medium"}),
            createElement(Dbm.react.form.LabelledArea, {label: "Url 2"},
                createElement(Dbm.react.admin.editor.fields.TextField, {name: "url2"})
            ),
        );
        registerBlock("faq/askAQuestion", "FAQ / Ask a question", createElement(Dbm.react.blocks.faq.AskAQuestion, {}), editor, {}, {"text1": true, "text2": true});
    }

    {
        let itemEditor = Dbm.getInstance().repository.getItem("admin/itemEditors/title");
        itemEditor.setValue("element", createElement(Dbm.react.admin.objects.itemeditors.Title, {}));
    }

    {
        let itemEditor = Dbm.getInstance().repository.getItem("admin/itemEditors/content");
        itemEditor.setValue("element", createElement(Dbm.react.admin.objects.itemeditors.Content, {}));
    }

    {
        let itemEditor = Dbm.getInstance().repository.getItem("admin/itemEditors/name");
        itemEditor.setValue("element", createElement(Dbm.react.admin.objects.itemeditors.Name, {}));
    }

    {
        let itemEditor = Dbm.getInstance().repository.getItem("admin/itemEditors/link");
        itemEditor.setValue("element", createElement(Dbm.react.admin.objects.itemeditors.Link, {}));
    }

    {
        let itemEditor = Dbm.getInstance().repository.getItem("admin/itemEditors/visibility");
        itemEditor.setValue("element", createElement(Dbm.react.admin.objects.itemeditors.Visibility, {}));
    }

    {
        let itemEditor = Dbm.getInstance().repository.getItem("admin/itemEditors/linkedPage");
        itemEditor.setValue("element", createElement(Dbm.react.admin.objects.itemeditors.LinkedPage, {}));
    }

    {
        let itemEditor = Dbm.getInstance().repository.getItem("admin/itemEditors/question");
        itemEditor.setValue("element", createElement(Dbm.react.admin.objects.itemeditors.Question, {}));
    }
    
    {
        let objectTypeEditor = Dbm.getInstance().repository.getItem("admin/objectTypeEditors/page");
        if(!objectTypeEditor.editors) {
            objectTypeEditor.setValue("editors", []);
        }

        let newArray = [].concat(objectTypeEditor.editors);
        newArray.push(Dbm.getInstance().repository.getItem("admin/itemEditors/title"));
        newArray.push(Dbm.getInstance().repository.getItem("admin/itemEditors/content"));
        objectTypeEditor.editors = newArray;
    }

    {
        let objectTypeEditor = Dbm.getInstance().repository.getItem("admin/objectTypeEditors/contentBlock");
        if(!objectTypeEditor.editors) {
            objectTypeEditor.setValue("editors", []);
        }

        let newArray = [].concat(objectTypeEditor.editors);
        newArray.push(Dbm.getInstance().repository.getItem("admin/itemEditors/name"));
        newArray.push(Dbm.getInstance().repository.getItem("admin/itemEditors/content"));
        objectTypeEditor.editors = newArray;
    }

    {
        let objectTypeEditor = Dbm.getInstance().repository.getItem("admin/objectTypeEditors/helpSection");
        if(!objectTypeEditor.editors) {
            objectTypeEditor.setValue("editors", []);
        }

        let newArray = [].concat(objectTypeEditor.editors);
        newArray.push(Dbm.getInstance().repository.getItem("admin/itemEditors/question"));
        newArray.push(Dbm.getInstance().repository.getItem("admin/itemEditors/title"));
        newArray.push(Dbm.getInstance().repository.getItem("admin/itemEditors/content"));
        newArray.push(Dbm.getInstance().repository.getItem("admin/itemEditors/linkedPage"));
        newArray.push(Dbm.getInstance().repository.getItem("admin/itemEditors/link"));
        newArray.push(Dbm.getInstance().repository.getItem("admin/itemEditors/visibility"));
        objectTypeEditor.editors = newArray;
    }
}