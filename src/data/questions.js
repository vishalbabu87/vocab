const IMPORTED_VOCAB_KEY = 'vocabforge_imported_items';

export const QUESTION_BANK = [
  {
    id: 'idiom-1',
    category: 'idioms',
    word: 'Break the ice',
    options: ['Start a conversation', 'Cause an argument', 'Feel very cold', 'Make a promise'],
    correctAnswer: 'Start a conversation',
  },
  {
    id: 'idiom-2',
    category: 'idioms',
    word: 'Hit the sack',
    options: ['Pack a bag', 'Go to sleep', 'Start exercising', 'Skip work'],
    correctAnswer: 'Go to sleep',
  },
  {
    id: 'idiom-3',
    category: 'idioms',
    word: 'Under the weather',
    options: ['Feeling unwell', 'Standing outside', 'Traveling abroad', 'Working late'],
    correctAnswer: 'Feeling unwell',
  },
  {
    id: 'vocab-1',
    category: 'vocabulary',
    word: 'Meticulous',
    options: ['Careless', 'Very careful', 'Very loud', 'Extremely fast'],
    correctAnswer: 'Very careful',
  },
  {
    id: 'vocab-2',
    category: 'vocabulary',
    word: 'Benevolent',
    options: ['Kind and generous', 'Very angry', 'Highly skilled', 'Deeply confused'],
    correctAnswer: 'Kind and generous',
  },
  {
    id: 'vocab-3',
    category: 'vocabulary',
    word: 'Ephemeral',
    options: ['Lasting forever', 'Short-lived', 'Extremely bright', 'Hard to explain'],
    correctAnswer: 'Short-lived',
  },
  {
    id: 'phrasal-1',
    category: 'phrasal-verbs',
    word: 'Look up',
    options: ['Search for information', 'Ignore someone', 'Visit quickly', 'Wake up late'],
    correctAnswer: 'Search for information',
  },
  {
    id: 'phrasal-2',
    category: 'phrasal-verbs',
    word: 'Carry on',
    options: ['Stop immediately', 'Continue', 'Pack luggage', 'Speak softly'],
    correctAnswer: 'Continue',
  },
  {
    id: 'phrasal-3',
    category: 'phrasal-verbs',
    word: 'Run into',
    options: ['Drive quickly', 'Meet unexpectedly', 'Spend money', 'Win a race'],
    correctAnswer: 'Meet unexpectedly',
  },
  {
    id: 'custom-1',
    category: 'custom',
    word: 'Ubiquitous',
    options: ['Rare and unusual', 'Present everywhere', 'Used once', 'Difficult to read'],
    correctAnswer: 'Present everywhere',
  },
  {
    id: 'custom-2',
    category: 'custom',
    word: 'Alleviate',
    options: ['Worsen', 'Reduce pain', 'Collect data', 'Predict outcomes'],
    correctAnswer: 'Reduce pain',
  },
  {
    id: 'custom-3',
    category: 'custom',
    word: 'Ambiguous',
    options: ['Clear and direct', 'Open to multiple meanings', 'Impossible to hear', 'Easy to forget'],
    correctAnswer: 'Open to multiple meanings',
  },
];

function normalizeImportedItem(item, index) {
  const safeCategory = item.category?.trim() || 'custom';

  return {
    id: `imported-${safeCategory}-${item.word}-${index}`.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    category: safeCategory,
    word: item.word.trim(),
    options: item.options.map((option) => String(option).trim()),
    correctAnswer: item.meaning.trim(),
  };
}

export function getImportedQuestions() {
  try {
    const raw = localStorage.getItem(IMPORTED_VOCAB_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item) => item && item.word && item.meaning && Array.isArray(item.options) && item.options.length === 4)
      .map(normalizeImportedItem);
  } catch {
    return [];
  }
}

export function mergeImportedVocabulary(items) {
  const existing = (() => {
    try {
      const raw = localStorage.getItem(IMPORTED_VOCAB_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  const merged = [...existing];

  items.forEach((item) => {
    const alreadyExists = merged.some(
      (entry) => entry.word?.toLowerCase() === item.word?.toLowerCase()
        && entry.meaning?.toLowerCase() === item.meaning?.toLowerCase()
    );

    if (!alreadyExists) {
      merged.push(item);
    }
  });

  localStorage.setItem(IMPORTED_VOCAB_KEY, JSON.stringify(merged));
  return merged.length - existing.length;
}

export function getAllQuestions() {
  return [...QUESTION_BANK, ...getImportedQuestions()];
}

export function getQuestionsByCategory(category) {
  const allQuestions = getAllQuestions();

  if (!category || category === 'all') {
    return allQuestions;
  }

  return allQuestions.filter((question) => question.category === category);
}

export function getQuestionsByIds(ids = []) {
  const idSet = new Set(ids);
  return getAllQuestions().filter((question) => idSet.has(question.id));
}
