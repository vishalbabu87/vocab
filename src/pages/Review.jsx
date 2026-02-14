import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const LAST_INCORRECT_KEY = 'vocabforge_last_incorrect';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function Review() {
  const navigate = useNavigate();
  const incorrect = useMemo(() => readJson(LAST_INCORRECT_KEY, []), []);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-zinc-100">Review Incorrect Answers</h1>

      {incorrect.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-zinc-800 p-6 shadow-lg">
          <p className="text-zinc-400">No incorrect answers from your last session.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {incorrect.map((item) => (
            <li key={item.id} className="rounded-2xl bg-zinc-800 p-5 shadow-lg">
              <p className="text-sm text-zinc-400">Word</p>
              <p className="mt-1 text-xl font-semibold text-zinc-100">{item.word}</p>
              <p className="mt-3 text-sm text-zinc-400">Your answer</p>
              <p className="text-red-300">{item.selectedAnswer}</p>
              <p className="mt-2 text-sm text-zinc-400">Correct answer</p>
              <p className="text-green-300">{item.correctAnswer}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => navigate('/quiz?retry=1')}
          className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-indigo-400"
        >
          Retry Quiz
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-xl bg-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-100 transition duration-200 hover:bg-zinc-600"
        >
          Back Home
        </button>
      </div>
    </div>
  );
}
