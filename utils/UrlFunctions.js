export let createScaledImageUrl = function(aImageData, aWantedWidth) {
    if(!aImageData || !aImageData["url"]) {
        return null;
    }

    let url = aImageData["url"];
    if(url.substring(url.length-4).toLowerCase() === ".svg") {
        return url;
    }

    if(aImageData["resizeUrl"]) {
        let scaleToWidth = Math.min(
            Math.round(window.devicePixelRatio*aWantedWidth),
            Math.max(
                100,
                100*Math.round(window.devicePixelRatio*window.innerWidth/100)
            )
        );

        let scaleString =  "width=" + scaleToWidth;

        let format = "webp";
        if(format) {
            scaleString += ",format=" + format;
        }

        url = aImageData["resizeUrl"].split("{scale}").join(scaleString);
    }

    return url;
}

export let createCoverScaledImageUrl = function(aImageData, aWantedWidth, aWantedHeight) {
    if(!aImageData || !aImageData["url"]) {
        return null;
    }

    let url = aImageData["url"];
    if(url.substring(url.length-4).toLowerCase() === ".svg") {
        return url;
    }

    if(aImageData["resizeUrl"]) {
        let scaleToWidth = Math.min(
            Math.round(window.devicePixelRatio*aWantedWidth),
            Math.max(
                100,
                100*Math.round(window.devicePixelRatio*window.innerWidth/100)
            )
        );

        let scaleToHeight = Math.round(aWantedHeight*scaleToWidth/aWantedWidth);

        let scaleString = "width=" + scaleToWidth + ",height=" + scaleToHeight + ",fit=cover";

        let format = "webp";
        if(format) {
            scaleString += ",format=" + format;
        }

        url = aImageData["resizeUrl"].split("{scale}").join(scaleString);
    }

    return url;
}

export const getContainScaledImageUrl = function(aUrl, aWantedWidth, aWantedHeight) {
    let scaleToWidth = Math.min(
        Math.round(window.devicePixelRatio*aWantedWidth),
        Math.max(
            100,
            100*Math.round(window.devicePixelRatio*window.innerWidth/100)
        )
    );

    let scaleToHeight = Math.round(aWantedHeight*scaleToWidth/aWantedWidth);

    let scaleString = "width=" + scaleToWidth + ",height=" + scaleToHeight + ",fit=contain";

    let format = "webp";
    if(format) {
        scaleString += ",format=" + format;
    }

    return aUrl.split("{scale}").join(scaleString);
}

export let createContainScaledImageUrl = function(aImageData, aWantedWidth, aWantedHeight) {
    if(!aImageData || !aImageData["url"]) {
        return null;
    }

    let url = aImageData["url"];
    if(url.substring(url.length-4).toLowerCase() === ".svg") {
        return url;
    }

    if(aImageData["resizeUrl"]) {
        url = getContainScaledImageUrl(aImageData["resizeUrl"], aWantedWidth, aWantedHeight);
    }

    return url;
}