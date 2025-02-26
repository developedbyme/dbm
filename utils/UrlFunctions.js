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
        url = aImageData["resizeUrl"].split("{scale}").join("width=" + scaleToWidth);
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

        url = aImageData["resizeUrl"].split("{scale}").join("width=" + scaleToWidth + ",height=" + scaleToHeight + ",fit=cover");
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

    return aUrl.split("{scale}").join("width=" + scaleToWidth + ",height=" + scaleToHeight + ",fit=contain");
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