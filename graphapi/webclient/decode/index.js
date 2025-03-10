import Dbm from "../../../index.js";

export {default as DecodeBaseObject} from "./DecodeBaseObject.js";

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
        currentDecoder.item.setValue("copyFields", ["meta/description"]);
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
}