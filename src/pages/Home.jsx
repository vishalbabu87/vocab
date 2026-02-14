import { useNavigate } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import FileUploader from '../components/FileUploader';

const CATEGORIES = [
  { key: 'idioms', title: 'Idioms', description: 'Practice common expressions and real-life meanings.' },
  { key: 'vocabulary', title: 'Vocabulary', description: 'Expand word power with high-impact terms.' },
  { key: 'phrasal-verbs', title: 'Phrasal Verbs', description: 'Master practical verb combinations quickly.' },
  { key: 'custom', title: 'Custom', description: 'Train with a mixed custom-ready sample set.' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-zinc-100">VocabForge</h1>
        <p className="mt-2 text-zinc-400">Choose a category to begin your quiz session.</p>
      </header>

      <div className="mb-6">
        <FileUploader />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CATEGORIES.map((category) => (
          <CategoryCard
            key={category.key}
            title={category.title}
            description={category.description}
            onClick={() => navigate(`/quiz?category=${category.key}`)}
          />
        ))}
      </div>
    </div>
  );
}
