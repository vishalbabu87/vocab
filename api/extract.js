import fs from 'node:fs/promises';
import formidable from 'formidable';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import xlsx from 'xlsx';

export const config = {
  api: {
    bodyParser: false,
  },
};

function normalizeParseMode(value) {
  const mode = String(value || 'auto').toLowerCase();
  const allowed = new Set(['auto', 'pdf', 'docx', 'xlsx']);
  return allowed.has(mode) ? mode : 'auto';
}

function parseMultipart(req) {
  const form = formidable({ multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }

      const uploaded = files.file;
      const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;

      if (!file) {
        reject(new Error('No file uploaded'));
        return;
      }

      const modeField = Array.isArray(fields.parseMode) ? fields.parseMode[0] : fields.parseMode;

      resolve({
        file,
        parseMode: normalizeParseMode(modeField),
      });
    });
  });
}

async function extractTextFromFile(file, parseMode = 'auto') {
  const fileName = (file.originalFilename || '').toLowerCase();
  const mime = (file.mimetype || '').toLowerCase();
  const extension = fileName.split('.').pop();
  const detectedType = extension === 'pdf'
    ? 'pdf'
    : extension === 'docx'
      ? 'docx'
      : extension === 'xlsx'
        ? 'xlsx'
        : null;

  const fileType = parseMode === 'auto' ? detectedType : parseMode;
  const nodeBuffer = await fs.readFile(file.filepath);

  if (fileType === 'pdf' || (parseMode === 'auto' && mime.includes('pdf'))) {
    const parsed = await pdfParse(nodeBuffer);
    return parsed.text;
  }

  if (fileType === 'docx' || (parseMode === 'auto' && mime.includes('wordprocessingml'))) {
    const parsed = await mammoth.extractRawText({ buffer: nodeBuffer });
    return parsed.value;
  }

  if (
    fileType === 'xlsx'
    || (parseMode === 'auto' && (mime.includes('spreadsheetml') || mime.includes('excel')))
  ) {
    const workbook = xlsx.read(nodeBuffer, { type: 'buffer' });
    const textChunks = workbook.SheetNames.map((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      return xlsx.utils.sheet_to_csv(sheet);
    });

    return textChunks.join('\n');
  }

  throw new Error('Unsupported file type. Please upload PDF, DOCX, or XLSX.');
}

function buildPrompt(text) {
  return `You are a vocabulary extraction engine.

Given the source text below, identify distinct words and meanings and return ONLY a strict JSON array.
Each array item must contain:
- word: string
- meaning: string
- options: exactly 4 strings including the correct meaning and 3 plausible distractors
- category: string inferred from context when possible, else "custom"

Rules:
1) No markdown.
2) No extra commentary.
3) Return strictly valid JSON matching the schema.
4) Ensure options are unique and exactly length 4.
5) meaning must be one of options.

Source text:\n${text}`;
}

async function extractWithGemini(text) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: buildPrompt(text) }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                word: { type: 'STRING' },
                meaning: { type: 'STRING' },
                options: {
                  type: 'ARRAY',
                  items: { type: 'STRING' },
                  minItems: 4,
                  maxItems: 4,
                },
                category: { type: 'STRING' },
              },
              required: ['word', 'meaning', 'options', 'category'],
            },
          },
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini request failed: ${response.status} ${errorText}`);
  }

  const payload = await response.json();
  const textOutput = payload?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textOutput) {
    throw new Error('Gemini returned an empty response');
  }

  return JSON.parse(textOutput);
}

function validateVocabularyItems(items) {
  if (!Array.isArray(items)) {
    throw new Error('Extracted output must be an array');
  }

  return items
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      word: String(item.word || '').trim(),
      meaning: String(item.meaning || '').trim(),
      options: Array.isArray(item.options)
        ? item.options.map((option) => String(option).trim()).filter(Boolean).slice(0, 4)
        : [],
      category: String(item.category || 'custom').trim() || 'custom',
    }))
    .filter((item) => item.word && item.meaning && item.options.length === 4 && item.options.includes(item.meaning));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { file, parseMode } = await parseMultipart(req);
    const extractedText = await extractTextFromFile(file, parseMode);

    if (!extractedText || !extractedText.trim()) {
      res.status(400).json({ error: 'No extractable text found in file' });
      return;
    }

    const aiItems = await extractWithGemini(extractedText.slice(0, 45000));
    const vocabulary = validateVocabularyItems(aiItems);

    res.status(200).json(vocabulary);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Extraction failed' });
  }
}
