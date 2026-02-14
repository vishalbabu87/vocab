import OptionButton from './OptionButton';

export default function QuizCard({
  question,
  selectedAnswer,
  isLocked,
  onSelect,
}) {
  return (
    <section className="rounded-2xl bg-zinc-800 p-6 shadow-lg">
      <p className="text-sm uppercase tracking-wide text-zinc-400">Current word</p>
      <h2 className="mt-2 text-2xl font-bold text-zinc-100">{question.word}</h2>

      <div className="mt-6 grid gap-3">
        {question.options.map((option) => {
          const isCorrect = option === question.correctAnswer;
          const isSelected = selectedAnswer === option;
          const isWrong = isLocked && isSelected && !isCorrect;

          return (
            <OptionButton
              key={option}
              option={option}
              disabled={isLocked}
              isSelected={isSelected}
              isCorrect={isCorrect}
              isWrong={isWrong}
              onClick={() => onSelect(option)}
            />
          );
        })}
      </div>
    </section>
  );
}
