import Dbm from "../../../index.js";

export {default as DecodeBaseObject} from "./DecodeBaseObject.js";
export {default as Relations} from "./Relations.js";

export const setupDefaultDecoder = function(aName, aFields = [], aSingleLinks = [], aMultipleLinks = [], aSetupCommands = []) {
    let decodePrefix = "graphApi/decode/";

    let decoder = new Dbm.graphapi.webclient.decode.DecodeBaseObject();
    decoder.item.setValue("copyFields", aFields);
    decoder.item.setValue("copyLink", aSingleLinks);
    decoder.item.setValue("copyLinks", aMultipleLinks);
    decoder.item.setValue("setupCommands", aSetupCommands);
    decoder.item.setValue("encodingType", aName);
    decoder.item.register(decodePrefix + aName);

    return decoder;
}

export const fullSetup = function() {
    let decodePrefix = "graphApi/decode/";

    if(process.env.NODE_ENV === "development") {
        {
            let name = "example";
            let currentDecoder = new Dbm.graphapi.webclient.decode.DecodeBaseObject();
            currentDecoder.item.setValue("copyFields", ["identifier"]);
            currentDecoder.item.setValue("encodingType", name);
            currentDecoder.item.register(decodePrefix + name);
        }
    }

    {
        let name = "identifier";
        let currentDecoder = new Dbm.graphapi.webclient.decode.DecodeBaseObject();
        currentDecoder.item.setValue("copyFields", ["identifier"]);
        currentDecoder.item.setValue("encodingType", name);
        currentDecoder.item.register(decodePrefix + name);
    }

    {
        let name = "name";
        let currentDecoder = new Dbm.graphapi.webclient.decode.DecodeBaseObject();
        currentDecoder.item.setValue("copyFields", ["name"]);
        currentDecoder.item.setValue("encodingType", name);
        currentDecoder.item.register(decodePrefix + name);
    }

    {
        let name = "content";
        let currentDecoder = new Dbm.graphapi.webclient.decode.DecodeBaseObject();
        currentDecoder.item.setValue("copyFields", ["content"]);
        currentDecoder.item.setValue("encodingType", name);
        currentDecoder.item.register(decodePrefix + name);
    }

    {
        let name = "title";
        let currentDecoder = new Dbm.graphapi.webclient.decode.DecodeBaseObject();
        currentDecoder.item.setValue("copyFields", ["title"]);
        currentDecoder.item.setValue("encodingType", name);
        currentDecoder.item.register(decodePrefix + name);
    }

    {
        let name = "url";
        let currentDecoder = new Dbm.graphapi.webclient.decode.DecodeBaseObject();
        currentDecoder.item.setValue("copyFields", ["url"]);
        currentDecoder.item.setValue("encodingType", name);
        currentDecoder.item.register(decodePrefix + name);
    }

    {
        let name = "urlRequest";
        let currentDecoder = new Dbm.graphapi.webclient.decode.DecodeBaseObject();
        currentDecoder.item.setValue("copyFields", ["meta/description", "seo/noIndex", "seo/noFollow", "publishDate"]);
        currentDecoder.item.setValue("copyLink", ["category", "translations"]);
        currentDecoder.item.setValue("copyLinks", ["categories"]);
        currentDecoder.item.setValue("encodingType", name);
        currentDecoder.item.register(decodePrefix + name);
    }

    {
        let name = "pageRepresentation";
        let currentDecoder = new Dbm.graphapi.webclient.decode.DecodeBaseObject();
        currentDecoder.item.setValue("copyLink", ["representing"]);
        currentDecoder.item.setValue("encodingType", name);
        currentDecoder.item.register(decodePrefix + name);
    }

    {
        let name = "navigationName";
        let currentDecoder = new Dbm.graphapi.webclient.decode.DecodeBaseObject();
        currentDecoder.item.setValue("copyFields", ["navigationName"]);
        currentDecoder.item.setValue("encodingType", name);
        currentDecoder.item.register(decodePrefix + name);
    }

    {
        let name = "breadcrumb";
        let currentDecoder = new Dbm.graphapi.webclient.decode.DecodeBaseObject();
        currentDecoder.item.setValue("copyLinks", ["breadcrumbs"]);
        currentDecoder.item.setValue("encodingType", name);
        currentDecoder.item.register(decodePrefix + name);
    }

    {
        let name = "type";
        let currentDecoder = new Dbm.graphapi.webclient.decode.DecodeBaseObject();
        currentDecoder.item.setValue("encodingType", name);
        currentDecoder.item.register(decodePrefix + name);
    }

    {
        let name = "image";
        let currentDecoder = new Dbm.graphapi.webclient.decode.DecodeBaseObject();
        currentDecoder.item.setValue("copyFields", ["originalFileName", "path", "url", "resizeUrl", "altText"]);
        currentDecoder.item.setValue("encodingType", name);
        currentDecoder.item.register(decodePrefix + name);
    }

    {
        let name = "visibility";
        let currentDecoder = new Dbm.graphapi.webclient.decode.DecodeBaseObject();
        currentDecoder.item.setValue("copyFields", ["visibility"]);
        currentDecoder.item.setValue("encodingType", name);
        currentDecoder.item.register(decodePrefix + name);
    }

    {
        let name = "representingPage";
        let currentDecoder = new Dbm.graphapi.webclient.decode.DecodeBaseObject();
        currentDecoder.item.setValue("copyLink", ["representingPage"]);
        currentDecoder.item.setValue("encodingType", name);
        currentDecoder.item.register(decodePrefix + name);
    }

    {
        let name = "admin_fields";
        let currentDecoder = new Dbm.graphapi.webclient.decode.DecodeBaseObject();
        currentDecoder.item.setValue("copyFields", ["fields"]);
        currentDecoder.item.setValue("encodingType", name);
        currentDecoder.item.register(decodePrefix + name);
    }

    {
        let name = "objectTypes";
        let currentDecoder = new Dbm.graphapi.webclient.decode.DecodeBaseObject();
        currentDecoder.item.setValue("copyFields", ["objectTypes"]);
        currentDecoder.item.setValue("encodingType", name);
        currentDecoder.item.register(decodePrefix + name);
    }

    {
        let name = "helpSection";
        let currentDecoder = new Dbm.graphapi.webclient.decode.DecodeBaseObject();
        currentDecoder.item.setValue("copyFields", ["question", "title", "link", "description", "linkText"]);
        currentDecoder.item.setValue("copyLink", ["page"]);
        currentDecoder.item.setValue("encodingType", name);
        currentDecoder.item.register(decodePrefix + name);
    }

    {
        let name = "relations";
        let currentDecoder = new Dbm.graphapi.webclient.decode.Relations();
        currentDecoder.item.setValue("encodingType", name);
        currentDecoder.item.register(decodePrefix + name);
    }

    {
        let name = "atLocation";
        let currentDecoder = new Dbm.graphapi.webclient.decode.DecodeBaseObject();
        currentDecoder.item.setValue("copyLink", ["location"]);
        currentDecoder.item.setValue("encodingType", name);
        currentDecoder.item.register(decodePrefix + name);
    }

    {
        let name = "mainImage";
        let currentDecoder = new Dbm.graphapi.webclient.decode.DecodeBaseObject();
        currentDecoder.item.setValue("copyLink", ["image"]);
        currentDecoder.item.setValue("encodingType", name);
        currentDecoder.item.register(decodePrefix + name);
    }

    {
        let name = "location";
        let currentDecoder = new Dbm.graphapi.webclient.decode.DecodeBaseObject();
        currentDecoder.item.setValue("copyFields", ["street", "postCode", "city", "country", "coordinates"]);
        currentDecoder.item.setValue("encodingType", name);
        currentDecoder.item.register(decodePrefix + name);
    }

    {
        let name = "admin_user";
        let currentDecoder = new Dbm.graphapi.webclient.decode.DecodeBaseObject();
        currentDecoder.item.setValue("copyFields", ["name", "username"]);
        currentDecoder.item.setValue("copyLinks", ["roles"]);
        currentDecoder.item.setValue("encodingType", name);
        currentDecoder.item.register(decodePrefix + name);
    }

    setupDefaultDecoder("linkPreview", ["title", "description", "link", "linkText"], ["page"]);
    setupDefaultDecoder("publishDate", ["publishDate"], []);
    setupDefaultDecoder("language", [], ["language"]);
    setupDefaultDecoder("admin_fieldTranslations", ["fields/translations"], []);
    setupDefaultDecoder("translationGroup", [], [], ["pages"]);

    let connectTranslations = function(aItem, aTranslationsName, aOutputName, aDefaultFieldName) {

        let updateFunction = Dbm.flow.updatefunctions.basic.propertyOfWithDefault(aItem.getProperty(aTranslationsName), Dbm.getRepositoryItem("site").properties.currentLanguageCode, aItem.getProperty(aDefaultFieldName));
        aItem.requireProperty(aOutputName, null).connectInput(updateFunction.output.properties.value);

        aItem.requireProperty(aOutputName + "/update", updateFunction);
    }

    setupDefaultDecoder("name_translations", ["name/translations"], [], [], [Dbm.commands.callFunction(connectTranslations, [Dbm.core.source.event("item"), "name/translations", "name/translated", "name"])]);
    setupDefaultDecoder("title_translations", ["title/translations"], [], [], [Dbm.commands.callFunction(connectTranslations, [Dbm.core.source.event("item"), "title/translations", "title/translated", "title"])]);

    let linkUpMenu = function(aItem) {
        console.log("linkUpMenu");
        console.log(aItem);
    }

    setupDefaultDecoder("menuLocation", ["identifier"], ["menu"], []);
    setupDefaultDecoder("menu", ["order"], [], ["menuItems"], [Dbm.commands.callFunction(linkUpMenu, [Dbm.core.source.event("item")])]);
    setupDefaultDecoder("menuItem", ["label", "link"], [], []);
}