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
            window.devicePixelRatio*aWantedWidth,
            Math.max(
                100,
                100*Math.round(window.devicePixelRatio*window.innerWidth/100)
            )
        );
        url = aImageData["resizeUrl"].split("{scale}").join("width=" + scaleToWidth);
    }

    return url;
}