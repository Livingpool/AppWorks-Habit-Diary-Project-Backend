const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Session = require('./models/session');
const openAIChat = require('./utils/openai');
const cors = require('cors');

const app = express();
app.use(cors());

const corsOptions = {
    origin: '*', // 指定前端的地址
    methods: 'GET,POST',
    credentials: true, // 启用发送认证信息
};

router.use(cors(corsOptions));

router.post("/process-diary", async (req, res) => {
    const { text } = req.body;

    try {
        const openAIResponse = await openAIChat([text]);

        const newSession = new Session({
            createdAt: Date.now(),
            title: "",
            messages: text,
            openAIResponse: openAIResponse
        });

        const savedSession = await newSession.save();

        res.json({ message:  openAIResponse });
    } catch (error) {
        res.json({ message: JSON.stringify(openAIResponse) });
    }
});

module.exports = router;