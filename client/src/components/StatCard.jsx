
export default function StatCard({ label, value, type }) {
  // Determine text coloring classes dynamically.
  const colorClass =
    type === 'income'
      ? 'pos'
      : type === 'expense'
        ? 'neg'
        : value >= 0
          ? 'pos'
          : 'neg';

  const formattedAmount = `KSh ${Number(value || 0).toLocaleString(
    'en-KE',
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;

  return (
    <div className="score-card shadow-sm">
      <h3>{label}</h3>
      <p className={`amt-large ${colorClass}`}>
        {formattedAmount}
      </p>
    </div>
  );
}
