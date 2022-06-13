'use strict'

const OpenAI = require("openai-api");

const WebSocketClient = require('websocket').client;
require('dotenv').config();

/**
 * bot ist ein einfacher Websocket Chat Client
 */

class bot {


    /**
     * Konstruktor baut den client auf. Er erstellt einen Websocket und verbindet sich zum Server
     * Bitte beachten Sie, dass die Server IP hardcodiert ist. Sie müssen sie umsetzten
     */
    constructor() {
        this.dict = require("./chatbot.json");
        this.gptResponses = require("./gpt_responses.json")


        /** Die Websocketverbindung
         */
        this.client = new WebSocketClient();
        /**
         * Wenn der Websocket verbunden ist, dann setzten wir ihn auf true
         */
        this.connected = false;

        /**
         * Wenn die Verbindung nicht zustande kommt, dann läuft der Aufruf hier hinein
         */
        this.client.on('connectFailed', function (error) {
            console.log('Connect Error: ' + error.toString());
        })

        /**
         * Wenn der Client sich mit dem Server verbindet sind wir hier
         */
        this.client.on('connect', function (connection) {
            this.con = connection;
            console.log('WebSocket Client Connected');
            connection.on('error', function (error) {
                console.log('Connection Error: ' + error.toString());
            });

            /**
             * Es kann immer sein, dass sich der Client disconnected
             * (typischer Weise, wenn der Server nicht mehr da ist)
             */
            connection.on('close', function () {
                console.log('echo-protocol Connection Closed');
            });

            /**
             *    Hier ist der Kern, wenn immmer eine Nachricht empfangen wird, kommt hier die
             *    Nachricht an.
             */
            connection.on('message', function (message) {
                if (message.type === 'utf8') {
                    var data = JSON.parse(message.utf8Data);
                    console.log('Received: ' + data.msg + ' ' + data.name);
                }
            });

            /**
             * Hier senden wir unsere Kennung damit der Server uns erkennt.
             * Wir formatieren die Kennung als JSON
             */
            function joinGesp() {
                if (connection.connected) {
                    connection.sendUTF('{"type": "join", "name":"MegaBot"}');
                }
            }

            joinGesp();
        });

        this.openai = new OpenAI(process.env.OPENAI_API_KEY);
        this.request = {
            greeting: "",
            language: "",
            algorithm: "",
            documentation: "",
            pleaseStandBy: "",
            presentCode: "",
            repeat: ""
        };
    }

    /**
     * Methode um sich mit dem Server zu verbinden. Achtung wir nutzen localhost
     *
     */
    connect() {
        this.client.connect('ws://localhost:8181/', 'chat');
        this.connected = true;
    }

    /**
     * Hier muss ihre Verarbeitungslogik integriert werden.
     * Diese Funktion wird automatisch im Server aufgerufen, wenn etwas ankommt, das wir
     * nicht geschrieben haben
     * @param nachricht auf die der bot reagieren soll
     */
    async post(nachricht) {
        let name = 'MegaBot';
        let inhalt = 'AnError occured';

/*
        for (const j in this.dict) {
            if (nachricht.includes(j)) {
                inhalt = this.dict[j]
            }
        }
 */

        try {
            let gPTResponse = await this.requestGPT3Response(this.intent, nachricht)
            this.request[this.intent] = gPTResponse;
        } catch (e) {

        }

        for (let intent in this.request) {
            if (this.request[intent] === "") {
                this.intent = intent;
                break;
            }
        }


        inhalt = this.selectMessage(this.intent)


        if (this.request.documentation !== "") {
            let prompt = await this.buildPrompt();


            const gptResponse = await this.openai.complete({
                engine: 'curie',
                prompt: prompt,
                maxTokens: 512,
                temperature: 0.6,
                topP: 0.4,
                presencePenalty: 0,
                frequencyPenalty: 0,
                bestOf: 1,
                n: 1,
                stream: false,
                stop: []
            }).catch((e) => console.error(e));

            inhalt = gptResponse
        }

        console.log(this.intent)

        /*
         * Verarbeitung
        */
        var msg = '{"type": "msg", "name": "' + name + '", "msg":"' + inhalt + +"\n"+this.intent+ '"}'
        console.log('Send: ' + msg)
        this.client.con.sendUTF(msg)
    }

    async requestGPT3Response(type, nachricht) {
        let prompt;
        switch (type) {
            case "language":
                prompt = this.gptResponses.language;
                break;
            case"documentation":
                prompt = this.gptResponses.documentation;
                break;
            case "algorithm":
                prompt = this.gptResponses.language;
                break;
            default:
                prompt = "error";
                break;
        }

        if (prompt === "error") {
            return "."
        }

        prompt += nachricht + "\n";

        let answer = await this.openai.complete({
            engine: 'curie',
            prompt: prompt,
            maxTokens: 5,
            temperature: 0,
            topP: 0.2,
            presencePenalty: 0,
            frequencyPenalty: 0,
            bestOf: 1,
            n: 1,
            stream: false,
            stop: ["."]
        });
    return answer.data.choices[0].text;
    }

    async buildPrompt() {
        let prompt = this.gptResponses.generator;
        this.request.documentation = this.request.documentation.toLowerCase();

        prompt.replace("insert_algorithm", this.request.algorithm);
        prompt.replace("insert_language", this.request.language);
        if (this.request.documentation.includes("yes")) {
            prompt.replace("insert_documentation", "with");
        } else {
            prompt.replace("insert_documentation", "without");
        }

        return prompt;
    }

    selectMessage() {
        let array = this.dict[this.intent];
        return array[Math.floor(Math.random() * array.length)];
    }

    async reset(){
        this.request = {
            greeting: "",
            language: "",
            algorithm: "",
            documentation: "",
            pleaseStandBy: "",
            presentCode: "",
            repeat: ""
        };
        this.intent = "";
        await this.post("Hello");
    }

}


module.exports = bot

