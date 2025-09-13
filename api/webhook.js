const line = require('@line/bot-sdk');
const OpenAI = require('openai');

// LINE Bot 配置
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

// OpenAI 配置
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const client = new line.Client(config);

// 驗證 LINE 簽名
function validateSignature(body, signature) {
  const crypto = require('crypto');
  const hash = crypto
    .createHmac('SHA256', config.channelSecret)
    .update(body)
    .digest('base64');
  return hash === signature;
}

// 處理文字訊息
async function handleTextMessage(event) {
  const userMessage = event.message.text;
  
  try {
    // 調用 ChatGPT API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "你是一個友善的AI助手，請用繁體中文回答問題。回答要簡潔明瞭，適合在LINE聊天中使用。"
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;
    
    // 如果回應太長，分段發送
    const maxLength = parseInt(process.env.MAX_MESSAGE_LENGTH) || 2000;
    if (aiResponse.length > maxLength) {
      const chunks = [];
      for (let i = 0; i < aiResponse.length; i += maxLength) {
        chunks.push(aiResponse.slice(i, i + maxLength));
      }
      
      for (const chunk of chunks) {
        await client.replyMessage(event.replyToken, {
          type: 'text',
          text: chunk
        });
      }
    } else {
      await client.replyMessage(event.replyToken, {
        type: 'text',
        text: aiResponse
      });
    }
    
  } catch (error) {
    console.error('OpenAI API 錯誤:', error);
    await client.replyMessage(event.replyToken, {
      type: 'text',
      text: '抱歉，我現在無法回應。請稍後再試。'
    });
  }
}

// 處理其他類型的訊息
async function handleOtherMessage(event) {
  const messageType = event.message.type;
  
  let responseText = '';
  
  switch (messageType) {
    case 'image':
      responseText = '我收到了你的圖片，但我目前只能處理文字訊息。請傳送文字給我吧！';
      break;
    case 'sticker':
      responseText = '收到貼圖！😊 有什麼問題想問我嗎？';
      break;
    case 'audio':
      responseText = '我收到了語音訊息，但我目前只能處理文字。請用文字告訴我吧！';
      break;
    case 'video':
      responseText = '我收到了影片，但我目前只能處理文字訊息。請傳送文字給我吧！';
      break;
    default:
      responseText = '我收到了你的訊息，但我目前只能處理文字。請用文字告訴我吧！';
  }
  
  await client.replyMessage(event.replyToken, {
    type: 'text',
    text: responseText
  });
}

// 主處理函數
async function handleWebhook(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['x-line-signature'];
  const body = JSON.stringify(req.body);

  // 驗證簽名
  if (!validateSignature(body, signature)) {
    console.error('簽名驗證失敗');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const events = req.body.events;

  try {
    for (const event of events) {
      if (event.type === 'message') {
        if (event.message.type === 'text') {
          await handleTextMessage(event);
        } else {
          await handleOtherMessage(event);
        }
      } else if (event.type === 'follow') {
        // 新用戶關注時的歡迎訊息
        await client.replyMessage(event.replyToken, {
          type: 'text',
          text: `你好！我是${process.env.BOT_NAME || 'ChatGPT助手'}！\n\n我可以回答你的各種問題，請直接傳送文字訊息給我吧！`
        });
      }
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('處理訊息時發生錯誤:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = handleWebhook;
