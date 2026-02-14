export default function CategoryCard({ title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl bg-zinc-800 p-6 text-left shadow-lg transition duration-200 hover:-translate-y-1 hover:bg-zinc-700"
    >
      <h2 className="text-xl font-semibold text-zinc-100">{title}</h2>
      <p className="mt-2 text-sm text-zinc-400">{description}</p>
      <span className="mt-4 inline-block text-sm font-medium text-indigo-400">Start Quiz →</span>
    </button>
  );
}
