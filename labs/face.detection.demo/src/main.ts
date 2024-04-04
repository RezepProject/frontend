import express from 'express';
import { join } from 'path';

const app = express();

// mount middleware to serve static files
const path = join(__dirname, 'public');
const options = { extensions: ['html'] };
app.use(express.static(path, options));

// start http server
app.listen(5444, () => {
  console.log('Server listening on port 3000');
});

async function startSpeechToText() {
  await SpeechToText.initAudio();
}

startSpeechToText().then(r => console.log('SpeechToText started'));

