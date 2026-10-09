import Dbm from "../../../index.js";

export {default as WprrApiParser} from "./WprrApiParser.js";

export const setProject = function(aProject) {
    Dbm.repository.getItem("wprr").setValue("project", aProject);
}

export const setupRangeData = function(aData) {
    let group = Dbm.repository.getItem("wprr").project.items;
    let data = aData;
    let itemsData = Dbm.objectPath(data, "items");
    let encodings = Dbm.objectPath(data, "encodings");
    for(let objectName in encodings) {
        
        let ids = encodings[objectName];
        let currentArray = ids;
        let currentArrayLength = currentArray.length;
        
        for(let i = 0; i < currentArrayLength; i++) {
            let currentId = currentArray[i];
            let item = group.getItem(currentId);
            group.prepareItem(item, objectName);
            group.setupItem(item, objectName, itemsData[""+currentId]);
        }
    }
    
    let mainIds = Dbm.objectPath(data, "ids");

    let items = Dbm.repository.getItems(mainIds);

    return items;
}

let rangeLoaded = function(aRequestItem) {
    console.log("rangeLoaded");
    console.log(aRequestItem);
    let items = setupRangeData(aRequestItem.data["data"]);
    aRequestItem.items = items;
    aRequestItem.parsed = true;
}

export const loadRange = function(aUrl, aCallback) {
    let request = new Dbm.loading.JsonLoader();
    request.setUrl(aUrl);

    request.item.setValue("items", []);
    request.item.setValue("parsed", false);
    
    if(aCallback) {
        let callbackCommand = Dbm.commands.callFunction(aCallback, [Dbm.core.source.staticObject(request.item, "items")]);
        
        Dbm.flow.runWhenMatched(request.item.properties.parsed, true, callbackCommand);
    }
    
    Dbm.flow.runWhenMatched(request.item.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(rangeLoaded, [request.item]));
    request.load();
        
    return request.item.properties.items;
}

let setupOrderItems = function(aItem, aData) {
    {
        aItem.requireProperty("items", []);
        let currentArray = aData["items"];
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentData = currentArray[i];
            let currentItem = Dbm.repository.getItem("woocommerce/lineItems/" + currentData["id"]);

            currentItem.setValue("systemId", currentData["id"]);
            currentItem.setValue("product", Dbm.repository.getItem(currentData["product"]));
            currentItem.setValue("order", aItem);
            currentItem.setValue("quantity", currentData["quantity"]);
            currentItem.setValue("total", currentData["total"]);
            currentItem.setValue("tax", currentData["tax"]);

            aItem.addUniqueToArray("items", currentItem);
        }
    }

    {
        aItem.requireProperty("coupons", []);
        let currentArray = aData["coupons"];
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentData = currentArray[i];
            let currentItem = Dbm.repository.getItem("woocommerce/couponLineItems/" + currentData["id"]);

            currentItem.setValue("systemId", currentData["id"]);
            currentItem.setValue("order", aItem);
            currentItem.setValue("code", currentData["code"]);
            currentItem.setValue("total", currentData["total"]);
            currentItem.setValue("tax", currentData["tax"]);

            aItem.addUniqueToArray("coupons", currentItem);
        }
    }

    {
        aItem.requireProperty("fees", []);
        let currentArray = aData["fees"];
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentData = currentArray[i];
            let currentItem = Dbm.repository.getItem("woocommerce/feeLineItems/" + currentData["id"]);

            currentItem.setValue("systemId", currentData["id"]);
            currentItem.setValue("order", aItem);
            currentItem.setValue("name", currentData["name"]);
            currentItem.setValue("total", currentData["total"]);
            currentItem.setValue("tax", currentData["tax"]);

            aItem.addUniqueToArray("fees", currentItem);
        }
    }
}

export const setupDecoders = function() {


    let noneArray = ["preview", "page", "id"];
    let currentArray = noneArray;
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        let currentEncodeName = currentArray[i];
        Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/" + currentEncodeName, [], [], []);
    }
    

    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/name", ["name"]);
    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/postTitle", ["title"]);
    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/postStatus", ["postStatus"]);
    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/permalink", ["permalink"]);
    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/objectTypes", [], [], ["objectTypes"]);

    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/taxonomyTerm", ["slug", "name", "path"], [], []);

    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/postContent", ["content"], [], []);
    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/postExcerpt", ["excerpt"], [], []);

    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/featuredImage", ["image"], [], []);
    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/identifier", ["identifier"], [], []);
    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/pageTemplate", ["pageTemplate"], [], []);
    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/postType", ["postType"], [], []);
    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/publishDate", ["date"], [], []);
    
    
    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/product", ["price", "productType"], [], []);

    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/type", ["identifier", "name"], [], []);

    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/image", ["alt", "sizes"], [], []);

    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/subscriptionDates", ["startDate", "nextPaymentDate", "endDate"]);
    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/order/paymentMethod", ["paymentMethod"]);
    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/order/totals", ["total", "subtotal", "tax"]);
    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/order/paidDate", ["paidDate"]);
    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/order/creationType", ["creationType"]);
    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/order/subscription", [], ["subscription"]);
    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/order/items", [], [], [], [Dbm.commands.callFunction(setupOrderItems, [Dbm.core.source.event("item"), Dbm.core.source.event("data")])]);

    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/subscription/orders", [], [], ["orders"]);

    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/tags", [], [], ["tags"]);
    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/triggers", [], [], ["triggers"]);

    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/breadcrumb", [], [], ["breadcrumb"]);

    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/user", ["name", "gravatarHash"], [], []);

    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/pageDataSources", [], [], ["dataSources"]);
    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/dataSource", ["dataName", "data"], [], ["objectTypes"]);
    Dbm.graphapi.webclient.decode.setupDefaultDecoder("wprr/pageSettings", [], ["pageSettings"], []);
}