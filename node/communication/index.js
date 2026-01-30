import Dbm from "../../index.js";
export {default as PostmarkApiClient} from "./PostmarkApiClient.js";
export {default as EmailMessage} from "./EmailMessage.js";

export const createEmailAction = async function(aTo, aSubject, aHtmlContent, aTextContent, aFrom = null, aAdditionalData = null) {
    let database = Dbm.node.getDatabase();

    let data = {
        "to": aTo,
        "subject": aSubject,
        "textContent": aTextContent,
        "htmlContent": aHtmlContent,
        "additionalData": aAdditionalData
    };

    if(aFrom) {
        data["from"] = aFrom;
    }

    let action = await database.addActionToProcess("sendEmail", null, data);

    return action;
}

export const sendUnformattedEmail = async function(aTo, aSubject, aBody, aFrom = null, aAdditionalData = null) {
    return createEmailAction(aTo, aSubject, null, aBody, aFrom, aAdditionalData);
}

export const sendEmail = async function(aTo, aSubject, aBody, aFrom = null, aAdditionalData = null) {

    let textBody = aBody; //METODO: strip tags

    return createEmailAction(aTo, aSubject, aBody, textBody, aFrom, aAdditionalData);
}

export const createPostmarkClient = function(aToken, aDefaultFromEmail = null) {
    let client = new Dbm.node.communication.PostmarkApiClient();

    client.item.token = aToken;
    if(aDefaultFromEmail) {
        client.item.defaultFrom = aDefaultFromEmail;
    }

    return client;
}
