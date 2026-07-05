import Dbm from "../../../index.js";

export default class SpeechRecognition extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("record", false).addUpdate(this._getScopedCallFunctionCommand(this._recordChanged));
        this.item.requireProperty("startValue", "");
        this.item.requireProperty("value", "");
        this.item.requireProperty("language", "en-GB");
        this.item.requireProperty("state", "waiting");

        let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        let dictationRecorder = null;
        if(SpeechRecognition) {
            dictationRecorder = new SpeechRecognition();

            dictationRecorder.continuous = true;
            dictationRecorder.interimResults = true;

            dictationRecorder.addEventListener("result", this._callback_result.bind(this));
            dictationRecorder.addEventListener("error", this._callback_error.bind(this));
            dictationRecorder.addEventListener("start", this._callback_started.bind(this));
            dictationRecorder.addEventListener("end", this._callback_ended.bind(this));
        }

        this.item.requireProperty("dictationRecorder", dictationRecorder);
        this.item.requireProperty("isAvailable", dictationRecorder ? true : false);
    }

    _recordChanged() {
        if(this.item.record) {
            this.item.dictationRecorder.lang = this.item.language;
            this.item.startValue = this.item.value;
            this.item.state = "checkingPermissions";
            this.item.dictationRecorder.start();
        }
        else {
            this.item.dictationRecorder.stop();
        }
    }

    _callback_result(aEvent) {
        console.log("_callback_result");
        console.log(aEvent);


        let transcripts = [this.item.startValue];

        let currentArray = aEvent.results;
        let currentArrayLength = currentArray.length;

        for (let i = 0; i < currentArrayLength; i++) {
            transcripts.push(currentArray[i][0].transcript);
        }

        console.log(transcripts.join(" "));

        this.item.properties.value.getMostUpstreamProperty().value = transcripts.join(" ");

    }

    _callback_error(aEvent) {
        console.log("_callback_error");
        console.log(aEvent);
    }

    _callback_started(aEvent) {
        console.log("_callback_started");
        console.log(aEvent);

        this.item.state = "recording";
    }

    _callback_ended(aEvent) {
        console.log("_callback_ended");
        console.log(aEvent);

        this.item.properties.record.getMostUpstreamProperty().value = false;
        this.item.state = "waiting";
    }
}