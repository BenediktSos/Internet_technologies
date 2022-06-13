
const {Configuration,OpenAIApi}=require ("openai");
/*
let Configuration = require('openai')[0];
let OpenAIApi = require('openai')[1];
*/

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

 async function getMessage (req, res) {
    const completion = await openai.createCompletion("text-davinci-002", {
        prompt: generatePrompt(),
        temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
}

function generatePrompt() {
   return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: Horse
Names:`;
}

exports = getMessage
