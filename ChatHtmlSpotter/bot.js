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
        this.user_questions = null;
        this.request = null;
        this.gptResponses = null;
        this.openai = new OpenAI(process.env.OPENAI_API_KEY);
        this.topics = require("./topics.json");


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
                    connection.sendUTF('{"type": "join", "name":"Chadbot"}');
                }
            }

            joinGesp();

            this.name = 'Chadbot';
        });
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
        let responseMsg = 'An Error occurred';

        if (this.request === null) {
            await this.evaluateToRequest(nachricht).catch(e => console.log(e));
        }
        if (this.request === null) {
            //todo
            responseMsg = "Ask for topic";
        } else {
            //process user input
            await this.processUserInput(nachricht);

            //select intent
            this.selectNextIntent();

            //select message
            responseMsg = this.selectMessage(this.intent)

            //send GPT Answer
            if (this.intent === "generator") {
                await this.longGPTResponse().catch(e => console.log(e));
            }

            //make sure to transmit a valid JSON in post
            responseMsg = this.makeJsonSafe(responseMsg)
        }
        /*
         * Verarbeitung
        */
        const msg = '{"type": "msg", "name": "' + this.name + '", "msg":"' + responseMsg + '"}';
        console.log('Send: ' + msg)
        this.client.con.sendUTF(msg)
    }

    selectNextIntent() {
        let intent

        for (intent in this.request) {
            if (this.request[intent] === "") {
                this.intent = intent;
                break;
            }
        }
        if(intent === undefined) {
            this.reset().catch(e => console.log(e));
        }
    }

    async processUserInput(nachricht) {
        if (this.intent !== undefined) {
            let prompt = this.user_questions[this.intent];

            let gpTResponse = await this.shortGPTResponse(prompt, nachricht).catch(e => console.log("rejection :("));
            if (!gpTResponse.toLowerCase().includes("none")) {
                this.request[this.intent] = gpTResponse;
                this.notUnderstood = false;
            }else{
                //todo implement repeat logic
                this.notUnderstood = true;
            }
        }
    }

    async longGPTResponse() {
        const gptPrompt = await this.buildPrompt().catch(e => console.log("rejection :("));
        const gptResponse = await this.openai.complete({
            engine: 'davinci',
            prompt: gptPrompt,
            maxTokens: 128,
            temperature: 0.7,
            topP: 1,
            presencePenalty: 0,
            frequencyPenalty: 0,
            bestOf: 1,
            n: 1,
            stream: false,
            stop: ["\"", gptPrompt]
        }).catch(e => console.log("rejection: no code this time" + e));
        try {
            console.log(gptResponse.data.choices[0].text);
            const responseMsg = this.makeJsonSafe(gptResponse.data.choices[0].text);
            const msg = '{"type": "msg", "name": "' + "GPT-3" + '", "msg":"' + responseMsg + '"}';
            console.log('Send(GPT-Response): ' + msg)
            this.client.con.sendUTF(msg)
        } catch (e) {
            console.log(e);
        }
    }

    async shortGPTResponse(prompt, message) {
        prompt = prompt + "\nQuestion:" + message + "\nAnswer:";

        const answer = await this.openai.complete({
            engine: 'davinci',
            prompt: prompt,
            maxTokens: 10,
            temperature: 1,
            topP: 1,
            presencePenalty: 0,
            frequencyPenalty: 0,
            bestOf: 1,
            n: 1,
            stream: false,
            stop: [".", "\n"]
        }).catch(e => console.log("rejection: no code this time" + e));

        return answer.data.choices[0].text;
    }

    async buildPrompt() {
        let prompt = this.gptResponses.generator;

        let insertTurn = 1;
        for (const requestKey in this.request) {
            prompt = prompt.replace("insert_" + insertTurn, this.request[requestKey]);
            insertTurn++;
        }

        return prompt;
    }

    selectMessage() {
        let array = this.user_questions[this.intent];
        return array[Math.floor(Math.random() * array.length)];
    }

    async reset() {
        this.request = null;
        this.user_questions = null;
        this.gptResponses = null;
        this.intent = "";

        //Send initial message
        let responseMsg = "Ich bin ein Chatbot um Anfragen an GPT3 zu stellen. Mögliche Themen sind ";
        for (const topic in this.topics) {
            responseMsg += topic + ",";
        }
        responseMsg += "Bitte wählen Sie ein Thema aus";
        const msg = '{"type": "msg", "name": "' + this.name + '", "msg":"' + responseMsg + '"}';
        console.log('Send: ' + msg)
        this.client.con.sendUTF(msg)
    }

    makeJsonSafe(input) {
        const regexNewLine = new RegExp("\\n", "g");
        const regexBackslash = new RegExp("\\\\", "g");
        const regexForwardSlash = new RegExp("/", "g");
        const regexDoubleQuotes = new RegExp("\"", "g");

        let tempString = input;
        tempString = tempString.replace(regexNewLine, "EOL");
        tempString = tempString.replace(regexBackslash, "\\\\");
        tempString = tempString.replace(regexForwardSlash, "\\/");
        tempString = tempString.replace(regexDoubleQuotes, "\\\"");

        return tempString;
    }

    async evaluateToRequest(message) {
        let prompt = "Categorise into these categories:"
        for (const topic in this.topics) {
            prompt += topic + ",";
        }
        prompt += "none";
        let topic = await this.shortGPTResponse(prompt, message).catch(e => console.log(e));
        let filename = this.resolveFilename(topic, message);

        this.user_questions = require(filename).user_questions;
        this.request = require(filename).needed_information;
        this.gptResponses = require(filename).gpt_questions;
    }

    resolveFilename(topic, message) {
        let path = null;
        message = message.toLowerCase();
        topic = topic.toLowerCase();
        for (const topicKey in this.topics) {
            if (topic.includes(topicKey)) {
                path = "./public/json_modules/" + topicKey + ".json";
                break;
            }
        }
        if (path === null) {
            for (const topicValue in this.topics) {
                if (message.includes(topicValue)) {
                    path = "./public/json_modules/" + topicValue + ".json";
                    break;
                }
            }
        }
        return path;
    }
}

module.exports = bot;

