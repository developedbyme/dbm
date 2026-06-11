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