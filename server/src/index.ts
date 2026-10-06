import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory backend storage for dynamic data
let serverState: Record<string, any> = {};

let proverbsStore = [
  {
    id: 'owe_1',
    text: 'Ọbẹ̀ kì í gbé inú àgbà mì.',
    literal: 'Soup does not shake inside an elder.',
    meaning: 'A mature person exercises self-control and keeps confidential matters safe.',
    context: 'Spoken when advising composure, confidentiality, and emotional maturity.',
    origin: 'Yorùbá traditional wisdom',
    language: 'Yorùbá',
    story: 'In ancient Yoruba towns, village leaders were chosen for their emotional restraint...',
    questions: [
      { question: 'What principle does this proverb primarily emphasize?', options: ['Generosity', 'Discretion and self-control', 'Culinary skill'], answer: 1 }
    ],
    reflectionPrompt: 'Recall a situation where remaining calm and silent served a greater purpose.'
  },
  {
    id: 'owe_2',
    text: 'Ilé la ti ń kọ́ ẹ̀ṣọ́ ròde.',
    literal: 'Good character and neatness are learned at home before stepping outside.',
    meaning: 'True values, respect, and character begin with domestic foundation.',
    context: 'Reminding individuals that personal presentation and integrity reflect family upbringing.',
    origin: 'Yorùbá traditional wisdom',
    language: 'Yorùbá',
    story: 'Young adults embarking on journeys were historically reminded that their actions reflect their family name...',
    questions: [
      { question: 'Where does character building begin according to the proverb?', options: ['In school', 'At home', 'In the marketplace'], answer: 1 }
    ],
    reflectionPrompt: 'How do your family values influence your daily interactions?'
  }
];

let teacherRequests: any[] = [];
let teacherReplies: any[] = [];
let consentRequests: Record<string, any> = {};

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Sync State API
app.get('/api/state', (req: Request, res: Response) => {
  res.json({ success: true, state: serverState });
});

app.post('/api/state', (req: Request, res: Response) => {
  serverState = { ...serverState, ...req.body };
  res.json({ success: true, state: serverState });
});

// Proverbs API
app.get('/api/proverbs', (req: Request, res: Response) => {
  res.json({ success: true, proverbs: proverbsStore });
});

app.get('/api/proverbs/:id', (req: Request, res: Response) => {
  const proverb = proverbsStore.find((p) => p.id === req.params.id);
  if (!proverb) {
    return res.status(404).json({ success: false, message: 'Proverb not found' });
  }
  res.json({ success: true, proverb });
});

app.post('/api/proverbs', (req: Request, res: Response) => {
  const { text, literal, meaning, context, language, story, reflectionPrompt } = req.body;
  if (!text || !meaning) {
    return res.status(400).json({ success: false, message: 'Text and meaning are required.' });
  }
  const newProverb = {
    id: `owe_${Date.now()}`,
    text,
    literal: literal || text,
    meaning,
    context: context || '',
    origin: 'Community contribution',
    language: language || 'Yorùbá',
    story: story || '',
    questions: [],
    reflectionPrompt: reflectionPrompt || 'Reflect on how this proverb applies to your life.'
  };
  proverbsStore.push(newProverb);
  res.json({ success: true, proverb: newProverb });
});

// Consent API
app.post('/api/consent/request', (req: Request, res: Response) => {
  const { code } = req.body;
  const requestCode = code || Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hrs
  consentRequests[requestCode] = {
    requestCode,
    approved: false,
    requestedAt: new Date().toISOString(),
    expiresAt
  };
  res.json({ success: true, requestCode, expiresAt });
});

app.post('/api/consent/verify', (req: Request, res: Response) => {
  const { code } = req.body;
  if (!code || !consentRequests[code]) {
    return res.status(400).json({ success: false, message: 'Invalid or expired code.' });
  }
  const record = consentRequests[code];
  record.approved = true;
  record.approvedAt = new Date().toISOString();
  res.json({ success: true, approved: true, record });
});

// Connections API (Teachers & Students)
app.get('/api/connections/teachers', (req: Request, res: Response) => {
  res.json({ success: true, requests: teacherRequests, replies: teacherReplies });
});

app.post('/api/connections/teachers/request', (req: Request, res: Response) => {
  const { learnerName, guardianName, language, level, notes } = req.body;
  const newReq = {
    id: `req_${Date.now()}`,
    learnerName,
    guardianName,
    language,
    level,
    notes,
    date: new Date().toLocaleDateString()
  };
  teacherRequests.push(newReq);
  res.json({ success: true, request: newReq });
});

// AI Assistant API
app.post('/api/ai/assistant', (req: Request, res: Response) => {
  const { prompt, language } = req.body;
  const lower = (prompt || '').toLowerCase();

  let responseText = `I am your ${language || 'Yorùbá'} learning guide. How can I help you explore language, culture, or coding today?`;

  if (lower.includes('proverb') || lower.includes('owe') || lower.includes('meaning')) {
    responseText = `In ${language || 'Yorùbá'} culture, proverbs (Òwe) carry deep wisdom. They teach integrity, patience, and community connection.`;
  } else if (lower.includes('code') || lower.includes('html') || lower.includes('javascript')) {
    responseText = `Coding in ${language || 'Yorùbá'} combines computing logic with language acquisition! You can build pages, apps, and games while mastering vocabulary.`;
  } else if (lower.includes('greet') || lower.includes('hello')) {
    responseText = language === 'igbo' ? 'Ndewo! Kedu ka mere?' : language === 'hausa' ? 'Sannu! Yaya dai?' : 'Ẹ káàárọ̀! Báwo ni ṣe wà?';
  }

  res.json({ success: true, reply: responseText });
});

app.listen(PORT, () => {
  console.log(`Idilewa Server running on port ${PORT}`);
});
