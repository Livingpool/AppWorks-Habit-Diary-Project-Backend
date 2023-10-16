const OpenAI = require('openai')

const transformMessages = require('./helper')

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// 傳入 messages，取得 OpenAI API 的回覆
const openAIChat = async (messages) => {
    // 輸入空訊息直接回傳
	if (messages.length === 0) {
		return "沒有收到訊息";
	} else {
        // 轉換成 openai 格式

		messages = transformMessages(messages); // 转换消息格式

		// 在messages前添加系统消息
		const messagesWithSystemMsg = [
    		{ role: 'system', content: '使用繁體中文回應，為我的回應進行情緒評分，評分範圍為1~5，以及提供我這段文字的建議' },
    		...messages,
		];

// 调用 OpenAI API
			const completion = await openai.chat.completions.create({
				messages: messagesWithSystemMsg, // 使用包含系统消息的数组
				model: 'gpt-3.5-turbo',
				max_tokens: 200,
				temperature: 0.9,
			});

			return completion.choices[0].message.content;
	}
}

module.exports = openAIChat