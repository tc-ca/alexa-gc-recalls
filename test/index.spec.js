var assert = require('chai').assert;
const VirtualAlexa = require("virtual-alexa").VirtualAlexa;

it('Launches successfully', async function () {
    const alexa = VirtualAlexa.Builder()
        .handler("./lambda/custom/index.handler") // Lambda function file and name
        .interactionModelFile("./models/en-US.json") // Path to interaction model file
        .create();

    let reply = await alexa.launch();
     assert.include(reply.response.outputSpeech.ssml, "Welcome to the Alexa Skills Kit, you can say hello or bonjour!");
   
});