const express = require('express');
const line = require('@line/bot-sdk');
const app = express();

// LINEチャネル情報（自分のものを入れてね）
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = new line.Client(config);

// POSTリクエスト（メッセージ受信）時の処理
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
});

// メイン処理
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userMessage = event.message.text;

  // 初回メッセージっぽいとき（仮判定）
  if (userMessage.toLowerCase() === 'start' || userMessage === 'เริ่มต้น') {
    const welcomeMessage = 
      "สวัสดีค่ะ! KanjiDream ยินดีต้อนรับค่ะ!🌙\n" +
      "Hello! Welcome to KanjiDream!🌙\n\n" +
      "กรุณาพิมพ์ชื่อของคุณ (ภาษาอังกฤษ) ค่ะ\n" +
      "Please type your name in English (romanized)";
      
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: welcomeMessage
    });
  } else {
    // 名前が入力されたとみなして漢字候補を返信
    const kanjiSuggestions = generateKanjiSuggestions(userMessage);

    const replyText = 
      `ชื่อของคุณคือ "${userMessage}" ถูกแปลงเป็นคันจิที่สวยงามแล้วค่ะ✨\n` +
      `Your name "${userMessage}" has been beautifully transformed into Kanji✨\n\n` +
      `Here are your Kanji name suggestions:\n` +
      `1. ${kanjiSuggestions[0]}\n` +
      `2. ${kanjiSuggestions[1]}\n` +
      `3. ${kanjiSuggestions[2]}\n\n` +
      "อยากได้ชื่อคันจิที่มีความหมายพิเศษไหมคะ?✨\n" +
      "Would you like a special Kanji name with a unique meaning?✨\n" +
      "Type 'Yes' or 'No'.";

    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: replyText
    });
  }
}

// 仮の漢字候補生成（サンプルロジック）
function generateKanjiSuggestions(name) {
  const kanjiList = ['光', '海', '翔', '空', '月', '夢', '桜', '星'];
  let suggestions = [];
  for (let i = 0; i < 3; i++) {
    const randomKanji = kanjiList[Math.floor(Math.random() * kanjiList.length)];
    suggestions.push(randomKanji);
  }
  return suggestions;
}

// サーバー起動
app.listen(process.env.PORT || 3000, () => {
  console.log('KanjiDream Bot server is running!');
});
