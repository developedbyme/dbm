export let createScaledImageUrlWithPixelDensity = function(aImageData, aWantedWidth, aPixelDensity, aMaxSize) {
    if(!aImageData || !aImageData["url"]) {
        return null;
    }

    let url = aImageData["url"];
    if(url.substring(url.length-4).toLowerCase() === ".svg") {
        return url;
    }

    if(aImageData["resizeUrl"]) {
        let scaleToWidth = Math.min(
            Math.round(aPixelDensity*aWantedWidth),
            Math.max(
                100,
                100*Math.round(aPixelDensity*aMaxSize/100)
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

export let createScaledImageUrl = function(aImageData, aWantedWidth) {
    return createScaledImageUrlWithPixelDensity(aImageData, aWantedWidth, Math.floor(window.devicePixelRatio), window.innerWidth);
}

export let getCoverScaledImageUrlWithPixelDensity = function(aUrl, aWantedWidth, aWantedHeight, aPixelDensity, aMaxSize) {
    let scaleToWidth = Math.min(
        Math.round(aPixelDensity*aWantedWidth),
        Math.max(
            100,
            100*Math.round(aPixelDensity*aMaxSize/100)
        )
    );

    let scaleToHeight = Math.round(aWantedHeight*scaleToWidth/aWantedWidth);

    let scaleString = "width=" + scaleToWidth + ",height=" + scaleToHeight + ",fit=cover";

    let format = "webp";
    if(format) {
        scaleString += ",format=" + format;
    }

    return aUrl.split("{scale}").join(scaleString);
}

export const getCoverScaledImageUrl = function(aUrl, aWantedWidth, aWantedHeight) {
    return getCoverScaledImageUrlWithPixelDensity(aUrl, aWantedWidth, aWantedHeight, Math.floor(window.devicePixelRatio), window.innerWidth);
}

export const imageShouldScale = function(aImageData) {
    if(!aImageData || !aImageData["url"]) {
        return false;
    }

    let url = aImageData["url"];
    if(url.substring(url.length-4).toLowerCase() === ".svg") {
        return false;
    }

    if(!aImageData["resizeUrl"]) {
        return false;
    }

    return true;
}

export let createCoverScaledImageUrlWithPixelDensity = function(aImageData, aWantedWidth, aWantedHeight, aPixelDensity, aMaxSize) {
    if(!aImageData || !aImageData["url"]) {
        return null;
    }

    let url = aImageData["url"];
    if(url.substring(url.length-4).toLowerCase() === ".svg") {
        return url;
    }

    if(aImageData["resizeUrl"]) {
        url = getCoverScaledImageUrlWithPixelDensity(aImageData["resizeUrl"], aWantedWidth, aWantedHeight, aPixelDensity, aMaxSize);
    }

    return url;
}

export let createCoverScaledImageUrl = function(aImageData, aWantedWidth, aWantedHeight) {
    return createCoverScaledImageUrlWithPixelDensity(aImageData, aWantedWidth, aWantedHeight, Math.floor(window.devicePixelRatio), window.innerWidth);
}

export const getContainScaledImageUrlWithPixelDensity = function(aUrl, aWantedWidth, aWantedHeight, aPixelDensity, aMaxSize) {
    let scaleToWidth = Math.min(
        Math.round(aPixelDensity*aWantedWidth),
        Math.max(
            100,
            100*Math.round(aPixelDensity*aMaxSize/100)
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

export const getContainScaledImageUrl = function(aUrl, aWantedWidth, aWantedHeight) {
    return getContainScaledImageUrlWithPixelDensity(aUrl, aWantedWidth, aWantedHeight, Math.floor(window.devicePixelRatio), window.innerWidth);
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