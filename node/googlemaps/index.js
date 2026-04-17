import Dbm from "../../index.js";

export const findPlace = async function(aName) {
    let response = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": Dbm.getRepositoryItem("googleMapsApi").apiKey,
            "X-Goog-FieldMask": "*"
        },
        body: JSON.stringify({
            textQuery: aName,
            maxResultCount: 1
        })
    });

    let repsonseText = await response.text();

    let place = null;
    try {
        let responseData = JSON.parse(repsonseText);
        place = Dbm.objectPath(responseData, "places.0");
    }
    catch(theError) {

    }

    return place;
}

export const getReviews = async function(aPlaceId) {
    let response = await fetch("https://places.googleapis.com/v1/places/" + aPlaceId, {
        headers: {
            "X-Goog-Api-Key": Dbm.getRepositoryItem("googleMapsApi").apiKey,
            "X-Goog-FieldMask": "*"
        }
    });

    let repsonseText = await response.text();
    let reviews = [];

    try {
        let responseData = JSON.parse(repsonseText);
        console.log(responseData);
        reviews = Dbm.objectPath(responseData, "reviews");
    }
    catch(theError) {

    }

    return reviews;
}

