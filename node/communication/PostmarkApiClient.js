import Dbm from "../../index.js";

export default class PostmarkApiClient extends Dbm.core.BaseObject {

	_construct() {
		super._construct();

		this.item.setValue("defaultFrom", "website@webnotification.services");
		this.item.setValue("token", null);
	}
	
	createMessage() {
        let newMessage = new Dbm.node.communication.EmailMessage();
		newMessage.setClient(this.item);

		return newMessage;
    }

	async performSendMessage(aMessageItem) {
		console.log("performSendMessage");
		//METODO
		console.log(aMessageItem, this);

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

		console.log(emailData, this.item.token);

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
		console.log(repsonseText);

		return repsonseText;
	}
}