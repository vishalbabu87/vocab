export default function OptionButton({
  option,
  disabled,
  isSelected,
  isCorrect,
  isWrong,
  onClick,
}) {
  let tone = 'border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-zinc-700';

  if (disabled && isCorrect) {
    tone = 'border-green-500 bg-green-500/20 text-green-200';
  } else if (disabled && isWrong) {
    tone = 'border-red-500 bg-red-500/20 text-red-200';
  } else if (isSelected) {
    tone = 'border-indigo-500 bg-indigo-500/20 text-indigo-200';
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition duration-200 ${tone} ${
        disabled ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
      }`}
    >
      {option}
    </button>
  );
}
