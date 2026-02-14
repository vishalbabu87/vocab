import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import QuizCard from '../components/QuizCard';
import { useQuiz } from '../context/QuizContext';
import { getQuestionsByCategory, getQuestionsByIds } from '../data/questions';

const ATTEMPTS_KEY = 'vocabforge_attempts';
const INCORRECT_COUNTS_KEY = 'vocabforge_incorrect_counts';
const LAST_INCORRECT_KEY = 'vocabforge_last_incorrect';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function Quiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'idioms';
  const retryMode = searchParams.get('retry') === '1';

  const {
    currentQuestion,
    score,
    totalQuestions,
    answeredCount,
    startQuiz,
    submitAnswer,
    nextQuestion,
    isComplete,
    resetQuiz,
  } = useQuiz();

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const hasFinalized = useRef(false);

  const questions = useMemo(() => {
    if (retryMode) {
      const lastIncorrect = readJson(LAST_INCORRECT_KEY, []);
      return getQuestionsByIds(lastIncorrect.map((item) => item.id));
    }

    return getQuestionsByCategory(category);
  }, [category, retryMode]);

  useEffect(() => {
    resetQuiz();
    setSelectedAnswer(null);
    setIsLocked(false);
    setIncorrectQuestions([]);
    hasFinalized.current = false;

    if (questions.length === 0) {
      navigate('/', { replace: true });
      return;
    }

    startQuiz(questions);
  }, [navigate, questions, resetQuiz, startQuiz]);

  useEffect(() => {
    if (!isComplete || hasFinalized.current) {
      return;
    }

    hasFinalized.current = true;

    const attempts = Number(localStorage.getItem(ATTEMPTS_KEY) || '0') + 1;
    localStorage.setItem(ATTEMPTS_KEY, String(attempts));

    const incorrectCounts = readJson(INCORRECT_COUNTS_KEY, {});
    incorrectQuestions.forEach((item) => {
      incorrectCounts[item.word] = (incorrectCounts[item.word] || 0) + 1;
    });

    localStorage.setItem(INCORRECT_COUNTS_KEY, JSON.stringify(incorrectCounts));
    localStorage.setItem(LAST_INCORRECT_KEY, JSON.stringify(incorrectQuestions));

    navigate('/dashboard', {
      replace: true,
      state: {
        attempts,
        totalQuestions,
        correctAnswers: score,
        incorrectQuestions,
      },
    });
  }, [incorrectQuestions, isComplete, navigate, score, totalQuestions]);

  const handleSelect = (option) => {
    if (!currentQuestion || isLocked) {
      return;
    }

    const isCorrect = submitAnswer(option);

    setSelectedAnswer(option);
    setIsLocked(true);

    if (!isCorrect) {
      setIncorrectQuestions((previous) => [
        ...previous,
        {
          id: currentQuestion.id,
          category: currentQuestion.category,
          word: currentQuestion.word,
          selectedAnswer: option,
          correctAnswer: currentQuestion.correctAnswer,
        },
      ]);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsLocked(false);
    nextQuestion();
  };

  if (!currentQuestion) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-4">
        <p className="text-zinc-400">Preparing quiz...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-6 rounded-2xl bg-zinc-800 p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-zinc-400">Category: {retryMode ? 'Retry Incorrect' : category}</p>
          <p className="text-sm font-medium text-indigo-400">Score: {score}</p>
        </div>
        <ProgressBar current={answeredCount} total={totalQuestions} />
      </div>

      <QuizCard
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        isLocked={isLocked}
        onSelect={handleSelect}
      />

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          disabled={!isLocked}
          className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next Question
        </button>
      </div>
    </div>
  );
}
