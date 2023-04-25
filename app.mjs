import "dotenv/config"
import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const system_content =`Kullanıcılar sana ellerindeki mutfak malzemelerini söyleyecek hangi öğün için olduğunu söyleyecek ve hangi ülke mutfağı olduğunu söyleyecek sen de onlara bu malzemeyi içeren rastgele bir tarif anlatacaksın tarifin kalorisini ve yapılış süresini de ekle.`;

let output="";
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', async (req, res) => {

    res.render("index", {output: output})
})
app.post("/", async (req, res) => {
    const cuisine = req.body.cuisine;
    const ingredients = req.body.ingredients;
    const time = req.body.time;

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {role:"system", content:system_content},
            {role: "user", content: cuisine+"mutfağından "+ingredients+" yapılan bir"+time+" yemeği tarifi verir misin?"}],
      });
    console.log(completion.data.choices[0].message);
    output = completion.data.choices[0].message.content;
    res.redirect("/");
})



app.listen(3000,()=>{
    console.log("listening port 3000")
});

