import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ATTEMPTS_KEY = 'vocabforge_attempts';
const INCORRECT_COUNTS_KEY = 'vocabforge_incorrect_counts';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const attempts = state?.attempts ?? Number(localStorage.getItem(ATTEMPTS_KEY) || '0');
  const totalQuestions = state?.totalQuestions ?? 0;
  const correctAnswers = state?.correctAnswers ?? 0;

  const accuracy = totalQuestions > 0
    ? Math.round((correctAnswers / totalQuestions) * 100)
    : 0;

  const weakWords = useMemo(() => {
    const counts = readJson(INCORRECT_COUNTS_KEY, {});
    return Object.entries(counts)
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1]);
  }, []);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-zinc-100">Dashboard</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <article className="rounded-2xl bg-zinc-800 p-5 shadow-lg">
          <p className="text-sm text-zinc-400">Total Attempts</p>
          <p className="mt-2 text-3xl font-bold text-zinc-100">{attempts}</p>
        </article>

        <article className="rounded-2xl bg-zinc-800 p-5 shadow-lg">
          <p className="text-sm text-zinc-400">Accuracy</p>
          <p className="mt-2 text-3xl font-bold text-indigo-400">{accuracy}%</p>
        </article>

        <article className="rounded-2xl bg-zinc-800 p-5 shadow-lg">
          <p className="text-sm text-zinc-400">Weak Words</p>
          <p className="mt-2 text-3xl font-bold text-zinc-100">{weakWords.length}</p>
        </article>
      </div>

      <section className="mt-6 rounded-2xl bg-zinc-800 p-5 shadow-lg">
        <h2 className="text-lg font-semibold text-zinc-100">Weak words (wrong ≥ 2 times)</h2>
        {weakWords.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-400">No weak words yet.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            {weakWords.map(([word, count]) => (
              <li key={word} className="flex items-center justify-between rounded-lg bg-zinc-700/50 px-3 py-2">
                <span>{word}</span>
                <span className="text-zinc-400">{count} misses</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => navigate('/review')}
          className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-indigo-400"
        >
          Review Incorrect Answers
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
