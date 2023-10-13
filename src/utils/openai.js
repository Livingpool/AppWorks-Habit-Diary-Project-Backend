const OpenAI = require('openai')

const transformMessages = require('./helper')

require('dotenv').config()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// 傳入 messages，取得 OpenAI API 的回覆
const openAIChat = async (messages) => {
    // 輸入空訊息直接回傳
	if (messages.length == 0) {
		return
	} else {
        // 轉換成 openai 格式
		messages = transformMessages(messages)
        console.log(messages)
        // 呼叫 openai api
		const completion = await openai.chat.completions.create({
			messages,
			model: 'gpt-3.5-turbo',
			max_tokens: 80,
            temperature: 0.9,
		})
		return completion.choices[0]
	}
}

module.exports = openAIChat