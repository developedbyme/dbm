import Dbm from "../../index.js";

export default class PostmarkApiClient extends Dbm.core.BaseObject {

	_construct() {
		super._construct();

		this.item.setValue("serviceName", "postmark");
		this.item.setValue("defaultFrom", "website@webnotification.services");
		this.item.setValue("token", null);
	}
	
	createMessage() {
        let newMessage = new Dbm.node.communication.EmailMessage();
		newMessage.setClient(this.item);

		return newMessage;
    }

	async performSendMessage(aMessageItem) {
		//console.log("performSendMessage");

		let from = aMessageItem.from;
		if(!from) {
			from = this.item.defaultFrom;
		}

		let emailData = {
            From: from,
            To: aMessageItem.to,
            Subject: aMessageItem.subject,
            HtmlBody: aMessageItem.htmlContent,
			TextBody: aMessageItem.textContent,
        };

		let replyTo = Dbm.objectPath(aMessageItem, "additionalData.replyTo");
		if(replyTo) {
			emailData["ReplyTo"] = replyTo;
		}

        let response = await fetch('https://api.postmarkapp.com/email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Postmark-Server-Token': this.item.token
            },
            body: JSON.stringify(emailData)
        });

        let repsonseText = await response.text();

		let id = null;
		try {
			let responseData = JSON.parse(repsonseText);
			id = responseData["MessageID"];
		}
		catch(theError) {

		}

		return {"response": repsonseText, "from": from, "id": id};
	}
}