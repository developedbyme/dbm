import Dbm from "../../index.js";
import fs from "node:fs";

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

export const sendUnformattedEmail = function(aTo, aSubject, aBody, aFrom = null, aAdditionalData = null) {
    return createEmailAction(aTo, aSubject, null, aBody, aFrom, aAdditionalData);
}

export const sendEmail = function(aTo, aSubject, aBody, aFrom = null, aAdditionalData = null) {

    let textBody = null;
    let textConverter = Dbm.repository.getControllerIfExists("htmlToTextConverter");
    if(textConverter) {
        textBody = textConverter.convertToText(aBody);
    }
    
    return createEmailAction(aTo, aSubject, aBody, textBody, aFrom, aAdditionalData);
}

export const sendEmailTemplate = async function(aTemplateIdentifer, aTo, aKeywordReplace, aLanguage = "default", aDesignFilePath = null, aFrom = null, aAdditionalData = null) {
    let emailTemplate = await Dbm.node.getDatabase().getIdentifiableObjectIfExists("emailTemplate", aTemplateIdentifer);

    if(emailTemplate) {
        await Dbm.node.forAll(emailTemplate.loadFields(), emailTemplate.loadFieldTranslations("title", "content"));

        let subject = aKeywordReplace.replaceKeywords(emailTemplate.getTranslatedFieldValue("title", aLanguage));
        let content = aKeywordReplace.replaceKeywords(emailTemplate.getTranslatedFieldValue("content", aLanguage));

        if(!aDesignFilePath) {
            aDesignFilePath = Dbm.repository.getValueIfExists("emailDesigns", "default/" + aLanguage);

            if(!aDesignFilePath && (aLanguage !== "default")) {
                aDesignFilePath = Dbm.repository.getValueIfExists("emailDesigns", "default/default");
            }
        }

        if(aDesignFilePath) {
            //let assetsDir = Dbm.getInstance().repository.getItem("site").assetsDir;
            let mailContent = await fs.promises.readFile(aDesignFilePath, 'utf8');

            let designKeywordReplace = new Dbm.utils.KeywordReplace();
            designKeywordReplace.addKeyword("subject", subject);
            designKeywordReplace.addKeyword("content", content);
            designKeywordReplace.addKeyword("language", (aLanguage !== "default") ? aLanguage : ""); //MENOTE: get default language

            //MENOTE: should we have keywords from settings here

            content = designKeywordReplace.replaceKeywords(mailContent);
        }
        
        await sendEmail(aTo, subject, content, aFrom, aAdditionalData);
    }
    else {
        console.warn("No email template " + aTemplateIdentifer);
    }
}

export const createPostmarkClient = function(aToken, aDefaultFromEmail = null) {
    let client = new Dbm.node.communication.PostmarkApiClient();

    client.item.token = aToken;
    if(aDefaultFromEmail) {
        client.item.defaultFrom = aDefaultFromEmail;
    }

    return client;
}
