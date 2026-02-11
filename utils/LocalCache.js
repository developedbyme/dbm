export const set = function(aKey, aData, aIdentifier = "default") {
    try {
        let currentTime = (new Date()).valueOf();
        let storeObject = {
            identifier: aIdentifier,
            time: currentTime,
            data: aData
        }
        localStorage.setItem("cache/" + aKey, JSON.stringify(storeObject));
    }
    catch(theError) {
        console.error("Unable to set cache " + aKey);
        console.log(theError);
    }
}

export const get = function(aKey, aIdentifier = "default", aMaxAge = 3600) {
    let dataString = localStorage.getItem("cache/" + aKey);

    if(dataString) {
        try {
            let data = JSON.parse(dataString);
            let currentTime = (new Date()).valueOf();
            if(aIdentifier === data.identifier && currentTime < data.time+(aMaxAge*1000)) {
                console.log(data.data);
                return data.data;
            }
        }
        catch(theError) {
            console.error("Unable to get cache " + aKey);
            console.log(theError);
        }
    }
    
    return null;
}