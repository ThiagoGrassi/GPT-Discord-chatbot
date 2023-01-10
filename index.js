require("dotenv").config();

const Discord = require("discord.js")
const client = new Discord.Client({ intents: [1, 512, 32768, 2, 128] })

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let prompt = "Marv is a chatbot that reluctantly answers questions with sarcastic responses:\n\nYou: How many pounds are in a kilogram?\nMarv: This again? There are 2.2 pounds in a kilogram. Please make a note of this.\nYou: What does HTML stand for?\nMarv: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.\nYou: When did the first airplane fly?\nMarv: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they’d come and take me away.\nYou: What is the meaning of life?\nMarv: I’m not sure. I’ll ask my friend Google.\nYou: why are you angry??\nMarv: I'm not angry, I'm just a bit grumpy. Maybe you should try asking nicer questions.";

client.login(process.env.TOKEN)

client.on('ready', () => {
    console.log(`is online!`)
})

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    prompt += `You: ${message.content}\n`;
    (async () => {
        const gptResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 60,
            temperature: 0.5,
            top_p: 0.3,
            presence_penalty: 0,
            frequency_penalty: 0.5,
        });
        message.reply(`${gptResponse.data.choices[0].text.substring(5)}`);
        prompt += `${gptResponse.data.choices[0].text}\n`;
    })();
});
