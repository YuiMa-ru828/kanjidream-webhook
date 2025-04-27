const express = require('express');
const line = require('@line/bot-sdk');
const app = express();

// ここに自分のLINE設定情報を入れる
const config = {
  channelAccessToken: 'KfEV7yDiLuaMU9iaiD4XpiAyWWFXBGvxAkqwZ2E5jBfhQOTCGwckXmx6Hoo2XtnBCv+TbwCWYuHnrqmeLZIo6p3K4gXmSSOF0/SGFoBdGieizCIj/L7VtCz2DhLagaOjosXMwiIRvMyVhbmdf45vRAdB04t89/1O/w1cDnyilFU=',
  channelSecret: '3903648567b5a88407a0f1cb6eb76b00'
};

const client = new line.Client(config);

// LINEからメッセージを受け取ったときの動作
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// イベントごとの処理
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  // 仮の返事「こんにちは！」
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: 'Hi！Welcome to KanjiDream🌙'
  });
}

// サーバーを起動
app.listen(process.env.PORT || 3000, () => {
  console.log('サーバーが起動しました！');
});
